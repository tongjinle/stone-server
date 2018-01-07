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
    app.get('/dev/check/removeAll', async (req, res) => {
        let db = await Database.getIns();
        await db.removeCheckRecordAll();
        res.end('remove checkRecord all');
    });


    // 插入如下的虚拟道具记录
    app.get('/dev/item/insert', async (req, res) => {
        let db = await Database.getIns();
        let list = [
            { name: 'dragon_1', coin: 10, src: 'http://www.th7.cn/d/file/p/2016/12/01/9c8c8eeb290d69739580d1333b8ae7e8.jpg' },
            { name: 'dragon_2', coin: 30, src: 'http://www.th7.cn/d/file/p/2016/12/01/9c8c8eeb290d69739580d1333b8ae7e8.jpg' },
            { name: 'dragon_3', coin: 100, src: 'http://www.th7.cn/d/file/p/2016/12/01/9c8c8eeb290d69739580d1333b8ae7e8.jpg' },
            { name: 'dragon_4', coin: 100, src: 'http://www.th7.cn/d/file/p/2016/12/01/9c8c8eeb290d69739580d1333b8ae7e8.jpg' },
            { name: 'pig_5', coin: 50, src: 'http://www.th7.cn/d/file/p/2016/12/01/9c8c8eeb290d69739580d1333b8ae7e8.jpg' },
            { name: 'pig_6', coin: 2000, src: 'http://www.th7.cn/d/file/p/2016/12/01/9c8c8eeb290d69739580d1333b8ae7e8.jpg' },
            { name: 'pig_7', coin: 2000, src: 'http://www.th7.cn/d/file/p/2016/12/01/9c8c8eeb290d69739580d1333b8ae7e8.jpg' },
            { name: 'pig_8', coin: 1000, src: 'http://www.th7.cn/d/file/p/2016/12/01/9c8c8eeb290d69739580d1333b8ae7e8.jpg' },
        ];
        list.forEach(async ({name,coin,src,})=>{
          await db.insertItem({name,coin,src});
        });
        res.end('insert some items');
    });

    app.get('/dev/item/removeAll',async(req,res)=>{
        let db = await Database.getIns();
        await db.removeItemAll();
        res.end('remove item all');
    });

};




