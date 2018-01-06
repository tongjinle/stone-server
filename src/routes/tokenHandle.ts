import * as express from 'express';
import * as Protocol from '../protocol';
import config from '../config';
import TokenMgr from '../tokenMgr';


export default function handle(app: express.Express) {
    app.get('/getToken', async (req, res) => {
        let resData: Protocol.IResToken;
        let code: number = undefined;
        let cliCode = (req.query as Protocol.IReqToken).code;

        // mock openId
        // 其实应该从微信服务器拿到的
        let openId = (Math.floor(10e8 * Math.random())).toString(16).slice(0, 8);

        let token = TokenMgr.getIns().bind(openId);
        resData = { code, token, };
        res.json(resData);

    });
}