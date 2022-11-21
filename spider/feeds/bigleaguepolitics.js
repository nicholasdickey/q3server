import { l, chalk, microtime, allowLog, js } from "../lib/common.js";
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
        //v 003
        // l(chalk.green("ITEM:", js(item)));
        if (!item.description) {
            reject(item);
            return;
        }
        //log("item.title:", item.title);
        //log("item.description:", item.description);
        item.author = $(".author").first().text();
        if (!item.author) {
            reject(item);
            return;
        }
        item.title = item.title.split("- Big League Politics")[0].trim();

        let b = $("article");
        b.find(".essb_links").remove();
        b.find(".tpd-box-ad-c").remove();
        b.find("script").remove();
        b.find("div").remove();
        b.find("h1").remove();
        b.find(".z-ad-lockerdome").remove();
        b.find(".mc_embed_signup").remove();
        b.find(`.mostpopular-title`).remove();
        item.body = b
            .html()
            .replace(/width\=\"([A-Za-z0-9 _]*)\"/g, 'width="100%"')
            .replace(/height\=\"([A-Za-z0-9 _]*)\"/g, "");
        return resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
    reject(item);
}
export default func;
