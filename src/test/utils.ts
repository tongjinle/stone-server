import * as axiosNs from 'axios';
import config from '../config';
import * as qs from 'querystring';

let { apiPrefix, } = config;

export async function getAxios(code: string, ): Promise<axiosNs.AxiosInstance> {
    let axi = axiosNs.default.create();
    let token = await getToken(axi, code);
    axi.defaults.headers['token'] = token;
    return axi;
}


export async function getToken(axi: axiosNs.AxiosInstance, code: string): Promise<string> {

    let url = apiPrefix + 'getToken' + '?' + qs.stringify({ code, });
    let { data } = await axi.get(url) as { data: { code?: number, token?: string, } };
    return data.token;
};