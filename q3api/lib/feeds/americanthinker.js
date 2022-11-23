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
        //v .005

        if (item.url.indexOf("americanthinker") < 0) return reject(item);
        let date = $(`.article_date`).first().text();
        //  log("date:", date);
        let parsedDate = parse(date, "MMMM do, yyyy", new Date());
        // log("parsedDate", parsedDate);
        let millis = Date.parse(parsedDate);
        let published_time = (millis / 1000) | 0;
        // log("unix:", published_time);
        item.published_time = published_time;

        let image = item.image.split("?")[0];
        let w = image.split("/");
        image = w[w.length - 1].split(".")[0];
        //l(chalk.green.bold("image:", image));
        let b = $(`.article_body`);
        let c = b.find("img");
        // log("s0",item.url);
        c.each(function (i) {
            let iimage = $(this).attr("src").split("?")[0];
            let w = iimage.split("/");
            iimage = w[w.length - 1].split("_")[0];
            // l(chalk.green.bold("iimage:", image));
            if (image == iimage) {
                $(this).remove();
                // l("removed");
            }
            // $(this).replaceWith(`<img src="${$(this).attr("data-src")}"/>`);
        });

        item.author = $(`.author`).first().text();
        item.site_name = "American Thinker";
        if (item.author) {
            let s = item.author.split("By");
            if (s.length > 1) item.author = s[1].trim();
        }

        b.find(`script`).remove();
        b.contents().each(function () {
            if (this.nodeType === 8) {
                $(this).remove();
            }
        });
        let fullHtml = "";
        // console.log("RULE")
        b.each(function () {
            const html = $(this).html().trim();
            // l(chalk.yellowBright(html))
            if (html)
                fullHtml += html
                    .replace(/<span style\=".*?">/g, ``)
                    .replace(/\\n\\n/g, "")
                    .replace(/<\/span>/g, ``);
        });
        item.body = fullHtml.trim();
        return resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
    reject(item);
}

export default func;
