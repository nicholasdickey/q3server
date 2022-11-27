import { l, chalk, microtime, allowLog } from "../common.js";
import runFeedActions from "../actions/runFeedActions.js";
const { postUrl } = runFeedActions;
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
        item.author = $('meta[name="Author"]').attr("content");
        item.url = $('meta[property="og:url"]').attr("content");
        let dt = $('meta[itemprop="datePublished"]').attr("content");
        if (!dt) {
            dt = $('meta[name="parsely-pub-date"]').attr("content");
        } else {
            dt = dt.replace("+00:00", "-05:00");
        }
        log("dt=" + dt);
        item.published_time = (Date.parse(dt) / 1000) | 0;
        log(item.published_time);
        resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
