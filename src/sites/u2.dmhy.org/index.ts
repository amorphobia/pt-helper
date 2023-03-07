import { NexusPHP } from "../../architectures/NexusPHP";
import { I18N } from "../../i18n/i18n";

export class DMHY extends NexusPHP {
    constructor() {
        super("u2.dmhy.org");

        this.menu_items = [
            {
                "id": "bannerHide",
                "type": "switch",
                "display": I18N[this.locale].bannerHideName,
                "name": I18N[this.locale].bannerHideName,
                "value": false
            }
        ].concat(this.menu_items);
    }

    public onLoad(): void {
        super.onLoad();
    }

    protected sayThanks(ms = 2000): void {
        if (!this.getHostValue("thanks") || location.href.indexOf("/details.php") < 0) {
            return;
        }
        this.wait(ms).then(() => {
            const url = window.location.href;
            const result = /id=(\d+)/.exec(url);
            if (!result) {
                return;
            }
            const input = document.querySelector("[onclick=\"saythanks(" + result[1] + ",0);\"]") as HTMLInputElement;
            if (input && !input.disabled) {
                input.click();
            }
        }).catch(() => { console.error("Failed to say thanks."); });
    }
}
