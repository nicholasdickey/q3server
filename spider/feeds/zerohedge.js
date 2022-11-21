import { l, chalk, microtime, allowLog } from "../lib/common.js";

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
        let pt = $(`span[property="schema:dateCrated"]`).attr(`content`);
        let published_time = (Date.parse(pt) / 1000) | 0;
        item.published_time = published_time;
        // log("published_time", published_time);
        item.author = $(`span[property="schema:author"]`).text();
        /* let b = $(`div[property="schema:text"]`);
        b.find(`aside`).remove();
        
        */
        item.description = $(`meta[name="twitter:description"]`).attr(
            `content`
        );
        let b = $(`div [class^="NodeContent_body"]`);
        b.find(`[class^="Advert"]`).remove();
        //b.find("img").first().remove();
        let image = item.image.split("?")[0];
        let w = image.split("/");
        image = w[w.length - 1];
        //l(chalk.green.bold("image:", image));
        let c = b.find("img");
        // log("s0",item.url);
        c.each(function (i) {
            let iimage = $(this).attr("src").split("?")[0];
            let w = iimage.split("/");
            iimage = w[w.length - 1];
            l(chalk.green.bold("iimage:", image));
            if (image == iimage) {
                $(this).remove();
                l("removed");
            }
            // $(this).replaceWith(`<img src="${$(this).attr("data-src")}"/>`);
        });
        //  b.find("iframe").wrap('<div class="video-container"></div>');
        let d = b.find("iframe");
        d.each(function (i) {
            // l(chalk.yellow("replacing video", $(this)));
            let iframe = "" + $(this);
            iframe = iframe.replace(
                "iframe",
                'iframe style="position:absolute; top:0; left:0;"'
            );
            $(this).replaceWith(
                `<div class="video-container"
                style="position: relative;
                    padding-bottom: 56.25%; 
                    height: 0;">${iframe}</div>`
            );
        });

        item.body = b.html();
        resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
