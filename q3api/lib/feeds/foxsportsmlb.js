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
        if (item.image == "http://a.fssta.com") {
            log("replaced image");
            item.image =
                "http://sportsmedianews.com/wordpress/wp-content/uploads/2014/03/MLB-on-Fox.jpg";
        }
        var date = new Date();
        //log("fixing time")
        item.published_time =
            item.published_time + date.getTimezoneOffset() * 60; // fix for TZ
        log("image=" + item.image);
        resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
