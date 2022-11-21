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

        let s = $('script[type="application/ld+json"]').text();
        s = s.replace("//<![CDATA[", "").replace("//]]>", "");
        l("script:" + s);
        let j = JSON.parse(s);
        l("j:" + JSON.stringify(j));
        let date = j.datePublished;
        l("date=" + date);
        let jsDate = (Date.parse(date) / 1000) | 0;
        item.published_time = jsDate;
        l("pubdate=" + item.published_time);
        return resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
    reject(item);
}
export default func;
