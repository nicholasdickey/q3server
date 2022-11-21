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
        //v 002
        if (item.title == `Daily Wire`) return reject(item);
        item.title = item.title
            .replace(/&#8212/g, "—")
            .replace(/\\u201d/g, "”")
            .replace(/\\u2019/g, "’")
            .replace(/&quot;/g, "'")
            .replace(/&amp;/g, "&")
            .replace(/\\u00a0/g, "	 ")
            .replace(/\\u201c/g, "“")
            .replace(/&#039;/g, "'");
        item.site_name = `Daily Wire`;
        let publishedTime = $(`meta[name="parsely-pub-date"]`).attr(`content`);
        item.published_time = (Date.parse(publishedTime) / 1000) | 0;
        item.author = $(`.ewumbai9 a`).text();
        var src = $(`iframe[src*="youtube"]`).attr("src");
        // log("src=", src);
        if (src) {
            item.video = src;
            // log(`set video to `, src);
        }
        String.prototype.replaceAll = function (search, replacement) {
            var target = this;
            return target.replace(new RegExp(search, `g`), replacement);
        };
        item.author = $(`a.css-1fiqxb5`).text();
        let b = $(`#post-body-text`);

        // b.find(`div`).remove();
        //l(chalk.green(`HTML: ${b.html()}`))
        let fullHtml = ``;
        b.each(function () {
            const html = $(this).html();
            console.log(html);
            if (html)
                fullHtml += html
                    .replace(/width\=\"([A-Za-z0-9 _]*)\"/g, `width="100%"`)
                    .replace(/height\=\"([A-Za-z0-9 _]*)\"/g, ``)
                    .replace(/id\=\"(.*?)\"/g, ``)
                    .replace(/dir\=\"(.*?)\"/g, ``)
                    .replace(/<(\s*?)span(\s*?)>/g, ``)
                    .replace(/<(\s*?)\/span(\s*?)>/g, ``);
        });
        item.body = fullHtml;
        return resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
    reject(item);
}
export default func;
