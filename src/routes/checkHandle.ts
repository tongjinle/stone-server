import * as express from 'express';
import * as Protocol from '../protocol';
import config from '../config';
import Database from '../db';


export default function handle(app: express.Express) {
    // 是否今日有签到记录
    async function hasCheck(openId: string): Promise<boolean> {
        let today = new Date();
        let begin = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
        let end = begin + 24 * 60 * 60 * 1000;

        let db = await Database.getIns();
        let { list, } = await db.getCheckRecord({ openId, begin, end, });
        return !!list.length;
    }


    // 今日是否可以签到
    app.get('/auth/check/canCheck', async (req, res) => {
        let resData: Protocol.IResCanCheck;
        let openId: string = req.headers['openId'] as string;

        let flag: boolean = true;
        let code: number = undefined;

        flag = !await hasCheck(openId);

        resData = { flag, code, };
        res.json(resData);
    });


    app.post('/auth/check/dayCheck', async (req, res) => {
        let resData: Protocol.IResCheck;
        let code: number = undefined;
        let reward: number = config.dayReward;

        let openId: string = req.headers['openId'] as string;


        if (await hasCheck(openId)) {
            code = 0;
            resData = { code, }
            return;
        }

        let db = await Database.getIns();
        let checkTime: number = Date.now();
        db.insertCheckRecord({ openId, reward, checkTime, });
        resData = { code, reward, };
        res.json(resData);
    });
};