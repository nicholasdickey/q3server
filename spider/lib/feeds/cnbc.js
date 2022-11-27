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

        /*  let pTime = $('meta[property="article:published_time"]').attr(
            "content"
        );
        item.published_time = (Date.parse(pTime) / 1000) | 0;
        log("published_time =" + item.published_time);*/
        let b = $(`.ArticleBody-articleBody .group`);
        item.body = b.html();
        return resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
    reject(item);
}
export default func;
