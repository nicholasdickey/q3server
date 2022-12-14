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
        item.url = $('meta[property="og:url"]').attr("content");
        item.author = $('meta[property="bt:author"]').attr("content");
        let t = $('meta[property="bt:pubDate"]').attr("content");
        log("t=" + t);
        item.published_time = (Date.parse(t) / 1000) | 0;
        log("pt=" + item.published_time);
        resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
