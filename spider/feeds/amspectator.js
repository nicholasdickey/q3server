import { l, chalk, microtime, allowLog } from "../common.js";

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
        // console.log("//========================");
        if (!item.description) {
            reject(item);
            return;
        }
        if (item.description.indexOf("Total 0:") === 0) {
            item.description = item.description.split(`Email`)[1];
        }
        item.author = $(".author").find(`a`).first().text();

        if (!item.image) item.image = "/cdn/cat/Q6kDqxWqRJ";
        item.title = $(`.pf-title`).text().trim();
        if (item.title.indexOf("The American Spectator") >= 0) {
            log("rejecting on title");
            return reject(item);
        }
        let d = $(`.date`).text().trim();
        item.published_time = (Date.parse(d) / 1000) | 0;

        //log(`date:`,published_time);
        let b = $(`.post-body`);
        b.find(`.first-char`).addClass(`drop`);
        b.find(`heateor_sss_sharing_container`).remove();
        item.body = b.html();
        //log("body=",item.body);
        // log("pubtime=", item.published_time);
        //
        return resolve(item);

        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
    reject(item);
}
export default func;
