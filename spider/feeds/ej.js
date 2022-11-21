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
        log(item.image);
        log(item.url);
        fetch(item.url)
            .then(response => {
                log("response!!!");
                return response.text();
            })
            .then(body => {
                //log("body")
                let v = $("<div/>").html(body).contents();
                let image = v.find(".txt_e img").first().attr("src");
                log("image:" + image);
                if (image) item.image = "http://ej2015.ru/" + image;
                if (isEmpty(item.author))
                    item.author = v.find(".date a").text();
                let description = v.find(".article p");
                //.first().text()
                let eq = 0;
                item.description = "";
                while (item.description.length < 128) {
                    item.description += "\n" + description.eq(eq++).text();
                }
                let b = v.find(".txt_e");
                item.body = b.html();
                resolve(item);
            });

        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
