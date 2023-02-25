import { Common } from "../../common";

interface UserInfo {
    status: string,
    response?: {
        username: string,
        id: number,
        authkey: string,
        passkey: string,
        notifications: {
            messages: number,
            notifications: number,
            newAnnouncement: boolean,
            newBlog: boolean,
            newSubscriptions: boolean
        },
        userstats: {
            uploaded: number,
            downloaded: number,
            ratio: number,
            requiredratio: number,
            class: string,
            joinedDate?: string,
            lastAccess?: string,
            bonusPoints?: number,
            seedingSize?: number,
            seedingBonusPointsPerHour?: number,
            leechingCount?: number,
            snatchedCount?: number
        }
    }
}

interface UserExtendedInfo {
    status: string,
    response?: {
        isFriend: boolean,
        personal: {
            donor: boolean,
            enabled: boolean,
            class: string,
            warned: boolean,
            passkey: string,
            paranoiaText: string,
            paranoia: number
        },
        ranks: {
            requests: number,
            overall: number,
            posts: number,
            uploaded: number,
            downloaded: number,
            artists: number,
            uploads: number,
            bounty: number
        },
        community: {
            artistComments: number,
            artistsAdded: number,
            requestComments: number,
            leeching: number,
            collagesStarted: number,
            seeding: number,
            perfectFlacs?: number,
            collageComments: number,
            groups: number,
            requestsFilled: number,
            invited: number,
            bountySpent: null | number,
            snatched: number,
            torrentComments: number,
            bountyEarned: null | number,
            posts: number,
            collagesContrib: number,
            requestsVoted: number,
            uploaded: number
        },
        username: string,
        profileText: string,
        stats: {
            lastAccess: string,
            requiredRatio: number,
            uploaded: number,
            downloaded: number,
            ratio: string,
            joinedDate: string
        },
        avatar: string
    }
}

export class Gazelle extends Common {
    jsonAPI: boolean = true;
    userInfo?: UserInfo;
    userExtendedInfo?: UserExtendedInfo;
    snatched = new Set<number>();
    uploaded: number[] = [];
    leeching: number[] = [];
    seeding: number[] = [];
    perfectFLACs: number[] = [];
    uniqueGroups: number[] = [];

    constructor(host: string, jsonAPI: boolean) {
        super(host);
        this.jsonAPI = jsonAPI;
    }

    public onLoad(): void {
        super.onLoad();
        (async () => {
            if (this.jsonAPI) {
                await this.fetchUserInfoJSON();
                await this.fetchUserExtendedInfoJSON();
            }
        })();
        this.fetchSnatched();
    }

    protected async fetchUserInfoJSON() {
        const data = this.getHostValue("userInfo");
        const info = data ? String(data) : "";

        try {
            this.userInfo = JSON.parse(info);
        } catch (error) {}
        if (this.userInfo?.status == "success") {
            return Promise.resolve();
        }

        const url = "https://" + this.host + "/ajax.php?action=index";
        return new Promise((_resolve, reject) => {
            this.makeGetRequest(url).then((response) => {
                let info: UserInfo;
                const text = String(response);
                try {
                    info = JSON.parse(text);
                } catch (err) {
                    reject(err);
                    return;
                }

                if (!info || !info.status || info.status != "success") {
                    reject("User info: bad response.");
                    return;
                }

                this.userInfo = info;
                this.setHostValue("userInfo", text);
            }, reject);
        });
    }

    protected async fetchUserExtendedInfoJSON() {
        const data = this.getHostValue("userExtendedInfo");
        const info = data ? String(data) : "";

        try {
            this.userExtendedInfo = JSON.parse(info);
        } catch (error) {}
        if (this.userExtendedInfo?.status == "success") {
            return Promise.resolve();
        }

        const id = this.userInfo?.response?.id;
        const url = id != undefined ? "https://" + this.host + `/ajax.php?action=user&id=${id}` : "";
        return new Promise((_resolve, reject) => {
            this.makeGetRequest(url).then((response) => {
                let info: UserExtendedInfo;
                const text = String(response);
                try {
                    info = JSON.parse(text);
                } catch (err) {
                    reject(err);
                    return;
                }

                if (!info || !info.status || info.status != "success") {
                    reject("User extended info: bad response.");
                    return;
                }

                this.userExtendedInfo = info;
                this.setHostValue("userExtendedInfo", text);
            }, reject);
        });
    }

    protected async fetchSnatched() {
        const data = this.getHostValue("snatched");
        const info = data ? String(data) : "";

        try {
            this.snatched = JSON.parse(info);
        } catch (error) {}

        const id = this.userInfo?.response?.id;
        const url = id != undefined ? "https://" + this.host + `/torrents.php?type=snatched&userid=${id}` : "";
        (new Promise(() => {
            this.makeGetRequest(url).then((response) => {
                console.log(response);
                const container = document.implementation.createHTMLDocument().documentElement;
                container.innerHTML = String(response);

                let lastPage = 1;
                const last = container.querySelector("#content .linkbox > a:last-of-type");
                if (!last) { return Promise.resolve(); }
                const anchor = last as HTMLAnchorElement;
                const p_re = /page=(\d+)/;
                const result = p_re.exec(anchor.href);
                if (result) {
                    lastPage = Number(result[1]);
                    if (lastPage <= 0) { lastPage = 1; }
                }

                // const el = container.querySelector("#content > .thin > table");
                // if (!el) { return Promise.resolve(); }

                // scan this page
                let scanned = this.scanTorrents(container);

                for (let page = 2; page <= lastPage; page++) {
                    // 
                }
            });
        })).then();
    }

    protected scanTorrents(doc: Element): {
        groups: Set<number>,
        torrents: Set<number>
    } {
        const table = doc.querySelector("#content > .thin > table");
        if (!table) {
            return {
                groups: new Set<number>(),
                torrents: new Set<number>()
            };
        }

        const links = table.querySelectorAll("div.group_info > a.tooltip");
        if (!links) {
            return {
                groups: new Set<number>(),
                torrents: new Set<number>()
            };
        }

        let groups = new Set<number>();
        let torrents = new Set<number>();

        for (const link of links) {
            const href = (link as HTMLAnchorElement).href;
            const re = /id=(\d+)&torrentid=(\d+)/;
            const result = re.exec(href);
            if (!result) { continue; }

            groups.add(Number(result[1]));
            torrents.add(Number(result[2]));
        }
        return { groups: groups, torrents: torrents };
    }
}
