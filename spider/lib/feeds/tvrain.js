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
        fetch(item.url)
            .then(response => {
                log("response!!!");
                return response.text();
            })
            .then(body => {
                //log("body")
                let v = $("<div/>").html(body).contents();
                if (isEmpty(item.site_name)) item.site_name = "Дождь ТВ";
                let i = item.url.indexOf("?from=rss");
                if (i >= 0) item.url = item.url.substring(0, i);
                item.description = v
                    .find('meta[property="og:description"]')
                    .attr("content");
                let image = v.find(".document-content__text img").attr("src");
                log("image1:", image);
                if (image && image.indexOf("http") < 0) image = "http:" + image;

                if (image) {
                    item.image = image;
                }
                log("image=" + image);
                let s = v.find("script").text();
                //log(s)
                let j = 0;
                let pubdate = null;
                if (s) {
                    j = s.indexOf("pubdate");
                    if (j)
                        pubdate =
                            s.substring(j + 10, j + 20) +
                            "T" +
                            s.substring(j + 21, j + 29) +
                            "+03:00";
                }
                log("pubdate:" + pubdate);
                item.published_time = (Date.parse(pubdate) / 1000) | 0;

                let ss = v.find('span[title!=""]').text();
                log("ss=" + ss);
                if (item.rss) {
                    // log('rss:'+item.rss)
                    // log('xmlpubDate='+item.rss.xml.pubDate)
                    // log('rss=',JSON.stringify(item.rss))
                    //if(item.rss.xml){
                    let rss = item.rss; //.xml//JSON.parse(item.rss);
                    log(rss.pubDate);
                    item.published_time = (Date.parse(rss.pubDate) / 1000) | 0;
                    // }
                }
                log(item.published_time);
                if (!item.image || item.image.indexOf("No_Image") >= 0) {
                    item.image =
                        "https://pbs.twimg.com/profile_images/1019544216551264257/NLyNEj44_400x400.jpg";
                }
                log("image2=" + item.image);
                resolve(item);
            });
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
