
//cdn.js 9
import fs from "fs"; //.promises;
import { promises as pfs } from "fs";
import request from "request";
//require("dotenv").config();
import dbCdn from "./db/dbCdn.js";
import { l, chalk } from "./common.js";
const dbServerNameX1 = process.env.DB_HOST_PRIMARY;
const dbServerNameX2 = process.env.DB_HOST_SECONDARY;

const setCDN = async ({ image, logContext }) => {
    // l("setCDN", dbServerNameX1, dbServerNameX2);
    let result = await dbCdn.init({
        ...logContext,
        dbServerName: dbServerNameX1,
        dbPort: process.env.DB_PORT_PRIMARY,
        input: { image },
    });
    // l("result setCDN", result);
    /*if (result && result.success) {
        //s l("calling second cdn");
        result = await dbCdn.init({
            ...logContext,
            dbServerName: dbServerNameX2,
            dbPort: process.env.DB_PORT_SECONDARY,
            input: { image },
        });
        // l("result setCDN2", result);
    }*/
    return result;
};

const loadCDN = async ({ file, logContext }) => {
    // let exists = await pfs.stat(`./public/cdn/x/${file}`);
    // l(chalk.magenta(exists));
    // if (exists) return true;
    // if (pfs.stat(`./public/cdn/x/${file}`)) return true;
    l(chalk.green(`loadCDN entry ${file}`));
    let image = `/cdn/x/${file}`;
    let result = null;
    try {
        result = await dbCdn.getImageSrc({
            ...logContext,
            dbServerName: dbServerNameX1,
            dbPort: process.env.DB_PORT_PRIMARY,
            input: { image },
        });
        if (result && result.success) {
            image_src = result.image_src;

            //fs.createReadStream(image_src).pipe(fs.createWriteStream("newLog.log"));
            await request(image_src).pipe(
                fs.createWriteStream(`./cdn/x/${file}`)
            );
            //let err = await fs.copyFile(image_src, image);
            //if (err) throw err;
            console.log(`${image_src} was copied to ${image}`);
            result = await dbCdn.updateStatus({
                ...logContext,
                dbServerName: dbServerNameX1,
                dbPort: process.env.DB_PORT_PRIMARY,
                input: { image, status: 1 },
            });
        }
    } catch (x) {
        l(chalk.red("CDN file unavailable"), image);
    }
    return result;
};
const deleteOldCDN = async ({ logContext, seconds }) => {
    l("deleteOldCDN");
    let result = await dbCdn.getOldLoaded({
        ...logContext,
        dbServerName: dbServerNameX1,
        dbPort: process.env.DB_PORT_PRIMARY,
        input: { seconds },
    });
    if (result && result.success) {
        let rows = result.rows;
        //l("deleteOldCDN1", rows.length, rows);
        for (var i = 0; i < rows.length; i++) {
            let image = rows[i]["image"];
            let fileW = image.split("/");
            let file = fileW[fileW.length - 1];
            let path = `./cdn/x/${file}`;
            l(chalk.yellow(file, path));
            let err = await pfs.unlink(path);
            // l(`after unlink`, err);
            if (err) throw err;
            result = await dbCdn.updateStatus({
                ...logContext,
                dbServerName: dbServerNameX1,
                dbPort: process.env.DB_PORT_PRIMARY,
                input: { image, status: 0 },
            });
        }
    }
    return {
        success: true,
    };
};

export { setCDN, deleteOldCDN, loadCDN };
