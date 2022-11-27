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
        //v 002
        item.site_name = "Conservative Review";
        log("published_time=", item.published_time);
        log("item.description=", item.description);
        if (isEmpty(item.description)) {
            reject(item);
            return;
        }
        if (
            item.title.indexOf("Conservative Review") >= 0 ||
            item.title.indexOf("Log In") >= 0
        ) {
            reject(item);
            return;
        }
        log("item.mage=", item.image);
        if (isEmpty(item.image))
            item.image =
                "https://pbs.twimg.com/profile_images/800049407118950400/saokEass_400x400.jpg";
        const cr = $(".author-information p").text();
        /*if(isEmpty(item.author)){
  reject(item)
  return;
}*/

        if (!cr) {
            var s1 = $(".article-detail__label").text();
            if (!s1) {
                item.author = $("h4 span").text();
                if (item.url.indexOf("https") < 0) reject(item);
                else {
                    let b = $("#article-single-body");
                    b.find("#mc_embed_signup").remove();
                    b.find(".guerrillawrap").remove();
                    item.body = b
                        .html()
                        .replace(/width\=\"([A-Za-z0-9 _]*)\"/, 'width="100%"')
                        .replace(/height\=\"([A-Za-z0-9 _]*)\"/, "");
                    resolve(item);
                }
                //reject(item)
                return;
            }
            log("s1=" + s1);
            const s2 = s1.trim().substr(7);
            log("s2=" + s2);
            const sp = s2.split("by");
            const author = sp[1].trim();
            log("author=" + author);
            item.author = author;
            const dat = sp[0].trim() + " EDT";
            log("dat=" + dat);
            let d = (Date.parse(dat) / 1000) | 0;
            log("d=" + d);
            item.published_time = d;
        } else {
            item.author = cr;
            let w = cr.split("|");
            let s = w[1];
            s = s + ", 23:00:00 UTC";
            log("s=" + s);
            let d = (Date.parse(s) / 1000) | 0;
            log("date=" + d);
            item.published_time = d;
        }
        log("url", item.url);
        if (item.url.indexOf("https") < 0) reject(item);
        else {
            let b = $("#article-single-body");
            if (b) {
                b.find("#mc_embed_signup").remove();
                b.find(".guerrillawrap").remove();
                b.find(".code-block").remoe();
                item.body = b
                    .html()
                    .replace(/width\=\"([A-Za-z0-9 _]*)\"/, 'width="100%"')
                    .replace(/height\=\"([A-Za-z0-9 _]*)\"/, "");
            }

            return resolve(item);
        }
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
    reject(item);
}
export default func;
