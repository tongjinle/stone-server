import * as express from 'express';

import config from '../config';
// import VerifyMgr from '../verifyMgr';
// import TokenMgr from '../TokenMgr';
// import DbMgr from '../dbMgr';
import loger from '../logIns';

// 路由
import testHandle from './testHandle';
// import checkSameUsernameHandle from './checkSameUsernameHandle';
// import getVerifyCodeHandle from './getVerifyCodeHandle';
// import regHandle from './regHandle';
// import loginHandle from './loginHandle';
import bindHandle from './bindHandle';

const { rege } = config;

export default function handler(app: express.Express) {
    // 测试
    testHandle(app);

    // 绑定
    bindHandle(app);

    // // 重名验证
    // checkSameUsernameHandle(app);

    // // 验证码
    // getVerifyCodeHandle(app);

    // // 注册
    // regHandle(app);

    // // 登录
    // loginHandle(app);

    



}