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
        try {
            item.author = $(`.author`).text();
            //  log("author=", item.author);
            /* var s=$(`script[type="application/ld+json"]`).first().text();
     log("script=",s);  
    var j=JSON.parse(s);
     
     log("j:",JSON.stringify(j)) 
     */

            //log(item.published_time)
            if (item.url.indexOf("http") < 0) {
                item.url = `https://dailycaller.com${item.url}`;
            }
            let app = $(`script[type="application/ld+json"]`).first().text();
            let js;
            try {
                js = JSON.parse(app);
                log("PArsed json", JSON.stringify(js));
            } catch (x) {
                log("Exception in watimes feed rule:", x);
            }
            if (js) {
                let pt = js.datePublished;
                log("pt=", pt);
                item.published_time = (Date.parse(pt) / 1000) | 0;
                item.author = js.author.name;
            }
            if (
                item.author.indexOf("Kocsis") !== -1 ||
                item.author.indexOf("Shop") !== -1
            ) {
                log("rejecting on author", item.author);
                return reject(item);
            }
            item.site_name = "Daily Caller";
            var src = $("iframe").attr("src");
            // log("src=", src);
            if (src) {
                item.video = src;
                log(`set video to `, src);
            }
            const b = $(`article`);
            b.find(`header`).remove();
            b.find(`.uppercase span`).remove();
            b.find(`.list-none`).remove();
            b.find(`#article-share`).remove();
            b.find(`h1`).remove();
            b.find(`.hidden`).remove();
            b.find(`footer`).remove();
            b.find(`strong`).remove();
            b.find(`.items-center`).remove();
            b.find(`img[alt="Daily Caller News Foundation logo"]`).remove();

            item.body = b.html();
            //  log("body", item.body);
        } catch (x) {
            log(`Exception=`, x);
            return reject(item);
        }
        resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
