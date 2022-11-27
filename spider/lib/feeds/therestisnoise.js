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
        item.image = $('meta[name="twitter:image"]').attr("content");
        log("#pt=" + item.published_time);
        if (item.rss) {
            var d = (Date.parse(item.rss.xml.published) / 1000) | 0;
            log("d=" + d);
            item.published_time = d;
        }
        if (!item.image)
            item.image =
                "https://pbs.twimg.com/profile_images/912348617972830209/L5ICcOiT_400x400.jpg";
        resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
