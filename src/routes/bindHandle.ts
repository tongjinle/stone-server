import * as express from 'express';
import * as Protocol from '../protocol';
import config from '../config';
import Database from '../db';
import * as rege from '../rege';

enum eBindCode {
    // 数据格式错误
    invalidFormat,
    // openId已经存在
    openIdExist,
};

enum eQueryUserInfoCode {
    // 0 不存在此人
    openIdNotExist,
    // 1 数据格式不对
    invalidFormat,
};


export default function handle(app: express.Express) {
    app.post('/auth/bind', async (req, res) => {
        let resData: Protocol.IResBind;
        let { dotaId } = req.body as Protocol.IReqBind;
        let openId: string = req.headers['openId'] as string;
        let code: number = undefined;
        let reward: number = config.bindReward;

        // 正则
        if (openId === undefined ||
            dotaId === undefined ||
            !rege.openId.test(openId) ||
            !rege.dotaId.test(dotaId.toString())) {
            code = eBindCode.invalidFormat;
            resData = { code, };
            res.json(resData);
            return;
        }

        //插入数据库
        let db = await Database.getIns();
        let { user, } = await db.queryUser({ openId, });
        if (!!user) {
            code = eBindCode.openIdExist;
            resData = { code, };
            res.json(resData);
            return;
        }

        let bindTime: number = Date.now();
        await db.insertUser({ openId, dotaId, reward, bindTime, });
        resData = { code, reward, };
        res.json(resData);
    });

    app.get('/auth/user/info', async (req, res) => {
        let resData: Protocol.IResUserInfo;
        let code: number = undefined;
        let openId: string = req.headers['openId'] as string;
        if (!rege.openId.test(openId)) {
            code = eQueryUserInfoCode.invalidFormat;
            resData = { code, };
            res.json(resData);
            return;
        }

        let db = await Database.getIns();
        let { user } = await db.queryUser({ openId, });
        if (!user) {
            code = eQueryUserInfoCode.openIdNotExist;
            resData = { code, };
            res.json(resData);
            return;
        }
        resData = { code, dotaId: user.dotaId, coin: user.coin, bindTime: user.bindTime,currRoomId:user.currRoomId, };
        res.json(resData);

    });
}