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
        if (item.url.indexOf("thenewamerican") < 0) return reject(item);
        if (item.title.indexOf("Forbidden") > 0) return reject(item);
        item.site_name = "The New American";
        //  item.locale = "cdn";
        item.author = $(".entry-header .author").text().trim();
        let b = $(".post-content");
        //  console.log(item);
        if (
            item.description.indexOf(
                "Topics such as immigration, crime, politics, healthcare, judicial decisions, and foreign policy across America"
            ) >= 0
        )
            item.description = b.find("p").first().text();
        b.find(".widget_adserve").remove();
        b.find(".tna-social-channels").remove();
        let c = b.find("img");
        // log("s0",item.url);
        c.each(function (i) {
            /* l(
                chalk.yellow(
                    "image:",
                    $(this).attr("src"),
                    `<img src="${$(this).attr("data-src")}"/>`
                )
            );*/
            $(this).replaceWith(`<img src="${$(this).attr("data-src")}"/>`);
        });
        b.find("img").first().remove();
        c = b.find("img");
        // log("s0",item.url);
        c.each(function (i) {
            /* l(
                "AFTER REPLACE",
                chalk.yellow(
                    "image:",
                    $(this).attr("src"),
                    `<img src="${$(this).attr("data-src")}"/>`
                )
            );*/
            //$(this).replaceWith(`<img src="${$(this).attr("data-src")}"/>`);
        });

        $("figcaption").css("font-size", "small");
        $("figcaption").css("font-style", "italic");
        item.body = b.html();
        return resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
        return reject(item);
    }
}
export default func;
