export interface UserInfo {
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

export interface UserExtendedInfo {
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
