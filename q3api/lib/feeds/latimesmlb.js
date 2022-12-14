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
        item.site_name = "LA Times";
        item.author = $(".trb_ar_by_nm_au").text();
        return resolve(item);
        //==================================================================================
    } catch (x) {
        l("latimes", chalk.red(x));
    }
    reject(item);
}
export default func;
