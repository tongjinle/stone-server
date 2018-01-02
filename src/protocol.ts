// 绑定id
export interface IReqBind {
    openId: string,
    dataId: string,
};

export interface IResBind {
    // 是否绑定成功
    flag: boolean,
    // 错误码
    code?: number,
    // 第一次绑定的奖励
    reward?: number,
};


// 查看用户个人信息
export interface IReqUserInfo {
};
export interface IResUserInfo {
    // 是否找到个人信息
    flag: boolean,
    // dota数字id
    dotaId: number,
    // 虚拟币
    coin: number,
    // 第一次绑定时间戳,精确到毫秒
    createDate: number,
};



// 今日是否能签到
export interface IReqCanCheck {
};
export interface IResCanCheck {
    // 今日是否能签到
    flag: boolean,
};


// 每日签到
export interface IReqCheck {
};
export interface IResCheck {
    // 是否签到成功
    flag: boolean,
    // 虚拟币奖励
    reward?: number,
};


// 使用虚拟币兑换游戏中的虚拟道具
export interface IReqBuyItem {
    // 虚拟道具编号
    id: number,
};
export interface IResBuyItem {
    // 是否成功兑换
    flag: boolean,
    // 错误码
    // 0 金币不足
    // 1 虚拟道具出售一空或者虚拟道具不存在,即错误的道具编号
    code?: number,
};


// 查看虚拟物品列表
export interface IReqItemList {
    // 页码,从0开始计数
    pageIndex: number,
    // 每页数量
    pageSize: number,
    // 如果设为true,则过滤掉当前用户的虚拟币不能购买的虚拟道具
    canBuy: boolean,
};
export interface IResItemList {
    // 虚拟道具列表
    list: {
        // 道具编号
        id: number,
        // 图片
        src: string,
    }[],
    // 总共的个数(道具个数,而不是页数)
    totalCount: number,
};


// 创建黑店房间
export interface IReqCreateRoom {
    // 新手位置数量
    count: number,
    // 黑店价格
    coin: number,
};
export interface IResCreateRoom {
    // 是否成功创建
    flag: boolean,
    // 错误码
    // 0 用户已经创建了黑店
    // 1 用户已经参加了其他人的黑店
    code?: number,
};


// 通过黑店编号获取黑店信息
export interface IReqRoomInfo {
    // 如果不注明,表示查询用户的当前黑店
    roomId?: number,
};
export interface IResRoomInfo {
    // 是否查询成功
    flag: boolean,
    // 错误码
    // 0 用户没有当前黑店
    code?: number,
    info?: {
        // 黑店编号
        roomId: number,
        // 黑店价格
        coin: number,
        // 黑店创建了之后,5min(默认)之内如果没有人参加就不能参加了
        // 创建黑店的时间戳
        begin: number,
        // 黑店加入的结束时间,(意思过了这个时间点则不能再申请加入)
        end: number,
        // 可以评价的时间
        // 备注下,"元组"数据类型,下面的表示数组就只有2个元素,且都是number类型
        commentDuration: [number, number],
        // 成员以及成员的评价
        commentList?: {
            openId: number,
            // 评价
            // 1 好评
            // 0 普通(默认评价)
            // -1 差评
            comment: number,
        }[],
        // 战绩统计,统计方式待定
        score?: any
    },
};


// 请求加入黑店
export interface IReqJoinRoom {
    // 黑店编号
    roomId: number,
};
export interface IResJoinRoom {
    // 是否成功加入黑店
    flag: boolean,
    // 错误码
    // 0 用户coin不够支付
    // 1 黑店不存在
    // 2 黑店已经过了申请时间
    code?: number,
};





// 评价黑店
export interface IReqCommentRoom {
    // 黑店编号
    roomId: number,
    // 评价
    // 1 好评(默认评价)
    // 0 普通
    // -1 差评
    comment: number,
};
export interface IResCommentRoom {
    // 是否成功评价
    flag: boolean,
    // 错误码
    // 0 不存在这样的黑店
    // 1 用户在该黑店没有评价权(他不在该黑店中)
    // 2 不在可以评价的时间内
    code?: number,
};


// 查询开黑历史
export interface IReqRoomHistory {
    // 页码,从0开始计数
    pageIndex: number,
    // 每页数量
    pageSize: number,

}

export interface IResRoomHistory {
    // 是否查询成功
    flag: boolean,
    // 列表
    list: {
        // 黑店的开始时间戳
        begin: number,
        // 好评率
        comment: {
            good: number,
            normal: number,
            bad: number,
        },
        // 黑店为店主带来的虚拟币总收入
        coin: number,
        score: any,
    }[],
}







