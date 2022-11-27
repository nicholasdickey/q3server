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
        item.author = $(".colfull .spaced").text().substring(3);
        //log(item.author)
        //log("published_time="+item.published_time)
        return resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
    reject(item);
}
export default func;
