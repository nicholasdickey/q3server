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
        log("item:",item)
        if (item.title.indexOf("Rebel News") >= 0) return reject(item);
        //let byline=$('.rn_byline');


        item.author = $(`.rn_byline_author .linked-signup-name`).text();
        let byline = $(`.rn_byline li`);
        l("bylineL",byline.text())
        //let description = $(`#blog-post-content p`).first().text();
        //log("description", description);
        //item.description = description;
        let dateW = byline.text().split('|');
        let date;
        if(dateW.size==3)
            date=dateW[1]
        else
            date=dateW[0]    
        l("date:",date)
        let parsedDate = parse(date, "MMMM dd, yyyy", new Date());
        log("parsedDate", parsedDate);
        let millis = Date.parse(parsedDate);
        let published_time = (millis / 1000) | 0;
        log("unix:", published_time);
        item.published_time = published_time;

        let b = $(`#blog-post-content`);
        b.find(`.rn_widgets`).remove();
        b.find(`.well`).remove();
        b.find(`.article_campaigns`).remove();
        b.find(`.rn-article-ad`).remove();
        // b.find(`br`).remove();
        b.find(`.field-addthis-article-bottom`).remove();
        let iframe = $(`iframe`);
        log("iframe", iframe.html());
        b.append(iframe);
        //log("HTML:", b.html());
        l(item)
        item.body = b.html();

        //========================

        resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
