import * as Protocol from '../protocol';
import * as express from 'express';
import config from '../config';
import axios from 'axios';

// 通过code获取微信用户信息
async function getUserInfo(code: string, ): Promise<string> {
    let ret: string;
    let { appId, appSecrect, } = config.wx;
    let url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecrect}&js_code=${code}&grant_type=authorization_code"`;
    try {
        let { data, } = await axios.get(url, );
        if (data.errcode) {
            return undefined;
        } else {
            return data.openId;
        }
    } catch (e) {
        return undefined;

    } finally {

    }
};

export default function handle(app: express.Express) {

    // 测试
    app.get('/wx/userInfo', async (req, res) => {
        let resData: Protocol.IResWxUserInfo;
        let { code: wxCode, } = req.query as Protocol.IReqWxUserInfo;

        let openId: string = await getUserInfo(wxCode);
        resData = { code: !openId ? 0 : undefined, openId, };
        res.json(resData);
    });
}