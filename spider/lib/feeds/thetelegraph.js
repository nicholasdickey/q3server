import { l, chalk, microtime, allowLog } from "../common.js";
import feedActions from "../actions/feedActions.js";
const { postUrl } = feedActions;
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
        // v 006
        // log(`new Telegraph feed v005`);
        if (!item.description) {
            log("reject - no description");
            return reject(item);
        }
        if (item.image == "http://www.telegraph.co.uk")
            item.image =
                "http://i0.wp.com/robhobson.co.uk/2015/wp-content/uploads/2015/04/the-telegraph-logo-rs1.png";

        let published_time = $(`.article-date-published`).attr(`datetime`);
        // log(`pub-time:`, published_time);
        if (!published_time) {
            log(`no pt first attemmpt`);
            published_time = $(
                `meta[name="DCSext.articleFirstPublished"]`
            ).attr(`content`);
            log(`pt after first attemmpt`, published_time);
        }
        if (!published_time) {
            log(`no pt second attemmpt`);
            published_time = $(`.e-published-date`).attr(`datetme`);
            log(`pt after second attemmpt`, published_time);
        }
        if (published_time) {
            log(`pt=` + published_time);
            item.published_time = (Date.parse(published_time) / 1000) | 0;
            log(`item.published_time:`, item.published_time);
        }
        if (!published_time) {
            log("REJECT AAA");
            return reject(item);
        }
        // log("TRACE1");
        item.author = $(`.byline__author-name`).attr(`content`);
        // log("TRACE2");
        if (!item.image) {
            // log(`no image`)
            item.image =
                "https://www.telegraph.co.uk" + $(`.responsive`).attr(`src`);
            // log(`image=`,item.image);
        }
        // log("TRACE3");
        let b = $(`article`);
        b.find(`script`).remove();
        b.find(`.article__social`).remove();
        b.find(`.article__end-meta`).remove();
        b.find(`aside`).remove();
        b.find(`button`).remove();
        b.find(`.tpl-article__end-meta`).remove();
        b.find(`h1`).remove();
        b.find(`.article-comment__icon`).remove();
        //  log("TRACE4");
        String.prototype.replaceAll = function (search, replacement) {
            var target = this;
            return target.replace(new RegExp(search, `g`), replacement);
        };
        //log("TRACE5");
        let a = b.find(`.responsive`);
        a.each(function (i) {
            // log(`replacing with `, `<img src="https://www.telegraph.co.uk` + $(this).attr(`data-src`) + `" width="100%" />`);
            let src = $(this).attr(`src`);
            // log("inside f ", src);
            src = src
                .replace(
                    `/content/dam`,
                    `https://www.telegraph.co.uk/content/dam`
                )
                .replace(`jpegimwidth`, `jpeg?imwidth`);
            let srcset = $(this).attr(`srcset`);
            if (srcset) {
                // log("before type");
                // log("srcset type:", typeof srcset);
                srcset = srcset.replaceAll(
                    `/content/dam`,
                    `https://www.telegraph.co.uk/content/dam`
                );
                log("srcset fixed:", srcset);
            }
            const sizes = $(this).attr(`sizes`);
            const alt = $(this).attr("alt");
            if (i == 0) $(this).remove();
            else
                $(this).replaceWith(
                    `<img data-id="fixed-image-responsive" src="${src}" srcset="${srcset}"  sizes="${sizes}" alt="${alt}"  width="100%" />`
                );
        });

        let c = b.find(`div[data-js="LazyImage"]`);

        //log(`Gettnig the lasyLoads v17`);
        c.each(function (i) {
            // log(`replacing with `, `<img src="https://www.telegraph.co.uk` + $(this).attr(`data-src`) + `" width="100%" />`);
            let src = $(this).attr(`data-src`);
            //log("inside f ", src);
            src = src
                .replace(
                    `/content/dam`,
                    `https://www.telegraph.co.uk/content/dam`
                )
                .replace(`jpegimwidth`, `jpeg?imwidth`);
            let srcset = $(this).attr(`data-srcset`);
            if (srcset) {
                // log("before type");
                //log("srcset type:", typeof srcset);
                srcset = srcset.replaceAll(
                    `/content/dam`,
                    `https://www.telegraph.co.uk/content/dam`
                );
                log("srcset fixed:", srcset);
            }
            const sizes = $(this).attr(`data-sizes`);
            const alt = $(this).attr("data-alt");

            $(this).replaceWith(
                `<img data-id="fixed-image" src="${src}" srcset="${srcset}"  sizes="${sizes}" alt="${alt}"  width="100%" />`
            );
        });

        const live = b.find(`.live-indicator`);
        if (!live || !live.text()) item.body = b.html();
        // log("feed resolving");
        resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
