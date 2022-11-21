import { l, chalk, microtime, allowLog } from "../lib/common.js";
import feedActions from "../lib/actions/feedActions.js";
const { postUrl } = feedActions;
function func({
    $,
    item,
    resolve,
    reject,
    log,
    fetch,
    isEmpty,
    jsStringEscape,
    pageUrl,
    args,
}) {
    try {
        //========================"
        let t = $('meta[property="bt:pubDate"]').attr("content");
        if (!t) {
            reject(item);
            return;
        }
        if (
            item.image ==
            "https://www.recordonline.com/Global/images/head/nameplate/recordonline_logo.png"
        )
            item.image =
                "https://pbs.twimg.com/profile_images/458994380880093184/0J_K0dU1_400x400.jpeg";
        let month = t.substring(4, 6);
        let year = t.substring(0, 4);
        let day = t.substring(6, 8);
        let time = t.substring(9, 17);
        let s = year + "-" + month + "-" + day + "T" + time + "-05:00";
        log("s=" + s);
        item.published_time = (Date.parse(s) / 1000) | 0;
        log("published_time=" + item.published_time);
        item.site_name = "Times Herald-Record";
        if (
            item.author.indexOf("Associated Press") >= 0 ||
            item.author.indexOf("Bloomberg") >= 0 ||
            item.author.indexOf("Washington Post") >= 0 ||
            item.author.indexOf("/Briefing") >= 0
        )
            reject(item);
        else resolve(item);

        //20170101T16:06:18Z
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
