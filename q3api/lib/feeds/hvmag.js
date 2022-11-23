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
        if (!item.image) {
            reject(item);
        } else {
            item.site_name = "Hudson Valley Magazine";
            let url = $('meta[property="og:url"]').attr("content");
            if (url) item.url = url;
            item.author = $(".by-line").text();

            let published_time = $("time").attr("datetime");

            log("pt=" + published_time);
            item.published_time = (Date.parse(published_time) / 1000) | 0;
            log("published_time=" + item.published_time);
            resolve(item);
        }
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
