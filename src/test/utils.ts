import * as axiosNs from 'axios';
import config from '../config';
import * as qs from 'querystring';
import * as Protocol from '../protocol';

let { apiPrefix, } = config;

export async function getAxios(code: string, ): Promise<axiosNs.AxiosInstance> {
    let axi = axiosNs.default.create();
    let token = await getToken(axi, code);
    axi.interceptors.request.use(cfg => {
        cfg.headers['token'] = token;
        return cfg;
    });
    // axi.defaults.headers['token'] = token;
    return axi;
}


export async function getToken(axi: axiosNs.AxiosInstance, code: string): Promise<string> {
    let url = apiPrefix + 'getToken' + '?' + qs.stringify({ code, });
    let { data } = await axi.get(url) as { data: { code?: number, token?: string, } };
    return data.token;
};

export async function getOpenId(axi: axiosNs.AxiosInstance, ): Promise<string> {
    let url = apiPrefix + 'getOpenId';
    let { data } = await axi.get(url) as { data: { code?: number, openId?: string, } };
    return data.openId;
}

export async function createUser(axi: axiosNs.AxiosInstance, dotaId: string): Promise<void> {
    await axi.post(apiPrefix + 'bind', { dotaId, } as Protocol.IReqBind) as { data: Protocol.IResBind };

}

export async function createAdmin(userName: string, password: string, ): Promise<axiosNs.AxiosInstance> {
    let axi = axiosNs.default.create();
    let url = apiPrefix + 'admin/login';
    let { data, } = await axi.post(url, { userName, password, }) as { data: Protocol.IResAdminLogin, };

    axi.interceptors.request.use(cfg => {
        console.log(data);
        cfg.headers['token'] = data.token;
        return cfg;
    });
    return axi;
}



export function delay(ms: number): Promise<void> {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}