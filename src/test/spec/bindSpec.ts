import 'jasmine';
import Database from '../../db';
import axios from 'axios';
import config from '../../config';
import * as qs from 'querystring';
import { ITestFunc, IResult } from '../ItestFunc';


let { apiPrefix, } = config;

let fn: ITestFunc = async function({ db, axi, }) {
    let ret: IResult[] = [];
    {
        await db.removeUserAll();

        let openId = 'puman';
        let dotaId = '1328192478';
        let reward = 1000;
        let bindTime = new Date(2000, 1, 1).getTime();

        let { data: { code, } } = await axi.post(apiPrefix + 'bind', { dotaId, }) as { data: { code?: number, } };
        ret.push({ title: 'bind success', expect: undefined, calc: code, });
    }

    return ret;
}




export default fn;