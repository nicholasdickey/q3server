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

        resolve(item);

        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
