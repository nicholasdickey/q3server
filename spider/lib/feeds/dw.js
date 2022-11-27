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

        var s = $("script").text();
        //log('111')
        var w = s.split("articleChangeDateShort:");
        log("w=" + w);
        var w0 = w[1];
        var w1 = w0.split(",")[0];
        log("json=" + w1);
        var w2 = w1.replace('"', "").replace('"', "").trim();
        log("s=" + w2);
        var year = w2.substr(0, 4);
        var month = w2.substr(4, 2);
        var day = w2.substr(6, 2);
        log("year=" + year + ",month=" + month + ",day=" + day);
        var d = new Date(year, month - 1, day);
        //log('dateString='+d.dateString);

        var pt = (d.getTime() / 1000) | 0;
        log("#pt=" + pt);
        item.published_time = pt;
        item.locale = "cdn";
        resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
