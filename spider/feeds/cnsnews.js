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
}) {
    try {
        //========================
        // log(`item.image=`, item.image);
        let coreImage = item.image;
        coreImage = coreImage.split("?")[0];
        let w = coreImage.split(`-`);
        if (w && w.length > 1) {
            w.pop();
            coreImage = w.join(`-`);
        }
        //log(`coreImage`, coreImage, w);

        item.author = $(`#CBAuthor`).text();
        let b = $(`div[property="schema:text"]`);
        b.find(`img[src*="` + coreImage + `"]`).remove();
        b.find(`.insert-box`).remove();
        item.body = b.html();

        return resolve(item);
        //==================================================================================
    } catch (x) {
        l(chalk.red(x));
    }
    reject(item);
}
export default func;
