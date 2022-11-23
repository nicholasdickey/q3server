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
        item.site_name = "SF Chronicle";
        item.author = item.author.substring(2);
        let publishedTime = $("meta[name='sailthru.date']").attr("content");
        //log("v2")
        log("publishedTime=" + publishedTime); //.split(",")[1]+':00 EDT')
        let jsDate = (Date.parse(publishedTime) / 1000) | 0;
        log(jsDate);
        var date = new Date();
        log("fixing time");
        item.published_time = jsDate; //+date.getTimezoneOffset()*60// fix for TZ
        log("final time=" + item.published_time);
        resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
