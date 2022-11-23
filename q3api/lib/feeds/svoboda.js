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
        let t = $(".date>time").attr("datetime");
        if (t) {
            /*let day=t.substring(0,2)
  let month=t.substring(3,5)
  let year=t.substring(6,10)
  let time=t.substring(11,19) 
  let s=year+'-'+month+'-'+day+'T'+time+'+03:00'
  log('s='+s) */
            item.published_time = (Date.parse(t) / 1000) | 0;
            log("published_time=" + item.published_time);
            let metaDescription = $('meta[property="og:description"]').attr(
                "content"
            );
            //log("descr")
            let description = $(".wysiwyg p");
            //.first().text()
            let eq = 0;
            item.description = "<p><em>" + metaDescription + "</em></p>";
            while (item.description.length < 512) {
                if (isEmpty(description.eq(eq))) break;
                else {
                    //log(description.eq(eq))
                }
                item.description +=
                    "<p>" + description.eq(eq++).text() + "</p>";
            }
            if (isEmpty(item.description) || item.description == "undefined")
                item.description = "";
            log("description3=" + item.description);
            resolve(item);
        } else {
            fetch(item.url)
                .then(response => {
                    return response.text();
                })
                .then(body => {
                    let v = $("<div/>").html(body).contents();
                    t = v.find(".date>time").attr("datetime");
                    if (t) {
                        /*	let day=t.substring(0,2)
        let month=t.substring(3,5)
        let year=t.substring(6,10)
        let time=t.substring(11,19)
        let s=year+'-'+month+'-'+day+'T'+time+'+03:00'
        log('s='+s) */
                        item.published_time = (Date.parse(t) / 1000) | 0;
                        log("published_time=" + item.published_time);

                        let metaDescription = v
                            .find('meta[property="og:description"]')
                            .attr("content");
                        let description = v.find(".wysiwyg p");
                        let eq = 0;
                        item.description =
                            "<p><em>" + metaDescription + "</em></p>";
                        while (item.description.length < 512) {
                            if (!description.eq(eq)) break;
                            item.description +=
                                "<p>" + description.eq(eq++).text() + "</p>";
                        }
                        if (
                            isEmpty(item.description) ||
                            item.description == "undefined"
                        )
                            item.description = "";

                        log("description=" + item.description);
                        resolve(item);
                    } else {
                        log("description2=" + item.description);
                        resolve(item);
                    }
                });
        }
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
