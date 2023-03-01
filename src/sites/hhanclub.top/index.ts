import { NexusPHP } from "../../architectures/NexusPHP/index";
import { I18N } from "../../i18n/i18n";

export class Hhanclub extends NexusPHP {
    constructor() {
        super("hhanclub.top");

        this.menu_items = [
            {
                "id": "bannerFold",
                "type": "switch",
                "display": I18N[this.locale].bannerFold,
                "name": I18N[this.locale].bannerFoldName,
                "value": true
            },
            {
                "id": "bannerHide",
                "type": "switch",
                "display": I18N[this.locale].bannerHide,
                "name": I18N[this.locale].bannerHideName,
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
