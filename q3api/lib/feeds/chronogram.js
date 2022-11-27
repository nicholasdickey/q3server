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
        if (!item.image || item.image.indexOf("Chronogram_Square.jpg") >= 0) {
            reject(item);
        } else {
            log("IMAGE:=" + item.image);
            item.site_name = "Chronogram";
            //item.url=$('meta[name="og:url"]').attr('content')
            item.author = $('meta[name="author"]').attr("content");
            let s = $('script[type="application/ld+json"]').text();
            log("script:" + s);
            if (s) {
                let j = JSON.parse(s);
                log("j:" + JSON.stringify(j));
                let date = j.datePublished;
                log("date=" + date);
                let jsDate = (Date.parse(date) / 1000) | 0;
                item.published_time = jsDate;
                log("pubdate=" + item.published_time);
            }
            return resolve(item);
        }
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
    reject(item);
}
export default func;
