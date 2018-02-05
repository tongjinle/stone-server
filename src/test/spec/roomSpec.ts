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

    // 有黑店的状态下,不能参加别的黑店
    // puman建立黑店,记作ra
    // puman参加黑店ra
    // !失败,自己不能参加自己的黑店
    // dino参加黑店ra
    // !成功
    // tong建立黑店,记作rb
    // tong参加黑店ra
    // !失败,自己已经有黑店了
    // dino参加黑店rb
    // !失败,自己已经有黑店了



    // 黑店超过时间了,不能参加

    // 黑店超过最大人员,不能参加

    // 不是黑店人员,不能评价

    // 黑店超过评价时间了,不能评价,会自动评价

    // 黑店的自动解除状态
 

    return ret;
}




export default fn;