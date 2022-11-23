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
        item.url = $('meta[property="og:url"]').attr("content");
        item.author = $('meta[name="parsely-author"]').attr("content");
        let published_time = $("time").attr("datetime");
        if (item.title == "Bloomberg - Are you a robot?") return reject(item);
        // log("pt=" + published_time);
        item.published_time = (Date.parse(published_time) / 1000) | 0;

        // log("published_date=" + item.published_time);
        return resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
    reject(item);
}
export default func;
