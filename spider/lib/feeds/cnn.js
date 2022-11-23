import { l, chalk, microtime, allowLog,js } from "../common.js";
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
    l(chalk.green("CNN",js(item)))
    try {
        //========================"
       
               /* item.title = $
                    .('meta[property="og:title"]')
                    .attr("content");
                item.image = $
                    .('meta[property="og:image"]')
                    .attr("content");
                item.description = v
                    .find('meta[property="og:description"]')
                    .attr("content");
                item.title = v
                    .find('meta[property="og:title"]')
                    .attr("content");
                item.url = v.find('meta[property="og:url"]').attr("content");
                item.site_name = v
                    .find('meta[property="og:site_name"]')
                    .attr("content");*/
               // item.author = $('meta[name="author"]').attr("content").first();
                 log("author: ",item.author)

                /*  let description = v.find("article p");
                let eq = 0;
                // log("Return description:"+description)
                if (description.length > 1) {
                    item.description = "";
                    while (item.description.length < 512) {
                        if (!description.eq(eq)) break;
                        item.description +=
                            "<p>" + description.eq(eq++).text() + "</p>";
                    }
                }

                item.description = item.description.replace(
                    "/profiles",
                    "https://cnn.com/profiles"
                );*/
                //log("DESCRIPTION:"+item.description)
                /*   let published_time = v
                    .find('meta[itemprop="datePublished"]')
                    .attr("content");

                // log('pt='+published_time)
                item.published_time = (Date.parse(published_time) / 1000) | 0;*/
                // log('published_time='+item.published_time)
                let b = $(`.SpecialArticle__body`);
                if(!b)
                b = $(`section .l-container`);
                if(!b)
                b = $(`.article__content`);
                if (!b) b = $(`article`);
                if (!b) b = $(`.Box-sc-1fet97o-0`);
                let c = b.find(".Image__image");
                // log("s0",item.url);
                c.each(function (i) {
                    // log("item.image>>:",item.image,"this.image=",$( this ).attr('src'))
                    const w = $(this).attr("src").split("/http%3A");
                    // log("split",w);
                    const ss = w.length > 1 ? w[1] : w[0];
                    //log("ss",ss);
                    const ns = "http%3A" + ss;
                    //log('ns',ns);
                    const ds = decodeURIComponent(ns);
                    //log('ds',ds);
                    $(this).replaceWith(`<img src="${ds}"/>`);
                });
                // log("s1");
                let fullHtml = b.html();
                let ii = 0;

                b.each(function () {
                    const html = $(this).html().trim();
                    if (html) {
                        if (!ii) {
                            fullHtml = "";
                            ii = 1;
                        }
                        // log("has html");
                        fullHtml += html
                            .replace(/padding-top\:56\.25%/g, 'width="100%"')
                            .replace(/\t/g, "");
                    }
                });
                // log("ssss",ii)
                if (!ii) {
                    // log("beforefind");
                    b =$(`.field-items`);

                    log("bfind");
                    if (b) {
                        b.find(".ad").remove();
                        b.find(".cn").remove();
                        b.find(".video__end-slate__top-wrapper").remove();
                        b.find(".video__end-slate__tertiary-title").remove();
                        b.find(
                            ".js-video__end-slate__tertiary video__end-slate__tertiary"
                        ).remove();
                        b.find(".pg-rail-tall__wrapper").remove();
                        b.find(".el__gallery").remove();
                        b.find(".zn-body__read-more").remove();
                        b.find(".pg-special-article__wrapper").remove();
                        b.find(".breaking-news").remove();
                        b.find(".m-share").remove();
                        b.find("script").remove();
                        b.find(".people-article").remove();
                        b.find(".rollover-people").remove();
                        b.find(".dfp-tag-wrapper wrapper").remove();
                        let c = b.find("img");
                        // log("s0",item.url);
                        c.each(function (i) {
                            // log("item.image>>:",item.image,"this.image=",$( this ).attr('src'))
                            /*    const w=$( this ).attr('src').split('/http%3A');  
   // log("split",w);
    const ss=w.length>1?w[1]:w[0];
    //log("ss",ss);
    const ns='http%3A'+ ss;
    //log('ns',ns);
    const ds=decodeURIComponent(ns);*/
                            //log('ds',ds);
                            $(this).replaceWith(
                                `<img src="${$(this).attr("data-src-large")}"/>`
                            );
                        });
                        b.find("img").first().remove();
                        b.each(function () {
                            log("n1");
                            const html = $(this).html().trim();
                            // log('n2');
                            if (html) {
                                //log('n3');
                                if (!ii) {
                                    // log('n4');
                                    fullHtml = "";
                                    ii = 1;
                                }
                                log("has html");
                                //console.log(
                                fullHtml += html
                                    .replace(
                                        /padding-top\:56\.25\%/g,
                                        'width="100%"'
                                    )
                                    .replace(/\t/g, "");
                            }
                        });
                    }
                }
                log("s2:", fullHtml);
                item.body = fullHtml; //.replace(/padding\-top\=\"([A-Za-z0-9 _;\-\:]*)\"/g,'width="100%"').replace(/\t/g, '').trim();
                // log("s3");
                return resolve(item);
           

        //==================================================================================
    } catch (x) {
        l("CNN X", chalk.red(x));
    }
    reject(item);
}
export default func;
