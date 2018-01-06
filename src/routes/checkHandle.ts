import * as express from 'express';
import * as Protocol from '../protocol';
import config from '../config';
import Database from '../db';


export default function handle(app: express.Express) {
    app.get('/auth/check/canCheck', async (req, res) => {
        let resData: Protocol.IResCanCheck;
        // let {openId,} = req.query as Protocol.IReqCanCheck;

        let flag: boolean = true;
        let code: number = undefined;

        // let db = await Database.getIns();
        // db.getCheckRecord(o)

        let data: Protocol.IResCanCheck = { flag, code, };
        res.json(data);
    });


    app.post('/auth/check/dayCheck', async (req, res) => {
        let code: number = undefined;
        let reward: number = config.dayReward;
        let data: Protocol.IResCheck = { code, reward, };
        res.json(data);
    });
};