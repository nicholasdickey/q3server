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
        item.site_name = "Salon";
        item.author = $(".writer-container").first().text().trim();
        item.url = $('meta[property="og:url"]').attr("content");
        log("url=" + item.url);
        if (!item.image || !item.url) return reject(item);
        return resolve(item);
        //==================================================================================
    } catch (x) {
        l("salon", chalk.red(x));
    }
    reject(item);
}
export default func;
