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

        item.description = $('meta[name="description"]').attr("content");
        item.title = $('meta[property="og:title"]').attr("content");
        item.image = $('meta[property="og:image"]').attr("content");
        item.author = $("h1 .author").text();
        item.site_name = "InLiberty";
        item.locale = "ru_RU";
        if (isEmpty(item.description)) reject(item);
        else resolve(item);

        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
