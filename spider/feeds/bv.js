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
        if (!item.image || item.image.indexOf("opengraph.png") > 0) {
            let i = $(
                "div[data-tracker-label='story.contributor.headshot'] img"
            ).attr("src");
            //log("substitute image src="+i)
            item.image = i;
        }

        item.published_time =
            (Date.parse($('meta[property="date"]').attr("content")) / 1000) | 0;
        return resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
    reject(item);
}
export default func;
