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
        //if(isEmpty(item.description)){
        /* item.description=$('#node-body-top').text().substr(0,256)
  if(item.description.length==256)
    item.description+='...'*/
        let description = $("body p");
        //.first().text()
        let eq = 0;
        item.description = "";
        let i = 0;
        while (item.description.length < 1024) {
            if (i++ > 10) break;
            let t = description
                .eq(eq++)
                .text()
                .trim();
            if (t && t.indexOf("Advertisement") == -1 && eq > 3)
                item.description += "<p>" + t + "</p>";
        }
        //}
        if (item.description.length > 256) item.description += "...";
        if (isEmpty(item.author))
            item.author = $(".byline-dateline .byline").text();
        if (isEmpty(item.image))
            item.image = $(".hero is-image img").attr("src");
        resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
