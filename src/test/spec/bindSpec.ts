import Database from '../../db';
import axios from 'axios';
import config from '../../config';
import * as qs from 'querystring';
import * as Protocol from '../../protocol';
import { ITestFunc, IResult } from '../ItestFunc';


let { apiPrefix, } = config;

let fn: ITestFunc = async function({ db, axi, }) {
    let ret: IResult[] = [];

    // 成功绑定 
    {
        await db.removeUserAll();

        let dotaId = '1328192478';

        let { data: { code, } } = await axi.post(apiPrefix + 'bind', { dotaId, } as Protocol.IReqBind) as { data: Protocol.IResBind };
        ret.push({ title: '成功绑定', expect: undefined, calc: code, });

    }

    // 未绑定,查询用户信息
    // !不能
    {
        await db.removeUserAll();
        let { data, } = await axi.get(apiPrefix + 'auth/user/info') as { data: Protocol.IResUserInfo }
        ret.push({ title: '再次绑定,修改dotaId', expect: config.commonErrCode.userInvalid, calc: data.code, });

    }

    

    // 再次绑定,修改dotaId
    {
        await db.removeUserAll();

        let dotaId = '1328192478';
        let dotaId2 = '553740215';

        await axi.post(apiPrefix + 'bind', { dotaId, } as Protocol.IReqBind) as { data: Protocol.IResBind };

        let { data: { code, } } = await axi.post(apiPrefix + 'bind', { dotaId: dotaId2, } as Protocol.IReqBind) as { data: Protocol.IResBind };
        let { data, } = await axi.get(apiPrefix + 'auth/user/info') as { data: Protocol.IResUserInfo }

        ret.push({ title: '再次绑定,修改dotaId', expect: dotaId2, calc: data ? data.dotaId : -1 });
    }

    return ret;
}




export default fn;