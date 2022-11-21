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
        log(item.title);
        if (isEmpty(item.title))
            item.title = $('meta[property="og:title"]').attr("content");
        item.site_name = "Brighter Lights";
        item.title = "Brighter Lights on " + item.title;
        log(item.url);
        return resolve(item);

        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
    reject(item);
}
export default func;
