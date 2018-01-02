// 绑定id
export interface IReqBind{
    openId:string,
    dataId:string,
};

export interface IResBind{
    // 是否绑定成功
    flag:boolean,
    // 错误码
    code?:number,
    // 第一次绑定的奖励
    reward?:number,
};



