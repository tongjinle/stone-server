import * as express from 'express';
import * as Protocol from '../protocol';
import config from '../config';
import TokenMgr from '../tokenMgr';
import axios from 'axios';
import * as Chance from 'chance';

// 通过code获取微信用户信息
async function getUserInfo(code: string, ): Promise<string> {
    let ret: string;
    let { appId, appSecret, } = config.wx;
    let url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecret}&js_code=${code}&grant_type=authorization_code"`;
    try {
        let { data, } = await axios.get(url, );
        console.log('getWxOpenId:', JSON.stringify(data));
        if (data.errcode) {
            return undefined;
        } else {
            return data.openid;
        }
    } catch (e) {
        return undefined;

    } finally {

    }
};

let chance = new Chance();
export default function handle(app: express.Express) {
    app.get('/getToken', async (req, res) => {
        let resData: Protocol.IResToken;
        let code: number = undefined;
        let cliCode = (req.query as Protocol.IReqToken).code;


        let openId = config.isMockOpenId ? cliCode + chance.string({ length: 8 }) : await getUserInfo(cliCode);
        console.log(openId, config.isMockOpenId, config.mockOpenId);

        // 获取openId失败
        if (!openId) {
            code = 0;
            resData = { code, };
            res.json(resData);
            return;
        }


        let token = TokenMgr.getIns().bind(openId);
        resData = { code, token, };
        res.json(resData);

    });

    app.get('/getOpenId',async(req,res)=>{
        let resData:Protocol.IResOpenId;
        let openId:string = req.headers['openId'] as string;

        resData = {openId,};
        res.json(resData); 

    });
}










