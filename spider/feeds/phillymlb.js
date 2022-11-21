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
        if (
            item.url.indexOf("phillies") >= 0 ||
            item.url.indexOf("Phillies") >= 0 ||
            search(".article__content", [
                "Phillies",
                "aseball",
                "ugout",
                "itcher",
                "homer",
                "infield",
                "outfield",
            ])
        )
            resolve(item);
        else reject(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
