import { l, chalk, microtime, allowLog, js } from "../common.js";
import runFeedActions from "../actions/runFeedActions.js";
const { postUrl } = runFeedActions;
function remove(b) {
    b.find(`#dpsp-content-bottom`).remove()
    b.find(`.tve-leads-two-step-trigger`).nextAll().remove();
    b.find(`article`).nextAll().remove();
    b.find(`.tve-leads-two-step-trigger`).remove();
    b.find(`.based-content`).remove();
    b.find(`.based-content_2`).remove();
    b.find(`.based-content-3`).remove();
    b.find(`.essb_links`).remove();
    b.find(`.block-views`).remove();

    b.find(`.ad-container`).remove()
    b.find(`.social-container`).remove()
    b.find(`.full-story-btn`).remove()
    b.find(`button`).remove()
    b.find(`.share-float`).remove()
    b.find(`.freed-content_4`).remove()
    b.find(`.freed-content_5`).remove()
    b.find(`.z-ad-mypillow-inline,.mypillow-sidebar`).remove()


    b.find(`.iframe-override-container`).remove()
    b.find(`.block-social-icons`).remove();
    b.find(`.block-tabs`).remove();
    b.find(`.dig-in-title`).remove();
    b.find(`.field--name-field-dig-deeper`).remove();
    // if (b.find(`article`).html())
    //     b = b.find(`article`);

    return b;
}
async function func({
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
        //========================
       // log("INSIDE item.url", pageUrl);
        if (pageUrl.indexOf("thelibertydaily.com") >= 0) {
            if (item.title.indexOf("Contact Us") >= 0) return reject(item);
            /*let link=$('#main-content a').attr('href');
            log("LINK:"+link);
            let url="http://qwiket.com/api?task=submit_link&link="+encodeURIComponent(link)+"&shortname=ld";
            fetch(url).then(function(response){
                  log("returned submit_link");
            });//app_col1 */
            let i = 0;
            let links = [];
            $(".drudgery-link>a").each(async function (i) {
                // if (i++ > 30) return;
                let l = $(this).attr("href");
                if (l.indexOf("thelibertydaily.com") >= 0) return;
                links.push(l);

                //log("l="+l);
                /* let url =
                    "http://qwiket.com/api?task=submit_link&link=" +
                    encodeURIComponent(l) +
                    "&shortname=ld";
                log("url=" + url);
                fetch(url).then(function (response) {
                    //log("returned submit_link");
                });*/
            });
            for (var j = 0; j < links.length; j++) {
                // log("INSIDE MAIN LINK", j, links[j]);
                await postUrl({ url: links[j], ...args });
            }
            /*	//var links=$('#app_col1 a');
               //log("LINKS:"+links);  
               $('#app_col1 a').each(function(i){   
                 // log("INSIDE");
                         let l=$(this).attr('href');
                       //log("l="+l);
                         let url="http://dr.qwiket.com/api?task=submit_link&link="+encodeURIComponent(l)+"&shortname=drudgereport";
                         log("url="+url);
                  fetch(url).then(function(response){
                     //log("returned submit_link");
                     });
              });
            $('#app_col2 a').each(function(i){
                 // log("INSIDE");
                         let l=$(this).attr('href');
                       //log("l="+l);
                         let url="http://dr.qwiket.com/api?task=submit_link&link="+encodeURIComponent(l)+"&shortname=drudgereport";
                         log("url="+url);
                  fetch(url).then(function(response){
                     //log("returned submit_link");
                     });
              });
            $('#app_col3 a').each(function(i){
                 // log("INSIDE");
                         let l=$(this).attr('href');
                       //log("l="+l);
                         let url="http://dr.qwiket.com/api?task=submit_link&link="+encodeURIComponent(l)+"&shortname=drudgereport";
                         log("url="+url);
                  fetch(url).then(function(response){
                     //log("returned submit_link");
                     });
              });
              */
        } else {
           // log("******  LIBERTY DAILY  **********");
            //log("liberty url=" + item.url);
            if (!item.site_name) {
                item.site_name = $('meta[name="twitter:site"]').attr("content");
            }
            //log("site_name=" + item.site_name);
            if (item.site_name == "@theweek") item.site_name = "The Week";
            if (item.site_name == "@presstelegram")
                item.site_name = "Press Telegram";
            if (item.site_name == "U.S.") item.site_name = "Reuters";
            if (!item.site_name) {
                if (item.url.indexOf("yahoo") >= 0) {
                    item.site_name = "Yahoo News";
                }
                if (item.url.indexOf("nytimes") >= 0) {
                    item.site_name = "New York Times";
                }
                if (item.url.indexOf("citizensvoice") >= 0) {
                    item.site_name = "Citizen Voice (W-B,PA)";
                }
            }
            if (!item.author)
                item.author = $('meta[property="og:article:author"]').attr(
                    "content"
                );
            if (!item.published_time) {
                let pTime = $(
                    'meta[property="og:article:published_time"]'
                ).attr("content");
                if (pTime) {
                    item.published_time = (pTime / 1000) | 0;
                }
            }
            item.locale = "cdn";


          //  l("before description", js(item))

            if (
                !item.description ||
                item.title.indexOf("TheMonitor.com") > 0 ||
                item.title == "Twitter" ||
                item.title.indexOf("Contact Us") >= 0
            )
                reject(item);


            else {

                let b = $(`.available-content`);
                if (b.html()) {
                    //  l("substack html:", b.html())
                    b.find(`img`).first().remove();
                    item.body = remove(b).html();
                    return resolve(item);
                }

                b = $(`#js-Story-Content-0`);

                if (b.html()) {
                    //l("news9 html:", b.html())
                    b.find(`img`).first().remove();
                    item.body = remove(b).html();
                    return resolve(item);
                }
              //  l(124443)
                let amp = $(`link[rel="amphtml"]`).attr('href');

                if (amp) {
                    l(chalk.red("amp", amp))
                    let response = await fetch(amp);
                    // l(chalk.yellow('response'))
                    //log("response!!!");
                    let body = await response.text();
                  //  l("body", body)
                    // log("body:",body)
                    let v = $("<div/>").html(body).contents();
                    let b = v.find('.storytext-container')
                    if (b.html()) {
                       // l(chalk.green("body", b.html()))


                        item.body = remove(b).html();
                        return resolve(item);
                    }
                    b = v.find('.td-post-content')
                    if (b.html()) {
                       // l(chalk.green("body2", b.html()))


                        item.body = remove(b).html();
                        return resolve(item);
                    }

                }

                b = $(`#main article`).last();
                if (b.html()) {
                    b = b.find(`.field--name-body`);

                    if (b.html()) {
                       // l("justthenews html:", b.html())
                        // b.find(`article`).first().remove();
                        item.body = remove(b).html();
                        return resolve(item);
                    }

                }

              /*  b = $(`.content`).last();
                if (b.html()) {
                    // b = b.find(`.field--name-body`);
                    l(chalk.red("content html",b.find('article').html()))
                    //if (b.find('article').html())
                      //  b = b.find('section')
                    if (b.html()) {
                       // b=b.find('p')
                       b.find('iframe').remove();
                        l("defense html:", b.html())
                        // b.find(`article`).first().remove();
                        b.find('#tpm-video-player').remove();
                        b.find('.mot').remove();
                        l(chalk.yellow("222 html:", b.html()))
                        item.body = b.html();//remove(b).html();
                        return resolve(item);
                    }

                }*/

                b = $(`.td-post-content`).last();
               
                if (b.html()) {
                    l(chalk.red("post".b))
                    // b = b.find(`.field--name-body`);

                    if (b.html()) {
                        l("ss html:", b.html())
                        // b.find(`article`).first().remove();
                        item.body = remove(b).html();
                        return resolve(item);
                    }

                }

                b = $(`.entry-content`);
                if(!b.html()){
                    //l(chalk.green(b.html()))
                    b=$('article');
                    if(b.html())
                    b=b.find('section');
                }
                if (b.html()) {
                    //l("entry-content html:", b.html())
                    b.find(`img`).first().remove();
                    b.find(`.heateorSssClear`).remove()
                    b.find(`.advads-content`).remove();
                    b.find(`.google-auto-placed`).remove();
                    b.find(`#wpd-post-rating`).remove();
                    b.find(`.wp-post-author-wrap`).remove();
                    b.find(`.twitter-share`).remove();
                    b.find(`.sharedaddy`).remove();
                    b.find(`.addtoany_share_save_container`).remove();
                    b.find(`.advads-powerinbox-2x4`).remove();
                    b.find(`.advads-revcontent-below-article`).remove();
                    b.find(`.code-block`).remove();

                    b.find(`.heateor_sss_sharing_container`).remove();

                    b.find(`.widget__head`).remove();
                    b.find(`.widget__head`).remove();

                    item.body = remove(b).html();


                    return resolve(item);
                }
            }



        }
        //reject(item)
        //==================================================================================
    } catch (x) {
        l("LIBERTY DAILY FEED:", chalk.red(x));
    }
}
export default func;
