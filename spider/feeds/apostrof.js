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
        if (item.title.indexOf("404") !== -1) {
            reject(item);
            return;
        }
        if (isEmpty(item.published_time))
            item.published_time = (Date.parse(item.rss.date) / 1000) | 0;
        if (isEmpty(item.author))
            item.author = $("span.article__author").first().text();
        if (isEmpty(item.author)) item.author = "Апостроф";
        item.locale = "ua_UA";
        item.url = $('meta[property="og:url"]').attr("content");
        return resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
    reject(item);
}
export default func;
