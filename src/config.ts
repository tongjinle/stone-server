const config = {
    port: 3000,

    ['rege']: {


        username: /^[\d\w]{4,12}$/,
        password: /^[\d\w]{6,12}$/,
        nickname: /^[\u4e00-\u9fa5\d\w]{2,8}$/,
        gender: /^0|1$/,
        birthYear: /^\d{4}$/,
    },

    verifyCodeDuration: .5 * 60 * 1000,

    // 2天
    tokenExpires: 2 * 24 * 60 * 60 * 1000,


    // 绑定奖励
    bindReward:1000,

    // 日常奖励
    dayReward:100,
};
export default config;