import { NexusPHP } from "../../architectures/NexusPHP";
import { I18N } from "../../i18n/i18n";

export class ICC2022 extends NexusPHP {
    constructor() {
        super("www.icc2022.com");

        this.menu_items = [
            {
                "id": "bannerHide",
                "type": "switch",
                "display": I18N[this.locale].bannerHideName,
                "name": I18N[this.locale].bannerHideName,
                "value": false
            },
            {
                "id": "attendance",
                "type": "switch",
                "display": I18N[this.locale].attendance,
                "name": I18N[this.locale].attendance,
                "value": true
            }
        ].concat(this.menu_items);
    }

    public onLoad(): void {
        super.onLoad();
    }
}
