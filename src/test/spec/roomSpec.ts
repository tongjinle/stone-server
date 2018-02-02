import Database from '../../db';
import axios from 'axios';
import config from '../../config';
import * as qs from 'querystring';
import * as Protocol from '../../protocol';
import { ITestFunc, IResult } from '../ItestFunc';


let { apiPrefix, } = config;

let fn: ITestFunc = async function({ db, axi, }) {
    let ret: IResult[] = [];

    // 建立黑店
    // !成功,用户存在当前黑店
    // 再次建立黑店
    // !失败,因为用户有当前黑店
    {
        await db.removeUserAll();
        await db.removeRoomAll();
    }



 

    return ret;
}




export default fn;