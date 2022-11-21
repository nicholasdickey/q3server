import { l, chalk, microtime, allowLog,js } from "../lib/common.js";
import parse from "date-fns/parse/index.js";
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
    log("ENTERED RULE FP");
    try {
        //========================
        //v 002
        /*  let months = {
              Jan: 0,
              Feb: 1,
              Mar: 2,
              Apr: 3,
              May: 4,
              Jun: 5,
              Jul: 6,
              Aug: 7,
              Sep: 8,
              Oct: 9,
              Nov: 10,
              Dec: 11
          }
          let date = $(`time`).text().trim();
          let dateParts = date.split(`,`);
          let date1Parts = dateParts[0].split(` `);
          let monthString = date1Parts[1];
          let dayString = date1Parts[2];
          let yearString = dateParts[1];
          l(chalk.yellow(`date strings`), months[monthString], dayString, yearString);
          var newDate = new Date(yearString, months[monthString], dayString);
          l(chalk.yellow(newDate.toDateString()));*/
        //let sndDate = Date.parse(date) / 1000 | 0;
        // l(chalk.green(sndDate));
        /*item.url =
            `https://www.frontpagemag.com` +
            $(`meta[property="og:url"]`).attr("content");
*/
        item.title=item.title.split('|')[0];
        log("url:", item.url,"---->");
        if (!item.url) return reject(item);
        if (item.url.indexOf("/author/") >= 0) return reject(item);
        if (item.url.indexOf("/search/") >= 0) return reject(item);
       
       /* if (item.url && item.url.indexOf("http") < 0)
            item.url = `https://www.frontpagemag.com/${item.url}`; */
        l(js(item))
        /*let description = $(`meta[property="twitter:description"]`).attr(
            `content`
        );
        if (!description) {
            return reject(item);
        }*/

       // item.description = description;
         l(`item.description=`, item.description);

        /*let date = $(`time`).text().trim();
        l('date',date)
        let parsedDate = parse(date, "EEE MMM do, yyyy", new Date());
        //  l("parsedDate", parsedDate);
        let millis = Date.parse(parsedDate);
        let published_time = (millis / 1000) | 0
        l(chalk.red(published_time))
        item.published_time = published_time;//Date.parse(date) / 1000) | 0;
        log("pt=", item.title, item.published_time, new Date(item.published_time*1000));
        let now = (Date.now() / 1000) | 0;
         log(
              "diff=",
              now - item.published_time,
              now - item.published_time > 48 * 3600
          );
       if (now - item.published_time > 48 * 3600) return reject(item); */
        // log(`published_time:`, item.published_time);
        item.site_name = "Front Page Magazine";
        // log(chalk.red("site_name:", item.site_name));
        item.title = item.title ? item.title.split(`|`)[0] : ``;
        item.title = item.title ? item.title.split(` - Frontpagemag`)[0] : ``;
        item.title = item.title.trim();
        //l(1234)
        if (item.title == `Frontpagemag`) {
            return reject(item);
        }
        if (item.title.indexOf("404") >= 0) return reject(item);

        item.author = $(`.field-author`).text().trim();

         log(`author=`, item.author);
       // item.locale = `cdn`;
        if (item.title == `Frontpage Mag` || !item.description) reject(item);
        else {
            let b = $(`.entry-content`);
            b.find(`.field-code`).remove();
           // l("111111")
            // b.find(`br`).remove();
            b.find(`.field-addthis-article-bottom`).remove();
            b.find(`img`).first().remove();
            item.body = b
                .html()
                .replace(/<br>/g, `<br/>`)
                .replace(/<p>/g, `<br/>`)
                .replace(/<\/p>/g, `<br/>`)
                .replace(/<br\/>\n<br\/>/g, `<p/></p>`);
            return resolve(item);
        }
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
        reject(item);
    } finally {
        l("done frontpagemag");
    }
}
export default func;
