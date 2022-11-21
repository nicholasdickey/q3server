import { l, chalk, microtime, allowLog, js } from "../common.js";

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
        item.author = $("a[rel=author]").first().text();
        // log("author=", item.author);
        // l("americanmind author", item.author, item.title);
        item.title = item.title.split("- The American Mind")[0];
        //log(item.published_time)
        let app = $(`script[type="application/ld+json"]`).first().text();
        let js;
        // l(111);
        let pt = $(`meta[property="article:modfied_time"]`).attr("content");
        if (pt) {
            item.published_time = (Date.parse(pt) / 1000) | 0;
        }
        if (!item.pubished_time) {
            try {
                js = JSON.parse(app)["@graph"][2];
                // log("PArsed json", JSON.stringify(js));
            } catch (x) {
                l(`Exception in americanmind feed rule:`, x);
                log("Exception in americanmind feed rule:", x);
            }
            if (js) {
                let pt = js.datePublished;
                //log("pt=", pt);
                item.published_time = (Date.parse(pt) / 1000) | 0;
            }
        }
        // l(chalk.yellow("americanmind published_time=", item.published_time));
        // if (!item.author) return reject(item);
        if (!item.description) return reject(item.description);
        if (!item.image) return reject(item.image);
        let b = $(".tam__single-content-output");
        b.find('img[src*="TAMtag"]').remove();
        item.body = b.html();
        l(888);
        return resolve(item);
        //==================================================================================
    } catch (x) {
        l("ESCEPTION WITHIN AMERICAN MIND RULE", chalk.red(x));
    }
    reject(item);
}
export default func;
