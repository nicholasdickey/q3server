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
        //log("IN2 :"+JSON.stringify(item))

        let authors = $(`.byline .author-name`)
            .map(function () {
                return $(this).text();
            })
            // and format into your comma-delineated list
            .get()
            .join(", ");

        item.author = authors;
        if (!item.author) return reject(item);
        //let publishedTime = ppage.pub_date;
        //let jsDate = (Date.parse(publishedTime) / 1000) | 0;
        //item.published_time = jsDate; //+date.getTimezoneOffset()*60// fix for TZ
        let b = $(`.body-copy`);
        item.body = b.html();
        return resolve(item);

        //==================================================================================
    } catch (x) {
        l("bostonherald", chalk.red(x));
    }
    reject(item);
}
export default func;
