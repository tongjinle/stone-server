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

import config from './config';
import Database from './db';

// *** 存放一些通用方法 ***

// 获取用户信息

// 获取当前黑店

// 能否建立黑店

// 能否加入黑店

// check黑店是否过期
let checkRoomExpires = async (roomId: string): Promise<{ flag: boolean, }> => {
    let flag: boolean = false;
    let db = await Database.getIns();

    let { room, } = await db.queryRoom({ roomId, })
    if (!room) {
        return { flag, };
    }
    let now = Date.now();
    if (now > room.endTime + config.commentEndTime) {
        flag = true;
    }

    return { flag, };
};

// 定时检测黑店是否过期
// 检测排名前n名的黑店
let clearRoomLoop = async (): Promise<void> => {
    let db = await Database.getIns();
    let { count, interval } = config.clearRoom;
    setInterval(() => {
        let deadline = Date.now();
        db.clearRoomList({ count, deadline, });
    }, interval);
};

let utils = {
    checkRoomExpires,
    clearRoomLoop,
};



export default utils;
