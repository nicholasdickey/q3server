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
        if (isEmpty(item.author)) item.author = $(".byline a").text();
        if (isEmpty(item.author))
            item.author = $('meta [name="article:author"]').attr("content");
        log("author1=", item.author);
        if (isEmpty(item.author)) {
            item.author = $(".Page-header-articleHeader-author").text();
            log("author2=", item.author);
        }
        resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
