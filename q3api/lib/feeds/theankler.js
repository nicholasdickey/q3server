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
        let t = $("time").attr("datetime");
        log("datetime=" + t);
        if (t) {
            item.published_time = (Date.parse(t) / 1000) | 0;
        }

        log("rt=" + item.published_time);
        item.site_name = "The Ankler";
        if (!item.image) {
            item.image = $("p img").attr("src");
            if (!item.image)
                item.image =
                    "http://theankler.com/wp-content/uploads/2017/09/cropped-The-walker-e1505423390982-270x270.jpeg";
        }
        let description = $(".entry-content p");
        //.first().text()
        let eq = 0;
        item.description = "";
        while (item.description.length < 1024) {
            if (isEmpty(description.eq(eq))) break;
            else {
                //log(description.eq(eq))
            }
            let t = description
                .eq(eq++)
                .text()
                .trim();
            if (t) item.description += "<p>" + t + "</p>";
        }
        if (isEmpty(item.description) || item.description == "undefined")
            item.description = "";
        item.author = "Richard Rushfield";
        //item.title=$('.entry-title').text();
        if (
            !item.description ||
            item.title == "The Ankler" ||
            item.title == "richardrushfield" ||
            item.title.indexOf("2017") > -1
        )
            reject(item);
        else resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
