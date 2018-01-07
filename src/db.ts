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

import * as mongodb from 'mongodb';
import config from './config';
import * as Schema from './schema';

export default class Database {
    private connectStr: string;
    private db: mongodb.Db;
    private userCollection: mongodb.Collection<Schema.IUser>;
    private checkRecordCollection: mongodb.Collection<Schema.ICheckRecord>;

    // 返回一个连接实例
    private static ins: Database;
    static async getIns(): Promise<Database> {
        if (!Database.ins) {
            let ins = Database.ins = new Database();
            await ins.open();
        }
        return Database.ins;
    }

    private constructor() {
        this.connectStr = config.connectStr;
    }

    async open() {
        this.db = (await mongodb.MongoClient.connect(this.connectStr)).db('dota');
        this.userCollection = this.db.collection('user');
        this.checkRecordCollection = this.db.collection('check');
    }

    async close() {
        await this.db.close();
    }


    // 查询

    // 插入一个用户
    // 第一次绑定id
    async insertUser({ openId, dotaId, reward, bindTime, }: { openId: string, dotaId: number, reward: number, bindTime: number, }): Promise<{ flag: boolean, }> {
        let flag: boolean = true;
        await this.userCollection.insertOne({ openId, dotaId, coin: reward, bindTime, });
        return { flag, };
    }


    // 修改一个用户
    // 再次绑定(即修改dotaId)
    async updateUser({ openId, dotaId }: { openId: string, dotaId: number, }): Promise<{ flag: boolean, }> {
        let flag: boolean = true;
        await this.userCollection.updateOne({ openId, }, { $set: { dotaId, } });
        return { flag, };
    }

    // 删除一个用户
    async removeUser({ openId, }: { openId: string, }): Promise<{ flag: boolean, }> {
        let flag: boolean = true;
        await this.userCollection.remove({ openId, });
        return { flag, };
    }

    // 查询一个用户
    // 通过openId查看玩家信息
    async queryUser({ openId, }: { openId: string, }): Promise<{ flag: boolean, user: Schema.IUser, }> {
        let flag: boolean = true;
        let user: Schema.IUser = await this.userCollection.findOne({ openId, });
        return { flag, user, };
    }


    // 插入一条签到记录
    async insertCheckRecord({ openId, reward, checkTime, }: { openId: string, reward: number, checkTime: number, }): Promise<{ flag: boolean, }> {
        let flag: boolean = true;
        await this.checkRecordCollection.insertOne({ openId, reward, checkTime, });
        return { flag, }
    }

    // 删除一条签到记录
    // 条件:某天
    // date是某天0点的时间戳
    async removeCheckRecord({ openId, date, }: { openId: string, date: number, }): Promise<{ flag: boolean, }> {
        let flag: boolean = true;
        let begin: number = date;
        let end: number = date + 24 * 60 * 60 * 1000;
        await this.checkRecordCollection.remove({ openId, checkTime: { $gte: begin, $lt: end } });
        return { flag, };
    }

    // 查看某个时间段的某人签到记录
    async getCheckRecord({ openId, begin, end, }: { openId: string, begin: number, end: number, }): Promise<{ flag: boolean, list?: { checkTime: number, reward: number, }[] }> {
        let flag: boolean = true;
        let checkRecordList = await (await this.checkRecordCollection.find({ checkTime: { $gte: begin, $lt: end }, openId, })).toArray();
        let list: { checkTime: number, reward: number, }[] = checkRecordList.map(n => ({
            checkTime: n.checkTime,
            reward: n.reward,
        }));
        return { flag, list, };
    }

    // 插入一条dota2虚拟道具记录
    // 删除一条dota2虚拟道具记录
    // 修改一条dota2虚拟道具记录
    // 查询dota2虚拟道具
    // 兑换dota2虚拟道具


    // 创建黑店
    // 评价黑店
    // 加入黑店
    // 查询黑店历史


    // *** dev ***
    async removeUserAll() {
        await this.userCollection.remove({});
        return;
    }

    async removeCheckRecordAll(){
        await this.checkRecordCollection.remove({});
        return;
    }

}