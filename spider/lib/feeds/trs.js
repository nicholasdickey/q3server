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
        l(chalk.red("ENTER"))
        log("updated");
        let publishedTime = $("meta[property='article:published_time']").attr(
            "content"
        );
        log("publishedTime=" + publishedTime);
        item.published_time = (Date.parse(publishedTime) / 1000) | 0;
        log(item.published_time);
        item.author = $(".author").text();
        if (item.author == "The Right Scoop") item.author = "";

        let b = $(".entry-content");
        b.find(".sharedaddy").remove();
        b.find(".code-block").remove();
        b.find("script").remove();
        b.find(".essb_links_list").remove();
        b.find(".essb_links").remove();
        b.find(".viewports").remove();
        b.find(`.heateor_sss_sharing_container`).remove();
        item.body = b.html(); //.replace(/width\=\"([A-Za-z0-9 _]*)\"/,'width="100%"').replace(/height\=\"([A-Za-z0-9 _]*)\"/,'');
        resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
