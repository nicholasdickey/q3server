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
        item.site_name = "NY Daily News";
        var date = new Date();
        if (item.title.indexOf("Page Not Found") >= 0) return reject(item);
        item.published_time =
            item.published_time + date.getTimezoneOffset() * 60; // fix for TZ
        resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
