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
        if (!item.image)
            item.image =
                "https://twt-media.washtimes.com/media/image/2016/01/15/WashingtonTimes_website.jpg";
        //item.published_time = (Date.now() / 1000) | 0; //+=minutes*60
        // item.date=item.published_time;
        //log(item.published_time)
        let app = $(`script[type="application/ld+json"]`).first().text();
        let js;
        try {
            js = JSON.parse(app);
            // log("PArsed json", JSON.stringify(js));
        } catch (x) {
            log("Exception in watimes feed rule:", x);
        }
        if (js) {
            let pt = js.datePublished;
            //  log("pt=", pt);
            item.published_time = (Date.parse(pt) / 1000) | 0;
        }
        item.author = $('meta[name="Author"]').attr("content");
        let b = $(`.bigtext`);
        b.find(`.article-toplinks`).remove();
        b.find(`.connatixcontainer`).remove();
        b.find(`#newsletter-form-story`).remove();
        b.find(`.permission`).remove();
        b.find(`div[data-spotim-module="recirculation"]`).remove();
        b.find(`h4`).remove();
        item.body = b.html();
        return resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
    reject(item);
}
export default func;
