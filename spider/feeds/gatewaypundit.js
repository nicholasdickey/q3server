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
        //v 010
        if (item.url.indexOf("https") < 0) {
            // log("rejecting", item.url);
            return reject(item);
        }
        if (!item.description) return reject(item);
        item.description = item.description.replace(
            `Advertisement - story continues below `,
            ""
        );
        // log(`item.image=`, item.image);
        let coreImage = item.image;

        let w = coreImage.split(`-`);
        if (w && w.length > 1) {
            w.pop();
            coreImage = w.join(`-`);
        }
        let w1 = coreImage.split(`https://www.`);
        if (w1 && w1.length > 1) coreImage = w1[1];
        // log(`coreImage`, coreImage, w);
        //item.locale=`cdn`;
        item.url = item.url.replace(`https`, `http`);
        let b = $(`.entry-content`);
        let d = b.find("iframe");
        d.each(function (i) {
            $(this).attr("src", $(this).attr("data-src"));
            // l(chalk.yellow("replacing video", $(this)));
            let iframe = "" + $(this);

            iframe = iframe.replace(
                "iframe",
                'iframe style="position:absolute; top:0; left:0;"'
            );
            // l(chalk.magenta("iframe:", iframe));
            $(this).replaceWith(
                `<div class="video-container"
                style="position: relative;
                    padding-bottom: 56.25%; 
                    height: 0;">${iframe}</div>`
            );
        });
        //let video=true;
        /*if(item.title.indexOf(`Video`)>=-1){
          log(item.url+"  &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&    VIDEO ",item.title);
          video=1;
        }*/
        //var src=$("iframe[src*=`youtube`]").attr("src");
        //if(video){
        var src = $(`iframe[src*="youtube"]`).attr("src");
        //log("src=", src);
        if (src) {
            item.video = src;
            //log(`set video to `, src);
        }
        //}

        if (!b.html()) b = $(`article`);
        if (!b.html()) return reject(item);
        //b.find(`img`).first().remove();
        b.find(`#Top-ad`).remove();
        b.find(`.article-extras`).remove();
        b.find(`.article-ask`).remove();
        b.find(`#IC1-ad`).remove();
        b.find(`#IC2-ad`).remove();

        b.find(`img[src*="` + coreImage + `"]`).remove();
        b.find(`img[data-src*="` + coreImage + `"]`).remove();
        b.find(`.normal-wrapper`).remove();
        b.find(`.post-meta`).remove();
        b.find(`h2`).remove();
        b.find(`script`).remove();
        b.find(`.essb_links`).remove();
        b.find(`.post-widget-area`).remove();
        b.find(`.thega-content`).remove();
        b.find(`.thega-text-ad-injected`).remove();
        b.find(`#post-comments`).remove();
        b.find(`.post-comments`).remove();
        b.find(`.advert-text`).remove();
        b.find(`.sponsor`).remove();
        b.find(`.normal-iframe-wrapper`).remove();
        b.find(`.article-social`).remove();
        b.find(`.thega-below-comments`).remove();
        b.find(`.thega-content_2`).remove();
        b.find(`.thega-content-1`).remove();
        // b.find(`iframe`).attr(`style`, `margin-left:auto;margin-right:auto;`);
        item.body = b
            .html()
            .replace(/h3/g, `h4`)
            .replace(/srcset\=\"(.*)\"/g, ``);
        //log(`ib:`,item.body);
        resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
