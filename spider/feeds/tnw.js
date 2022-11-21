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
        let pTime = $('meta[property="article:published_time"]').attr(
            "content"
        );
        item.published_time = (Date.parse(pTime) / 1000) | 0;
        log("published_time " + item.published_time);
        resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
