import { Hhanclub } from "./sites/hhanclub.top";
import { NanyangPT } from "./sites/nanyangpt.com";
import { SJTU } from "./sites/pt.sjtu.edu.cn";
import { Pterclub } from "./sites/pterclub.com";
import { TJUPT } from "./sites/tjupt.org/index";

const host = window.location.host;
const sites = new Map<string, any>([
    ["hhanclub.top", new Hhanclub()],
    ["nanyangpt.com", new NanyangPT()],
    ["pt.sjtu.edu.cn", new SJTU()],
    ["pterclub.com", new Pterclub()],
    ["tjupt.org", new TJUPT()]
]);
const site = sites.get(host);

if (site) {
    site.init();
    site.onLoad();
    site.addStyle();
}
