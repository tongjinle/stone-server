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



