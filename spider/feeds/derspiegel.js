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
        let published_time = $('meta[name="date"]').attr("content");

        log("pt=" + published_time);
        item.published_time = (Date.parse(published_time) / 1000) | 0;
        item.author = $('meta[name="author"]').attr("content");
        log(item.published_time);
        item.url = $('meta[property="og:url"]').attr("content");
        log(item.url);
        resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
