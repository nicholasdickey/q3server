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

        resolve(item);

        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
