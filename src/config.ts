const MIN = 60 * 1000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

const config = {
    // http 端口
    port: 3000,

    // 注册正则
    ['rege']: {
        username: /^[\d\w]{4,12}$/,
        password: /^[\d\w]{6,12}$/,
        nickname: /^[\u4e00-\u9fa5\d\w]{2,8}$/,
        gender: /^0|1$/,
        birthYear: /^\d{4}$/,
    },

    // 验证码时间
    verifyCodeDuration: .5 * HOUR,

    // 2天
    tokenExpires: 2 * DAY,


    // 绑定奖励
    bindReward: 1000,

    // 日常奖励
    dayReward: 100,

    // 加入黑店结束时间,5min
    roomEndTime: 5 * MIN,

    // 可以评论黑店时间,1小时到3小时
    commentBeginTime: HOUR,
    commentEndTime: 3 * HOUR,

    // *** 数据库
    connectStr: 'mongodb://sa:sa@118.31.11.29:27017/admin',

    // 微信
    // 是否mock openId
    isMockOpenId:false,
    // appId和appSecret
    wx:{
        appId:'wx78e8934b88e1cd61',
        appSecret:'3da2d219dfd019df08433c2cd60ee2de',
    },

};

export default config;