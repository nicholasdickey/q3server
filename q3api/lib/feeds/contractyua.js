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
        item.locale = "cdn";
        return resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
    reject(item);
}
export default func;
