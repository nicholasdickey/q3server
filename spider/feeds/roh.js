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
        let published_time = $('meta[name="og:published_time"]').attr(
            "content"
        );
        log("t=" + published_time);
        item.published_time = (Date.parse(published_time) / 1000) | 0;
        log("pppptttt=" + item.published_time);
        resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
