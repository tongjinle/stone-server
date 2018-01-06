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
import checkHandle from './checkHandle';
import itemHandle from './itemHandle';

// *** 仅仅在开发时期供前端刷新数据所用
import devHandle from './devHandle';

const { rege } = config;

export default function handler(app: express.Express) {
    // 开发
    devHandle(app);

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