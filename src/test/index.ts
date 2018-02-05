import * as path from 'path';
import * as glob from 'glob';
import * as qs from 'querystring';
import * as axiosNs from 'axios';
import config from '../config';
import chalk from 'chalk';
import { ITestFunc, IResult, } from './ItestFunc';
import Database from '../db';
import * as utils from './utils';


let dir = path.resolve(__dirname, './spec');
// console.log(dir);
let files = glob.sync(dir + '/**/*[sS]pec.js');
console.log('files:', files);


let { apiPrefix, } = config;
async function main() {
    let db = await Database.getIns();
    let axi = await utils.getAxios('default');

    for (var i = 0; i < files.length; i++) {
        let file = files[i];
        let fn = require(file).default as ITestFunc;
        try {
            console.log(chalk.whiteBright(`## ${file.match(/\/(.*?)[sS]pec.js$/)[1]} ##`));
            let retList = await fn({ db, axi, });
            retList.forEach(ret => {
                if (ret.expect === ret.calc) {
                    console.log(chalk.whiteBright('.'));
                } else {
                    console.log(chalk.red(`${ret.title}::${ret.expect}::${ret.calc}`));
                }
            });
        } catch (e) {
            console.log(chalk.yellowBright(e.toString()));
        }

    }
    await db.close();

}

main();