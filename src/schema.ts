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
// 绑定信息
export interface IUser {
    openId: string,
    dotaId: number,
    coin: number,
    bindTime: number,

};

// 签到记录
export interface ICheckRecord {
    openId: string,
    checkTime: number,
    reward: number,
};

// 虚拟道具
export interface IItem {
    name: string,
    coin: number,
    src: string,
};

// 购买记录
export interface IShopRecord {
    // 购买者
    openId: string,
    // 虚拟道具
    itemName: string,
    // 下单时间
    buyTime: number,
    // 单子处理完毕时间
    dealTime: number,
    // 状态
    // 0 下单中
    // 1 成功处理
    // 2 废单
    status: number,
    // 备注
    note: { role: number, text: string, }[],
};

// 黑店房间成绩
interface IScore {
    // 胜利
    win: number,
    // 失败
    lost: number,
};

// 黑店房间
export interface IRoom {
    // *** 黑店加入配置 ***
    // 新人位置数量
    count: number,
    // 黑店价格
    coin: number,
    // 黑店创建了之后,5min(默认)之内如果没有人参加就不能参加了
    // 创建黑店的时间戳
    beginTime: number,
    // 黑店加入的结束时间,(意思过了这个时间点则不能再申请加入)
    endTime: number,

    // *** 黑店成员 ***
    // 店主的openId
    owner: string,
    // 新人们的openId
    mateList: string[],

    // *** 新人们的评价 ***
    // 可以评价的时间
    // 备注下,"元组"数据类型,下面的表示数组就只有2个元素,且都是number类型
    commentDuration: [number, number],
    // 成员以及成员的评价
    comment: {
        good: number,
        normal: number,
        bad: number,
    },
    // 战绩统计,统计方式待定
    score?: IScore, 

};


