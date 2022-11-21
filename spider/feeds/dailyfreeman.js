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
        item.site_name = "Daily Freeman";
        item.author = $(".byline").text();
        if (item.author.indexOf("By") > -1) {
            item.author = item.author.split("By")[1].trim();
        }
        if (item.author.indexOf(".") > -1) {
            item.author = item.author.split("By")[0].trim();
        }
        if (item.author.indexOf(",") > -1) {
            item.author = item.author.split(",")[0].trim();
        }
        if (item.author.indexOf("Freeman staff") > -1) {
            item.author = "";
        }

        let t = $("time").text();
        log(t);
        let t1 = t.split("Updated")[0];
        log("t1=" + t1);
        let published_time = t1;

        log("pt=" + published_time);
        item.published_time = (Date.parse(published_time) / 1000) | 0;

        log("published_date=" + item.published_time);

        resolve(item);

        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
