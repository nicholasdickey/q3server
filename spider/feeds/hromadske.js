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
        if (isEmpty(item.site_name)) item.site_name = "Hromadske.TV";
        log(item.url);
        let description = $("p");
        //.first().text()
        let eq = 0;
        item.description = ""; //<p><em>'+defaultDescription+'</em></p>';
        while (item.description.length < 512) {
            item.description += "\n" + description.eq(eq++).text();
        }
        if (isEmpty(item.description) || isEmpty(item.image)) reject(item);
        else resolve(item);

        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
