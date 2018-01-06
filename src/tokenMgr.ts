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

export default class TokenMgr {
    private dict: { [token: string]: { openId: string, expires: number, } };
    private constructor() {
        this.dict = {};
    }

    private static ins: TokenMgr;
    static getIns() {
        if (!TokenMgr.ins) {
            TokenMgr.ins = new TokenMgr();
        }
        return TokenMgr.ins;
    }

    // 检测token有效性
    check(token: string): boolean {
        return this.dict[token] && this.dict[token].expires > Date.now();
    }

    // 绑定openId,生成token
    bind(openId: string): string {
        const duration = config.tokenExpires;
        let token: string = Math.floor((10e8 * Math.random())).toString(16).slice(0, 8);
        this.dict[token] = { openId, expires: Date.now() + duration, };
        return token;
    }

    // 通过token查询openId
    get(token: string): string {
        return this.dict[token].openId;
    }


}