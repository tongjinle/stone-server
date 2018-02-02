import Database from '../../db';
import axios from 'axios';
import config from '../../config';
import * as qs from 'querystring';
import * as Protocol from '../../protocol';
import { ITestFunc, IResult } from '../ItestFunc';


let { apiPrefix, } = config;

let fn: ITestFunc = async function({ db, axi, }) {
    let ret: IResult[] = [];

    await db.removeUserAll();
    await db.removeCheckRecordAll();

    // 未绑定的情况下,请求是否可以check
    // !不能
    {
        let { data, } = await axi.get(apiPrefix + 'auth/check/canCheck') as { data: Protocol.IResCanCheck };
        ret.push({ title: '未绑定的情况下,请求是否可以check', expect: config.commonErrCode.userInvalid, calc: data.code, });

    }

    // 未绑定的情况下,进行check
    // !不能
    {
        let { data, } = await axi.get(apiPrefix + 'auth/check/check') as { data: Protocol.IResCheck };
        ret.push({ title: '未绑定的情况下,进行check', expect: config.commonErrCode.userInvalid, calc: data.code, });
    }

    // 绑定的情况下,请求是否可以check
    // !能
    // 进行check
    // !能
    // 再次,请求是否可以check
    // !不能
    // 再次,进行check
    // !不能
    {
        let dotaId = '1328192478';
        let { data: { code, } } = await axi.post(apiPrefix + 'bind', { dotaId, } as Protocol.IReqBind) as { data: Protocol.IResBind };

        {
            let { data, } = await axi.get(apiPrefix + 'auth/check/canCheck') as { data: Protocol.IResCanCheck };
            ret.push({ title: '绑定的情况下,请求是否可以check', expect: undefined, calc: data.code, });
        }
        {
            let { data, } = await axi.post(apiPrefix + 'auth/check/dayCheck') as { data: Protocol.IResCheck };
            ret.push({ title: '进行check', expect: undefined, calc: data.code, });
        }

        {
            let { data, } = await axi.get(apiPrefix + 'auth/check/canCheck') as { data: Protocol.IResCanCheck };
            ret.push({ title: '再次,请求是否可以check', expect: 0, calc: data.code, });
        }

        {
            let { data, } = await axi.post(apiPrefix + 'auth/check/dayCheck') as { data: Protocol.IResCheck };
            ret.push({ title: '进行check', expect: 0, calc: data.code, });

        }
    }

    return ret;
}




export default fn;