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
        item.site_name = "Barron's";
        let pTime = $('meta[name="article.published"]').attr("content");
        item.published_time = (Date.parse(pTime) / 1000) | 0;
        log("published_time" + item.published_time);
        return resolve(item);

        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
    reject(item);
}
export default func;
