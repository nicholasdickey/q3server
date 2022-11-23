import { l, chalk, microtime, allowLog } from "../common.js";
import feedActions from "../actions/feedActions.js";
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
        //log('rss:'+JSON.stringify(item.rss))
        //item.published_time=Date.parse(item.rss.date)/1000|0
        //log("pubdate"+item.published_time)
        //let s=$('.datetime').text();
        //log('s:'+s)
        item.published_time -= 7 * 3600;
        log("pubdate" + item.published_time);
        let lead = $(".lead a").attr("href");
        log("lead:" + lead);
        if (lead) {
            if (lead.indexOf("/30/") > 0) {
                item.author = "Ксения Ларина";
                item.image =
                    "http://edinaya-veda.ru/uploads/posts/2014-02/1392110390_kseniya-larina.jpg";
            } else if (lead.indexOf("/27/") > 0) {
                //varfol
                item.author = "Владимир Варфоломеев";
                item.image =
                    "https://pbs.twimg.com/profile_images/573781258884415488/xjdfbDP5.jpeg";
            } else if (lead.indexOf("/28/") > 0) {
                //venik
                item.author = "Веник";
                item.image =
                    "http://www.online812.ru/mm/items/2012/3/29/0009/title.jpg";
            }
        }
        let author = $(".author a").attr("href");
        log("author:" + author);
        if (author) {
            if (author.indexOf("/320/") > 0) {
                //ganapol
                item.author = "Матвей Ганапольский";
                item.image =
                    "http://www.uznayvse.ru/images/stories/uzn_1385159842.jpg";
            }
        }

        if (item.url.indexOf("/sut/") >= 0 || item.url.indexOf("/324/") >= 0)
            reject(item);
        else resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
