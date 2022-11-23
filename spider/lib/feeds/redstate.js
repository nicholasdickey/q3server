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
        //========================"
        item.site_name = "Red State";
        let b = $(`.post-body`);
        b.find(`figure`).remove();
        b.find(`#author_info_box`).remove();
        b.find(`.article-ads`).remove();
        b.find(`.social-share-bottom`).remove();
        b.find(`#discussion`).remove();
        b.find(`.tagbox`).remove();
        b.find(`script`).remove();
        b.find(`#rcjsload_ffe38c`).remove();
        item.body = b.html();
        l(chalk.yellow("item:", JSON.stringify(item)));
        resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
