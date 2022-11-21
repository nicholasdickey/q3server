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
    pageUrl,
    args,
}) {
    try {
        //========================"
        if (isEmpty(item.image)) {
            reject(item);
            return;
        }
        fetch(item.url)
            .then(response => {
                //  log("response!!!")
                return response.text();
            })
            .then(body => {
                //log("body")
                let v = $("<div/>").html(body).contents();
                if (isEmpty(item.site_name)) item.site_name = "24 Свiт";
                /*let i=item.url.indexOf('?from=rss')
if(i>=0)
  item.url=item.url.substring(0,i);*/

                item.description = v
                    .find('meta[property="og:description"]')
                    .attr("content");
                item.image = v
                    .find('meta[property="og:image"]')
                    .first()
                    .attr("content");
                if (isEmpty(item.image)) {
                    reject(item);
                    return;
                }

                //item.description=v.find('meta[property="og:description"]').attr('content')
                /*
let image=v.find('.document-content__text img').attr('src')
log('image='+image)
if(image){
  item.image=image
}
let s=v.find('script').text();
//log(s)
let j=0
let pubdate=null
if(s){
j=s.indexOf('pubdate')
if(j)
pubdate=s.substring(j+10,j+20)+'T'+s.substring(j+21,j+29)+'+03:00'
}
log('pubdate:'+pubdate)
item.published_time=(Date.parse(pubdate)/1000)|0
log(item.published_time)
*/

                let description = $("#container p");
                if (description.length > 0) {
                    //.first().text()
                    let eq = 0;
                    item.description = "";
                    while (item.description.length < 512) {
                        item.description +=
                            "<p>" + description.eq(eq++).text() + "</p>";
                    }
                } else {
                    reject(item);
                    return;
                }

                resolve(item);
            });
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
