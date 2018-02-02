import 'jasmine';
import Database from '../../db';
import axios from 'axios';
import config from '../../config';
import * as qs from 'querystring';
import * as Protocol from '../../protocol';
import { ITestFunc, IResult } from '../ItestFunc';


let { apiPrefix, } = config;

let fn: ITestFunc = async function({ db, axi, }) {
    let ret: IResult[] = [];

    // bind 
    {
        await db.removeUserAll();

        let dotaId = '1328192478';
        let reward = 1000;
        let bindTime = new Date(2000, 1, 1).getTime();

        let { data: { code, } } = await axi.post(apiPrefix + 'bind', { dotaId, } as Protocol.IReqBind) as { data: Protocol.IResBind };
        ret.push({ title: 'bind success', expect: undefined, calc: code, });
    }

    // bind once more
    {
        await db.removeUserAll();

        let dotaId = '1328192478';
        let reward = 1000;
        let bindTime = new Date(2000, 1, 1).getTime();
        let dotaId2 = '553740215';

        await axi.post(apiPrefix + 'bind', { dotaId, } as Protocol.IReqBind) as { data: Protocol.IResBind };
        
        let { data: { code, } } = await axi.post(apiPrefix + 'bind', { dotaId: dotaId2, } as Protocol.IReqBind) as { data: Protocol.IResBind };
        let { data, } = await axi.get(apiPrefix + 'auth/user/info') as { data: Protocol.IResUserInfo }
        
        ret.push({ title: 'bind once more && query userInfo', expect: dotaId2, calc: data ? data.dotaId : -1 });
    }

    return ret;
}




export default fn;