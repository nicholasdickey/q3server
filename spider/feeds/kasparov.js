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
        if (isEmpty(item.site_name)) item.site_name = "Kasparov.Ru";
        if (isEmpty(item.author)) item.author = $(".author").text();
        item.description = $("meta[property='og:description']").attr("content");
        item.locale = "ru_RU";
        //item.published_time-=7*3600
        item.url = $("meta[property='og:url']").attr("content");
        resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
