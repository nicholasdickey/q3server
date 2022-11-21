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
        if (isEmpty(item.site_name)) item.site_name = "Slon";
        item.published_time -= 7 * 3600;
        let l = item.url.indexOf("?");
        if (l >= 0) item.url = item.url.substring(0, l);
        resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
