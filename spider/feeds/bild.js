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
        item.url = $('meta[property="og:url"]').attr("content");
        let d = $('time[itemprop="datePublished"]').attr("datetime");
        item.published_time = (Date.parse(d) / 1000) | 0;
        log("published_time=" + item.published_time);
        item.author = $('span[itemprop="name"]').text();

        return resolve(item);

        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
    reject(item);
}
export default func;
