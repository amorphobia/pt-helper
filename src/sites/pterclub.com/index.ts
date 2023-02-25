import { NexusPHP } from "../../architectures/NexusPHP";

export class Pterclub extends NexusPHP {
    constructor() {
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
        this.attendance();
    }

    private attendance() {
        if (!this.getHostValue("attendance")) {
            return;
        }
        const span = document.querySelector("span#attendance-wrap");
        if (span && (span.innerHTML.indexOf("已") >= 0 || (span.innerHTML.indexOf("got") >= 0))) {
            return;
        }

        this.makeGetRequest("https://" + this.host + "/attendance-ajax.php").then(console.log, console.log);
    }
}
