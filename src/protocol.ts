/*
    *********************************************  
                       _ooOoo_  
                      o8888888o  
                      88" . "88  
                      (| -_- |)  
                      O\  =  /O  
                   ____/`---'\____  
                 .'  \|     |//  `.  
                /  \|||  :  |||//  \  
               /  _||||| -:- |||||-  \  
               |   | \\  -  /// |   |  
               | \_|  ''\---/''  |   |  
               \  .-\__  `-`  ___/-. /  
             ___`. .'  /--.--\  `. . __  
          ."" '<  `.___\_<|>_/___.'  >'"".  
         | | :  `- \`.;`\ _ /`;.`/ - ` : | |  
         \  \ `-.   \_ __\ /__ _/   .-` /  /  
    ======`-.____`-.___\_____/___.-`____.-'======  
                       `=---='  
    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^  
               佛祖保佑       永无BUG  
*/
import * as Struct from './struct';

// *** 基础response格式
// *** 带有code[错误码]和msg[错误信息]
// *** 当code===undefined的时候,表示正确
interface IResBase {
    // 错误码
    code?: number,
    // 错误信息
    msg?: string,
};

export interface IReqToken {
    code: string,
}
export interface IResToken extends IResBase {
    token?: string,
}

export interface IReqOpenId {
}
export interface IResOpenId extends IResBase {
    openId?: string,
}




// 绑定id
export interface IReqBind {
    dotaId: string,
};

export interface IResBind extends IResBase {
    // 第一次绑定的奖励
    reward?: number,
};


// 查看用户个人信息
export interface IReqUserInfo {
    openId: string,
};
export interface IResUserInfo extends IResBase {
    // 错误码
    // 0 不存在此人

    // dota数字id
    dotaId?: string,
    // 虚拟币
    coin?: number,
    // 第一次绑定时间戳,精确到毫秒
    bindTime?: number,
    // 当前黑店id
    currRoomId?: string,
};



// 今日是否能签到
export interface IReqCanCheck {

};
export interface IResCanCheck extends IResBase {
    // 今日是否能签到
    flag: boolean,
};


// 每日签到
export interface IReqCheck {
};
export interface IResCheck extends IResBase {
    // 虚拟币奖励
    reward?: number,
};

// 新增虚拟道具
export interface IReqCreateItem {
    name: string,
    coin: number,
    src: string,
}

export interface IResCreateItem extends IResBase {

}

// 修改虚拟道具
export interface IReqUpdateItem {
    name: string,
    coin?: number,
    src?: string,
    newName?: string,
}

export interface IResUpdateItem extends IResBase {

}

// 下架虚拟道具
export interface IReqRemoveItem {
    name: string,
}

export interface IResRemoveItem extends IResBase {

}

// 使用虚拟币兑换游戏中的虚拟道具
export interface IReqBuyItem {
    // 虚拟道具名
    name: string,
};
export interface IResBuyItem extends IResBase {
    // 错误码
    // 0 金币不足
    // 1 虚拟道具出售一空或者虚拟道具不存在,即错误的道具编号

    // 成功购买之后的交易id
    shopId?: string,
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
export interface IResItemList extends IResBase {
    // 虚拟道具列表
    list?: {
        // 名称
        name: string,
        // 图片
        src: string,
        // 价格
        coin: number,
    }[],
    // 总共的个数(道具个数,而不是页数)
    totalCount?: number,
};


// 创建黑店房间
export interface IReqCreateRoom {
    // 新手位置数量
    count: number,
    // 黑店价格
    coin: number,
};
export interface IResCreateRoom extends IResBase {
    // 错误码
    // 0 用户已经创建了黑店
    // 1 用户已经参加了其他人的黑店
    // 房间编号
    id?: string,
};


// 通过黑店编号获取黑店信息
export interface IReqRoomInfo {
    // 如果不注明,表示查询用户的当前黑店
    roomId?: string,
};
export interface IResRoomInfo extends IResBase {
    // 错误码
    // 0 用户没有当前黑店

    // 房间信息
    info?: Struct.IRoomInfo,
};


// 请求加入黑店
export interface IReqApplyRoom {
    // 黑店编号
    roomId: string,
};
export interface IResApplyRoom extends IResBase {

    // 错误码
    // 0 用户coin不够支付
    // 1 黑店不存在
    // 2 黑店已经过了申请时间
};





// 评价黑店
export interface IReqCommentRoom {
    // 黑店编号
    roomId: string,
    // 评价
    // 1 好评(默认评价)
    // 0 普通
    // -1 差评
    comment: number,
};
export interface IResCommentRoom extends IResBase {
    // 错误码
    // 0 不存在这样的黑店
    // 1 用户在该黑店没有评价权(他不在该黑店中)
    // 2 不在可以评价的时间内
};


// 查询开黑历史
export interface IReqRoomHistory {
    // 页码,从0开始计数
    pageIndex: number,
    // 每页数量
    pageSize: number,

}

export interface IResRoomHistory extends IResBase {
    // 列表
    list?: Struct.IRoomRusume[],
}

// 微信 请求用户信息 
export interface IReqWxUserInfo {
    code: string,
}


export interface IResWxUserInfo extends IResBase {
    openId?: string,
}





