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

        fetch(item.url)
            .then(response => {
                // log("response!!!")
                return response.text();
            })
            .then(body => {
                let v = $("<div/>").html(body).contents();
                let description = v.find("p");
                log("description=" + description);
                //.first().text()
                let eq = 0;
                // item.description='<p><em>'+defaultDescription+'</em></p>';
                item.description = "";
                while (item.description.length < 512) {
                    item.description +=
                        "<p>" + description.eq(eq++).text() + "</p>";
                }
                item.locale = "ru_UA";
                resolve(item);
            });
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
