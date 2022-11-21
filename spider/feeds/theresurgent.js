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
        item.author = $(".single-author span").text();
        let b = $(".single-text");
        item.body = b.html();
        log("body:", item.body);
        resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
