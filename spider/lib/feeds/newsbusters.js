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
        item.author = $(`.username`).first().text().trim();
        if (!item.author) item.author = $(`.author-name`).first().text().trim();
        if (item.title && item.title.includes("Access denied"))
            return reject(item);
        //  let date = $(`span[property="dc:date dc:created"]`).attr(`content`);
        let date = $(`.pf-date`).text().trim();
        log("date:", date);
        let parsedDate = parse(date, "MMMM do, yyyy h:m a", new Date());
        log("parsedDate", parsedDate);
        let millis = Date.parse(parsedDate);
        let published_time = (millis / 1000) | 0;
        log("unix:", published_time);
        item.published_time = published_time;
        let b = $(`.imarticlebody`);
       // l("html:",b.html())
        if (!b.html()) b = $(`article .text-formatted`);
        b.find(`img`).first().remove();
        item.body = b.html();
        resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
