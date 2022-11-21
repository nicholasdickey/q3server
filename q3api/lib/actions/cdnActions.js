import { setCDN, deleteOldCDN, loadCDN } from "../cdn.js";

import { l, chalk } from "../common.js";

const cleanOldCDN = async ({ threadid, sessionid, username, seconds }) => {
    l(`action cleanOldCDN`);
    let result = await deleteOldCDN({
        seconds,
        logContext: {
            sessionid,
            threadid,
            username,
        },
    });
    if (!result || !result.success) {
        l(chalk.red.bold(`ERROR calling deleteOldCDN: ${result}`));
    }
    return result;
};

export default {
    cleanOldCDN,
};
