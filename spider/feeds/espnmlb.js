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
        //log(JSON.stringify(item))
        //log($('.article-body').text())
        log(item.url);
        item.author = $(".article-meta .author").text();
        //if(isEmpty(item.author))
        //  item.author="ESPN"
        if (item.author && item.author.indexOf("ESPN") > -1)
            item.author = item.author.split("ESPN")[0];

        if (item.author && item.author.indexOf("Associated Press") > -1)
            item.author = "";
        //log("published time:"+item.published_time)
        log("author:" + item.author);
        var date = new Date();
        //log("fixing time")
        item.published_time =
            item.published_time + date.getTimezoneOffset() * 60; // fix for TZ
        item.locale = "cdn";
        resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
