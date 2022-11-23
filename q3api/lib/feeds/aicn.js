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
    pageUrl,
    args,
}) {
    try {
        //========================"
        log("pt==" + item.published_time);
        var s = $("script").text();
        var w1 = s.split("meta_published_date ");
        var s1 = w1[1];
        var w2 = s1.split("meta_modified_date ");
        var s2 = w2[0];
        var w3 = s2.split("(");
        var s3 = w3[1];
        var w4 = s3.split(")");
        var s4 = w4[0];
        var w5 = s4.split(",", 6);
        log(
            "w5=" +
                w5[0] +
                "," +
                w5[1] +
                "," +
                w5[2] +
                "," +
                w5[3] +
                "," +
                w5[4] +
                "," +
                w5[5]
        );
        try {
            var dt = new Date(w5[0], w5[1], w5[2], w5[3], w5[4], w5[5]);
            var pubtime = (dt.getTime() / 1000) | 0;
            log("dt=" + pubtime);
        } catch (x) {
            log("exception " + x);
        }

        return resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
    reject(item);
}
export default func;
