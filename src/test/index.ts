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

// files = filter('itemSpec');


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
                let flag: boolean = true;

                if (Array.isArray(ret.expect)) {
                    flag = !ret.expect.some((n, i) => {
                        if (ret.calc[i] !== ret.expect[i]) {
                            return true;
                        }
                    });
                } else {
                    flag = ret.expect === ret.calc;
                }
                if (flag) {
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

function filter(keyword: string): string[] {
    let ret: string[];
    ret = files.filter(n => n.indexOf(keyword) >= 0);
    return ret;
}

main();