import { l, chalk, microtime, allowLog } from "../common.js";
import runFeedActions from "../actions/runFeedActions.js";
const { postUrl } = runFeedActions;
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
        item.site_name = `The Epoch Times`;
        item.author = $(".left_col .upper_row .author_name").text();
        if (item.title.indexOf('Epoch')>=0)
            return reject(item)
        let b = $(".post_content");
        b.find(`.author_twitter`).remove();
        let c = b.find(`img.lazy`);
        //  log(`content2:`, b.html());

        c.each(function (i) {
            //	log("this:",this);
            //log(`replacing with `,`<img src="`+this.attr(`data-src`)+`" width="100%" />`);
            if (
                $(this).attr(`data-src`).split(`?`)[0] ==
                item.image.split(`?`)[0]
            ) {
                log(
                    `skip main image:`,
                    $(this).html(),
                    $(this).attr(`data-src`),
                    item.image
                );
                $(this).replaceWith(`<div data-id="skipped main image"/>`);
                return;
            }
            log(
                "replacing image>>:",
                item.image,
                "with image=",
                $(this).attr(`data-src`)
            );
            $(this).replaceWith(
                `<img src="` + $(this).attr(`data-src`) + `" width="100%"/>`
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
