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
import * as express from 'express';
import * as Protocol from '../protocol';
import config from '../config';
import Database from '../db';
import * as rege from '../rege';

export default function handle(app: express.Express) {
    // 删除所有用户
    app.get('/dev/user/removeAll', async (req, res) => {
        let db = await Database.getIns();
        await db.removeUserAll();
        res.end('remove user all');
    });


    // 删除所有签到记录
    app.get('/dev/check/removeAll',async(req,res)=>{
      let db = await Database.getIns();
      await db.removeCheckRecordAll();
      res.end('remove checkRecord all');
    });

};




