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
        log("rule");
        item.published_time = (Date.now() / 1000) | 0; //+=minutes*60
        let b = $(`.entry-content`);
        l("html:",b.html())
       
        b.find(`img`).first().remove();
        
        b.find(`aside`).remove();
        b.find(`h2`).remove();
        b.find(`ul`).remove();
        item.body = b.html();
        resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
