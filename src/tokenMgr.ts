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
    private opDict: { [openId: string]: string };
    private constructor() {
        this.dict = {};
        this.opDict = {};

        // mock
        {
            let token = 'testToken',
                openId = 'puman',
                expires = new Date(2999, 0, 1).getTime();
            this.dict[token] = { openId, expires, };
            this.opDict[openId] = token;
        }
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
    bind(openId: string, ): string {
        if(openId===undefined){
          return undefined;
        }
        // 使用缓存的未过期的token
        {
            let token = this.opDict[openId];
            if (this.check(token)) {
                return token;
            }
        }
        // 创建token
        const duration = config.tokenExpires;
        let token: string = Math.floor((10e8 * Math.random())).toString(16).slice(0, 8);
        this.dict[token] = { openId, expires: Date.now() + duration, };
        this.opDict[openId] = token;
        return token;
    }

    // 通过token查询openId
    get(token: string): string {
        return this.dict[token] && this.dict[token].openId;
    }


}