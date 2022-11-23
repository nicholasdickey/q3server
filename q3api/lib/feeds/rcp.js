import { l, chalk, microtime, allowLog } from "../common.js";
import feedActions from "../actions/feedActions.js";
const { postUrl } = feedActions;
async function func({
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
        // v 001
        let links = [];
        if (
            item.title ==
            "RealClearPolitics - Live Opinion, News, Analysis, Video and Polls"
        ) {
            $("a").each(async function (i) {
                // if (i++ > 30) return;
                let l = $(this).attr("href");
                if (!l) return;
                if (l.indexOf("realclearpolitics.com") >= 0) return;
                if (l.indexOf("javascript") >= 0) return;
                links.push(l);

                //log("l="+l);
                /* let url =
                    "http://qwiket.com/api?task=submit_link&link=" +
                    encodeURIComponent(l) +
                    "&shortname=ld";
                log("url=" + url);
                fetch(url).then(function (response) {
                    //log("returned submit_link");
                });*/
            });
            for (var j = 0; j < links.length; j++) {
                //log("INSIDE MAIN LINK", j, links[j]);
                await postUrl({ url: links[j], ...args });
            }
            return reject(item);
        }
        ///if (!item.rss) return reject(item);
        if (!item.description) return reject(item);
        if (
            item.description &&
            item.description.trim().indexOf("RealClearPolitics.") == 0
        )
            return reject(item);
        item.author = $(".auth-byline a").text();
        //log("desc=",item.description)
        //log('author1=',item.author);
        if (!item.author) item.author = $(".auth-author a").text();
        if (!item.author) item.author = $(`.byline a`).text();
        //log('author2=',item.author);
        //log('pt=',item.published_time);
        let dt = $(".auth-date").text(); //[1].text();
        //log("dt=",dt.html().split('<br>')[1]);
        //dt=dt.html().split('<br>')[1];
        let d = (Date.parse(dt) / 1000) | 0;
        //log("date=",d);
        item.published_time = d;
        //log ("date1=",dt[1]);
        item.site_name = "Real Clear Politics";
        item.title = item.title.split("|")[0];

        let b = $(".article-body-text");
        b.find(".ad_wrapper_box").remove();
        b.find(`.story-stream-hover-wrapper`).remove();
        item.body = b.html();
        resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
