import * as express from 'express';

import config from '../config';
// import VerifyMgr from '../verifyMgr';
// import TokenMgr from '../TokenMgr';
// import DbMgr from '../dbMgr';
import loger from '../logIns';
import TokenMgr from '../tokenMgr';
import Database from '../db';

// 路由
import testHandle from './testHandle';
// import checkSameUsernameHandle from './checkSameUsernameHandle';
// import getVerifyCodeHandle from './getVerifyCodeHandle';
// import regHandle from './regHandle';
// import loginHandle from './loginHandle';
import bindHandle from './bindHandle';
import checkHandle from './checkHandle';
import itemHandle from './itemHandle';
import tokenHandle from './tokenHandle';
import roomHandle from './roomHandle';


// *** 仅仅在开发时期供前端刷新数据所用
import devHandle from './devHandle';

const { rege } = config;

export default function handler(app: express.Express) {
    // bind需要token
    app.use(async (req, res, next) => {
        if (/\/bind$|\/auth\//.test(req.path)) {
            let token: string = req.headers['token'] as string;
            if (!TokenMgr.getIns().check(token)) {
                res.json({ code: 100, });
                return;
            }

        }
        next();
    });


    // 检测/auth/路由下的访问权限
    // 检查有没有合法的token
    // 错误码 100
    app.use(async (req, res, next) => {
        if (/\/auth\//.test(req.path)) {
            let token: string = req.headers['token'] as string;
            let openId: string = req.headers['openId'] = TokenMgr.getIns().get(token);
            let db = await Database.getIns();
            let { user, } = await db.queryUser({ openId, });
            if (!user) {
                res.json({ code: 100, });
                return;
            }
        }


        next();
    });

    // 某些黑店操作,需要用户没有当前黑店
    // 错误码 200
    app.use(async (req, res, next) => {
        let matchList = [
            /\/auth\/room\/create/,
            /\/auth\/room\/comment/,
            /\/auth\/room\/apply/,
        ];

        if (matchList.some(n => n.test(req.path))) {
            let db = await Database.getIns();

            let openId: string = req.headers['openId'] as string;
            let { user } = await db.queryUser({ openId, });
            // 存在当前黑店
            if (user.currRoomId != undefined) {
                let { room } = await db.queryRoom({ roomId: user.currRoomId, });
                if (!!room) {
                    let code: number = 200;
                    res.json({ code, });
                    return;
                }
            }
        }
        next();
    });



    // 开发
    devHandle(app);

    // token
    tokenHandle(app);

    // 测试
    testHandle(app);

    // 绑定
    bindHandle(app);

    // 每日签到
    checkHandle(app);

    // 虚拟物品相关
    itemHandle(app);

    // 黑店
    roomHandle(app);



}