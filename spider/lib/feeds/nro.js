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
        //V0.016+17
       
       
       // item.site_name = "National Review";
        log(` NRO[v17] ITEM:`, item.title);
        //item.date=(Date.now()/1000)|0
        if (item.url.indexOf("corner") >= 0) {
            var t = "The Corner: ";
            item.title = t.concat(item.title);
        }
        if (item.url.indexOf("/videos/") >= 0) {
            var t = "VIDEO: ";
            item.title = t.concat(item.title);
        }
        if (item.url.indexOf("magazine") >= 0) {
            var t = "Magazine: ";
            item.title = t.concat(item.title);
        }
        if (item.title) {
            item.title = item.title.split(`|`)[0];
        }
      
    if (
        item.title.indexOf("504 error") !== -1 ||
        item.title.indexOf("Oops!") !== -1 ||
        isEmpty(item.description) ||
        isEmpty(item.image) ||
        item.image.indexOf("d=blank") > 0
    ) {
        log(
            "nro feed reject empty",
            item.description,
            item.image,
            item.title
        );
        reject(item);
    } else {
 
        const ampUrl=item.url+'amp'
        log("amp:",ampUrl)
        //========================"
        fetch(ampUrl)
        .then(response => {
            log("response!!!");
            return response.text();
        })
        .then(body => {
               // log("body:",body)
                let v = $("<div/>").html(body).contents();
                //log("json:",v.html())
               // v.find('script').remove();
                const b=v.find('.article-content')//.find('script').remove().find('amp-analytics').remove();//[1].html();
                b.find('script').remove();
                b.find('.amp-ad').remove();
                b.find('i-amphtml-sizer').remove();
                b.find('figure').first().remove();
                b.find('.ad-unit--center').remove();
                b.find('amp-connatix-player ').remove();
                //content.find('amp-analytics').remove();
                let fullHtml='';
                let ii=0;
                b.each(function () {
                    const html = $(this).html().trim();
                    if (html) {
                        if (!ii) {
                            fullHtml = "";
                            ii = 1;
                        }
                        // log("has html");
                        fullHtml += html;
                    }
                });
              
            
                item.body = fullHtml?.trim();
                l(chalk.green.bold(item.body))
                log("fullHtml=", fullHtml);
                return resolve(item);
            })
    }
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
    
}
export default func;
