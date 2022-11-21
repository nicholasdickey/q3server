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
        item.site_name = "Roger Ebert";
        var dt = $('time[itemprop="datePublished"]').attr("datetime");
        console.log("dt=" + dt);
        item.published_time = (Date.parse(dt) / 1000) | 0;
        log("item.published_time=" + item.published_time);

        resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
