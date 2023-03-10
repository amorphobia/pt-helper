import { CarPT } from "./sites/carpt.net";
import { Hhanclub } from "./sites/hhanclub.top";
import { KamePT } from "./sites/kamept.com";
import { NanyangPT } from "./sites/nanyangpt.com";
import { _2xFree } from "./sites/pt.2xfree.org";
import { BTSCHOOL } from "./sites/pt.btschool.club";
import { SJTU } from "./sites/pt.sjtu.edu.cn";
import { Pterclub } from "./sites/pterclub.com";
import { TJUPT } from "./sites/tjupt.org/index";
import { DMHY } from "./sites/u2.dmhy.org";
import { HDarea } from "./sites/www.hdarea.co";
import { HTPT } from "./sites/www.htpt.cc";
import { ICC2022 } from "./sites/www.icc2022.com";
import { ZmPT } from "./sites/zmpt.cc";

const host = window.location.host;
const sites = new Map<string, any>([
    ["carpt.net", CarPT],
    ["hhanclub.top", Hhanclub],
    ["kamept.com", KamePT],
    ["nanyangpt.com", NanyangPT],
    ["pt.2xfree.org", _2xFree],
    ["pt.btschool.club", BTSCHOOL],
    ["pt.sjtu.edu.cn", SJTU],
    ["pterclub.com", Pterclub],
    ["tjupt.org", TJUPT],
    ["u2.dmhy.org", DMHY],
    ["www.hdarea.co", HDarea],
    ["www.htpt.cc", HTPT],
    ["www.icc2022.com", ICC2022],
    ["zmpt.cc", ZmPT],
]);
const site = sites.has(host) ? new (sites.get(host))() : undefined;

if (site) {
    site.init();
    site.onLoad();
    site.addStyle();
}
