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
        if (isEmpty(item.site_name)) item.site_name = "Gordon.Ua";
        let d = $(".span-8 script").first().text();
        //log(d)
        let l = d.indexOf('"datePublished"');
        if (l >= 0) {
            d = d.substring(l + 18, l + 18 + 25);
        }
        //log(d)
        //let jd=JSON.parse(d)
        //log(jd.datePublished)
        item.published_time = (Date.parse(d) / 1000) | 0;
        //log(item.published_time)

        let description = $(".a_body p");
        log("description length=" + description.length);
        //.first().text()
        let eq = 0;
        item.description = "";
        while (item.description.length < 512) {
            item.description += "<p>" + description.eq(eq++).text() + "</p>";
        }

        resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
