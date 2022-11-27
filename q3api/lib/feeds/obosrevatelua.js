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
