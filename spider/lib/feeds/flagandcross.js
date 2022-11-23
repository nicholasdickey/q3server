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
}) {
    try {
        //========================
        let b;
        if (item.url && item.url.indexOf("flagandcross") >= 0) {
            l("flagandcross")
            item.author = $(`a[rel=author]`).first().text();
            b = $(`#mvp-content-main`);
            l("b:", b.html(), "author:", item.author)
            if (!b.html()) {
                l('no body')
                b = $('section');
            }
            l('body--<',b.html())
            b.find(`.essb_links `).remove();
            b.find(`#klicked-poll-box`).remove();
            b.find(`.klicked-poll-continues`).remove();
            b.find(`.z-ad-lockerdome`).remove();
            b.find(`img[alt="Save conservative media!"]`).remove();
            b.find(`.dsk-box-ad-d`).remove();
            b.find(`.sharenow-buttons`).remove();
            b.find(`.ff-dad`).remove();
            b.find(`.insticator-unit`).remove();
            b.find(`#mvp-content-bot`).remove();
            b.find(`.mvp-cont-read-wrap`).remove();
            b.find(`#firefly-poll-container`).remove();
            b.find(`#IC3-ad`).remove();
            b.find(`#in-article-related`).remove();
            b.find(`.sponsor`).remove();
            b.find(`.inner-content`).remove();
            b.find(`script`).remove();
            b.find(`.article-sharing`).remove();
            b.find(`.ff-fancy-header-container`).remove();
            b.find(`#respond`).remove();
        }
        else {
            l("not flagand cross", item)
            if (item.url.indexOf("westernjournal") >= 0) {
                l("western journal")
                // item.author = $(`a[rel=author]`).first().text();
                b = $(`section<article`);

                b.find(`.article-sharing`).remove();
                b.find(`.sponsor`).remove();
                b.find(`#firefly-poll-container`).remove();
                b.find(`.ff-fancy-header-container`).remove();
                b.find(`.entry-submit-correction`).remove();
                b.find(`script`).remove();
                b.find(`.ff-truth-accuracy-text`).remove();
                b.find(`.ff-dad`).remove();
                b.find(`.author-tabs`).remove();
                b.find(`.insticator-unit`).remove();
                b.find(`style`).remove();
            }
        }
        if (b)
            item.body = b.html();
        //l("body:", item.body)
        l(item)
        resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
