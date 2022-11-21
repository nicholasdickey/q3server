import { l, chalk, microtime, allowLog } from "../lib/common.js";

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
}) {
    try {
        //========================
        let date = $(`.col-md-8 .article-date`).first().text();
        //  log("date:", date);
        let parsedDate = parse(date, "MMMM do, yyyy", new Date());
        // log("parsedDate", parsedDate);
        let millis = Date.parse(parsedDate);
        let published_time = (millis / 1000) | 0;
        // log("unix:", published_time);
        item.published_time = published_time;
        let b = $(`.article-content`);
        b.find(`.article-cta-box`).remove();
        b.find(`.alert`).remove();
        b.find(`#mc_embed_signup`).remove();
        b.find(`.row`).remove();
        b.find(`.d-flex`).remove();
        item.body = b.html();
        return resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
    reject(item);
}
export default func;
