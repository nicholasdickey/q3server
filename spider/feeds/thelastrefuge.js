import { l, chalk, microtime, allowLog } from "../lib/common.js";
//import feedActions from "../actions/feedActions.js";
//const { postUrl } = feedActions;
function func({
    $,
    item,
    resolve,
    reject,
    log,
    chalk,
    fetch,
    isEmpty,
    jsStringEscape,
    pageUrl,
    args,
}) {
    try {
        //========================"
        //v 003
        /* let g = (item.author = $(".author"));
        let gcount = g.length;
        console.log("gconut=", gcount);
        if (gcount != 1) {
            reject(item);
            return;
        }
        item.author = g.text();
        */
        item.author = $(`meta[property="twitter:data1"]`).attr("content");
        //log(`item.author`, item.author);
        if (!item.image) {
            reject(item);
            return;
        }
        if (item.title.indexOf("Open Thread") > -1) {
            //log("REJECT OPEN THREAD");

            if (item.title.indexOf(" - The Last Refuge") > -1) {
                // log("REJECT - The Last Refuge");
                return reject(item);
            }
            return reject(item);
        }
        if (item.title.indexOf("Presidential Politics") > -1) {
            // log("REJECT OPEN THREAD");
            return reject(item);
        }
        console.log("BEFORE BODY");
        let b = $(`.post-content`);
        b.find(`.sharedaddy`).remove();
        b.find(`.cat-links`).remove();
        b.find(`.heateorSssClear`).remove();
        b.find(`.heateor_sss_sharing_container`).remove();
        b.find(`.wpcnt`).remove();
        b.find(`img[src*="${item.image}"]`).remove();
        b.find(`img[data-orig-file*="${item.image}"]`).remove();
        b.find(`a[href*="${item.image}"]`).remove();
        b.find("img")
            .closest("p")
            .attr(
                "style",
                "width:100%;display:flex;flex-direction:column;align-items:center;"
            );
        item.body = b.html();
        resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
        reject(item);
    }
}
export default func;
