import { CarPT } from "./sites/carpt.net";
import { Hhanclub } from "./sites/hhanclub.top";
import { NanyangPT } from "./sites/nanyangpt.com";
import { SJTU } from "./sites/pt.sjtu.edu.cn";
import { Pterclub } from "./sites/pterclub.com";
import { TJUPT } from "./sites/tjupt.org/index";
import { HDarea } from "./sites/www.hdarea.co";
import { HTPT } from "./sites/www.htpt.cc";
import { ZmPT } from "./sites/zmpt.cc";

const host = window.location.host;
const sites = new Map<string, any>([
    ["carpt.net", CarPT],
    ["hhanclub.top", Hhanclub],
    ["nanyangpt.com", NanyangPT],
    ["pt.sjtu.edu.cn", SJTU],
    ["pterclub.com", Pterclub],
    ["tjupt.org", TJUPT],
    ["www.hdarea.co", HDarea],
    ["www.htpt.cc", HTPT],
    ["zmpt.cc", ZmPT],
]);
const site = sites.has(host) ? new (sites.get(host))() : undefined;

if (site) {
    site.init();
    site.onLoad();
    site.addStyle();
}
