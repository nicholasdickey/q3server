import { l, chalk, microtime, allowLog } from "../common.js";
import feedActions from "../actions/feedActions.js";
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
        let pt = $('meta[property="og:article:published_time"]').attr(
            "content"
        );
        log("pt1=" + pt);
        item.published_time = (Date.parse(pt) / 1000) | 0;
        log("pt=" + item.published_time);
        let s = item.url.split("/?utm");
        item.url = s[0];
        resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
