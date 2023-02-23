import { NexusPHP } from "../../architectures/NexusPHP/index";

export class Hhanclub extends NexusPHP {
    constructor() {
        super("hhanclub.top");

        this.menu_items = [
            {
                "id": "bannerFold",
                "type": "switch",
                "display": "自动折叠横幅（隐藏时折叠设置无效）",
                "name": "自动折叠横幅",
                "value": true
            },
            {
                "id": "bannerHide",
                "type": "switch",
                "display": "隐藏横幅（隐藏时折叠设置无效）",
                "name": "隐藏横幅",
                "value": false
            }
        ].concat(this.menu_items);
    }

    public onLoad(): void {
        super.onLoad();
    }

    protected tweakBanner(): void {
        if (this.getHostValue("bannerHide")) {
            this.css += `
td.clear.nowrap img {
    display: none;
}`;
        } else if (this.getHostValue("bannerFold")) {
            const banner = document.querySelector("td.clear.nowrap");
            const original_height = banner?.clientHeight;
            this.css += `
td.clear.nowrap img {
    height: 10px;
    overflow: hidden;
    transition: height 0.5s;
}

td.clear.nowrap img:hover {
    height: ${original_height}px;
}`;
        }
    }
}
