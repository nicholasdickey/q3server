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
        item.author = $(".author").text();
        item.title = item.title ? item.title.split("|")[0] : "";
        //  log("item", JSON.stringify(item))
        let graph = $("script.yoast-schema-graph").text();
        let og = JSON.parse(graph);
        //   console.log("graph", og);
        let g3 = og["@graph"];
        // console.log("g3", JSON.stringify(g3, null, 4))
        for (var i = 0; i < g3.length; i++) {
            let t = g3[i]["@type"];
            if (t == "WebPage") {
                item.published_time =
                    (Date.parse(g3[i].datePublished) / 1000) | 0;
            }
        }
        //  console.log("item.publised_time", item.published_time)
        /* let description = $("#article-inner p");

         //.first().text()
         let eq = 0;
         item.description = ""; //<p><em>'+defaultDescription+'</em></p>';
         
         while (item.description.length < 512) {
             item.description += "\n" + description.eq(eq++).text();
         }*/
        let b = $(`.c-content`);
        item.body = b.html();

        return resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
}
export default func;
