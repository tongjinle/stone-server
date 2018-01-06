import * as express from 'express';

import config from '../config';
// import VerifyMgr from '../verifyMgr';
// import TokenMgr from '../TokenMgr';
// import DbMgr from '../dbMgr';
import loger from '../logIns';
import TokenMgr from '../tokenMgr';

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

// *** 仅仅在开发时期供前端刷新数据所用
import devHandle from './devHandle';

const { rege } = config;

export default function handler(app: express.Express) {
    // 检测/auth/路由下的访问权限
    app.use((req, res, next) => {
        if (/\/auth\//.test(req.path)) {
            loger.debug('check auth');
            let token: string = req.headers['token'] as string;
            if (!TokenMgr.getIns().check(token)) {
                res.json({
                    code: 100,
                });
                return;
            }
            req.headers['openId'] = TokenMgr.getIns().get(token);
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

    // // 重名验证
    // checkSameUsernameHandle(app);

    // // 验证码
    // getVerifyCodeHandle(app);

    // // 注册
    // regHandle(app);

    // // 登录
    // loginHandle(app);





}