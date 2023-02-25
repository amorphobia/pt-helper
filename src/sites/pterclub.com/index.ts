import { NexusPHP } from "../../architectures/NexusPHP";

export class Pterclub extends NexusPHP {
    locale: string = "zh-CN";
    constructor(locale: string) {
        super("pterclub.com");

        this.menu_items = [
            {
                "id": "bannerHide",
                "type": "switch",
                "display": "隐藏横幅",
                "name": "隐藏横幅",
                "value": false
            },
            {
                "id": "attendance",
                "type": "switch",
                "display": "自动签到",
                "name": "自动签到",
                "value": true
            }
        ].concat(this.menu_items);

        this.locale = locale;
    }

    protected tweakBanner(): void {
        if (this.getHostValue("bannerHide")) {
            this.css += `
table.head {
    display: none;
}`;
        }
    }

    public onLoad(): void {
        super.onLoad();
    }

    private attendance() {
        if (!this.getHostValue("attendance")) {
            return;
        }
        const last_time = Date.parse(String(this.getHostValue("lastAttendanceTime")));
        const last_date = isNaN(last_time) ? new Date("01 Jan 1970 00:00:00 GMT") : new Date(last_time);
    }
}
