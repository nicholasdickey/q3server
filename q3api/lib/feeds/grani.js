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
        item.site_name = "Грани Ру";
        item.author = $("#main-inner span.author").first().text();
        log("item=", JSON.stringify(item));
        if (item.rss) {
            // log('rss:'+item.rss)
            // log('xmlpubDate='+item.rss.xml.pubDate)
            //  log('rss=',JSON.stringify(item.rss))
            // if(item.rss.xml){
            let rss = item.rss; //.xml//JSON.parse(item.rss);
            log(rss.pubDate);
            item.published_time = (Date.parse(rss.pubDate) / 1000) | 0;
            // }
        }
        item.image = $('meta[name="twitter:image"]').attr("content");
        log(item.published_time);
        let b = $(`.main-text`);
        b.find(".ad-240x400").remove();
        log("b=", b.html());
        item.body = b.html();
        resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
