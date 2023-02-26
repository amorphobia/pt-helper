import { Common } from "../../common";
import { UserExtendedInfo, UserInfo } from "./defs";

export class Gazelle extends Common {
    jsonAPI: boolean = true;
    userInfo?: UserInfo;
    userExtendedInfo?: UserExtendedInfo;
    snatched = new Set<number>();
    uploaded: number[] = [];
    leeching: number[] = [];
    seeding: number[] = [];
    perfectFLACs: number[] = [];
    uniqueGroups = new Set<number>();

    constructor(host: string, jsonAPI: boolean) {
        super(host);
        this.jsonAPI = jsonAPI;
    }

    public onLoad(): void {
        super.onLoad();
        (async () => {
            try {
                if (this.jsonAPI) {
                    console.log("b4 info");
                    await this.fetchUserInfoJSON().then(console.log, console.error);
                    console.log("after info");
                    console.log(this.userInfo);
                    // await this.fetchUserExtendedInfoJSON();
                }
                // await this.fetchSnatched();
            } catch (err) {
                console.error(err);
            }
        })();
    }

    protected async fetchUserInfoJSON(): Promise<void> {
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

    protected async fetchUserExtendedInfoJSON(): Promise<void> {
        const data = this.getHostValue("userExtendedInfo");
        const info = data ? String(data) : "";
        console.log("info: " + info);

        try {
            this.userExtendedInfo = JSON.parse(info);
        } catch (error) { console.error(error); }
        if (this.userExtendedInfo?.status == "success") {
            return Promise.resolve();
        }

        const id = this.userInfo?.response?.id;
        console.log(id);
        const url = id != undefined ? "https://" + this.host + `/ajax.php?action=user&id=${id}` : "";
        console.log("ext info url: " + url);
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
        return (new Promise(() => {
            this.makeGetRequest(url).then(async (response) => {
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

                let scanned = this.scanTorrents(container);

                for (let page = 2; page <= lastPage; page++) {
                    const page_url = url + `&page=${page}`;
                    console.log(page_url);
                    await this.makeGetRequest(page_url).then((resp) => {
                        const page_container = document.implementation.createHTMLDocument().documentElement;
                        page_container.innerHTML = String(resp);
                        let scanned_page = this.scanTorrents(page_container);
                        scanned.groups = new Set([...scanned.groups, ...scanned_page.groups]);
                        scanned.torrents = new Set([...scanned.torrents, ...scanned_page.torrents]);
                    });
                }

                this.snatched = new Set([...this.snatched, ...scanned.torrents]);
                this.uniqueGroups = new Set([...this.uniqueGroups, ...scanned.groups]);
                console.log("this snatched: ");
                console.log(this.snatched);
                console.log("this groups: ");
                console.log(this.uniqueGroups);
            });
        }));
    }

    protected scanTorrents(doc: HTMLElement): {
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

        const re = /id=(\d+)&torrentid=(\d+)/;
        for (const link of links) {
            const href = (link as HTMLAnchorElement).href;
            const result = re.exec(href);
            if (!result) { continue; }

            groups.add(Number(result[1]));
            torrents.add(Number(result[2]));
        }
        return { groups: groups, torrents: torrents };
    }
}
