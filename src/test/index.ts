import * as path from 'path';
import * as glob from 'glob';
import * as qs from 'querystring';
import * as axiosNs from 'axios';
import config from '../config';
import chalk from 'chalk';
import { ITestFunc, IResult, } from './ItestFunc';
import Database from '../db';


let dir = path.resolve(__dirname, './spec');
// console.log(dir);
let files = glob.sync(dir + '/**/*[sS]pec.js');
console.log('files:', files);


let { apiPrefix, } = config;
async function main() {
    let db = await Database.getIns();
    let axi = getAxios();
    let token = await getToken('testToken');
    axi.defaults.headers.token = token;

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

function getAxios(): axiosNs.AxiosInstance {
    return axiosNs.default.create();
}

async function getToken(code: string) {
    let axi = getAxios();
    let url = apiPrefix + 'getToken' + '?' + qs.stringify({ code, });
    let { data } = await axi.get(url) as { data: { code?: number, token?: string, } };
    return data.token;
};

main();