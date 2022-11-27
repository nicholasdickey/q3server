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
        //item.title=item.rss.title
        //em.description=item.rss.description
        //item.site_name="memri.org"
        //item.image="http://www.memri.org/images/logo.png"
        const datetime = $(
            '.date-display-single[dataType="xsd:dateTime"]'
        ).attr("content");
        const jsDate = (Date.parse(datetime) / 1000) | 0;
        item.published_time = jsDate;
        log("time=" + item.published_time);
        resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
