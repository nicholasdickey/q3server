import { l, chalk, microtime, allowLog } from "../common.js";

import parse from "date-fns/parse/index.js";
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
        item.site_name = "Instapundit";
        //log("description:",item.description)
        //log ("rss.description=",item.rss.description)
        /*if(isEmpty(item.description)){
	item.description=item.rss.description
}*/
        if (isEmpty(item.image)) {
            let image;
            $("img").each(function (i) {
                let im = $(this).attr("src");
                if (image) return;
                if (im.includes("instapundit-logo")) return;
                image = im;
            });

            if (image) {
                // l(chalk.green("image=:", image));
                item.image = image;
            } else {
                item.image =
                    "https://cdn.statically.io/img/pjmedia.com/instapundit/wp-content/themes/instapundit_responsive/images/instapundit-logo.png";
            }
        }
        if (isEmpty(item.author)) {
            item.author = $(".post-meta").text().replace("Posted by ", "");
        }
        item.title = item.title.replace("Instapundit  » Blog Archive   » ", "");
        item.title = item.title.replace("\t", "");
        item.title = item.title.replace("\r", "");
        item.title = item.title.split("\n")[0];
        item.title = item.title.split(".")[0];
        // l(chalk.yellow("TITLE-PRE:", item.title));
        item.title = item.title.replace(/\\n/g, "");
        // l(chalk.yellow("TITLE:", item.title));
        // item.title = '"' + jsStringEscape(item.title) + '"';
        item.author = item.author.replace("\t", "").replace("\n", "");
        item.author = item.author.split(" at ")[0].trim();
        // item.published_time = (Date.now() / 1000) | 0; //+=minutes*60
        let date = $(`h2`).first().text();
        //  l("date:", date);
        let parsedDate = parse(date, "MMMM do, yyyy", new Date());
        //  l("parsedDate", parsedDate);
        let millis = Date.parse(parsedDate);
        let published_time = (millis / 1000) | 0;
        // l("unix:", published_time);
        item.published_time = published_time;
        if (isEmpty(item.description)) {
            let w = $(".post-entry").text().split(".");
            // l(chalk.cyan("w:", w));
            if (w && w.length > 0) item.description = w[1] + "...";
            else item.description = w[0];
        }
        let body = $(`.post-entry`);
        item.body = body.html();
        resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
