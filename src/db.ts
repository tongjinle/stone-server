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
    private itemCollection: mongodb.Collection<Schema.IItem>;
    private shopRecordCollection: mongodb.Collection<Schema.IShopRecord>;
    private roomCollection: mongodb.Collection<Schema.IRoom>;

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
        this.checkRecordCollection = this.db.collection('checkRecord');
        this.itemCollection = this.db.collection('item');
        this.shopRecordCollection = this.db.collection('shopRecord');
        this.roomCollection = this.db.collection('room');
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

    // 修改一个用户的coin
    // coinDelta coin增量
    async updateUserCoin({ openId, coinDelta, }: { openId: string, coinDelta: number, }): Promise<{ flag: boolean, }> {
        let flag: boolean = true;
        await this.userCollection.updateOne({ openId, }, { $inc: { coin: coinDelta, } });
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
    async queryUser({ openId, }: { openId: string, }): Promise<{ flag: boolean, user?: Schema.IUser, }> {
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
    async insertItem({ name, coin, src, }: { name: string, coin: number, src: string, }): Promise<{ flag: boolean, }> {
        let flag: boolean = true;
        await this.itemCollection.insert({ name, coin, src, });
        return { flag, };
    }

    // 删除一条dota2虚拟道具记录
    async removeItem({ name, }: { name: string, }): Promise<{ flag: boolean, }> {
        let flag: boolean = true;
        await this.itemCollection.remove({ name, });
        return { flag, };
    }

    // 修改一条dota2虚拟道具记录
    async updateItem({ name, coin, }: { name: string, coin: number, }): Promise<{ flag: boolean, }> {
        let flag: boolean = true;
        await this.itemCollection.updateOne({ name, }, { $set: { coin, } });
        return { flag, };
    }

    // 查找虚拟道具
    async queryItem({ name, }: { name: string, }): Promise<{ flag: boolean, item?: Schema.IItem }> {
        let flag: boolean = true;
        let item = await this.itemCollection.findOne({ name, });
        flag = !!item;
        return { flag, item, };
    }

    // 查询dota2虚拟道具
    // 模糊查询name
    // 价格区间
    // 页码
    async queryItemList({ name, priceInterval, pageIndex, pageSize, }: { name: string, priceInterval: [number, number], pageIndex: number, pageSize: number, }): Promise<{ flag: boolean, list?: Schema.IItem[], totalCount?: number, }> {
        let flag: boolean = true;
        let list: Schema.IItem[];
        let totalCount: number;
        let filter: any = {};
        if (name) {
            filter.name = { $regex: new RegExp(name, 'i') };
        }
        if (priceInterval) {
            filter.coin = { $gte: priceInterval[0], $lte: priceInterval[1] };
        }
        let query = await this.itemCollection.find(filter);
        totalCount = await query.count();
        list = await query.skip(pageSize * pageIndex).limit(pageSize).toArray();
        return { flag, list, totalCount };
    }




    // 新增订单
    // 兑换dota2虚拟道具
    async insertShopRecord({ openId, itemName, buyTime, }: { openId: string, itemName: string, buyTime: number, }): Promise<{ flag: boolean, shopId?: string, }> {
        let flag: boolean = true;

        let status: number = 0;
        let dealTime: number = undefined;
        let note: { role: number, text: string, }[] = [];
        let record: Schema.IShopRecord = { openId, itemName, buyTime, dealTime, status, note, };
        let { insertedCount, insertedId, } = await this.shopRecordCollection.insertOne(record);

        flag = insertedCount == 1;
        let shopId: string = flag ? insertedId.toHexString() : undefined;
        return { flag, shopId, };
    }

    // 处理订单
    // status==1,成功处理dota2虚拟道具
    // status==2,取消订单,退换coin给玩家
    async updateShopRecord({ shopId, dealTime, status, }: { shopId: string, dealTime: number, status: number, }): Promise<{ flag: boolean, }> {
        let flag: boolean = true;
        let { upsertedCount, } = await this.shopRecordCollection.updateOne({ shopId, status: 0, }, { $set: { dealTime, status, } });

        flag = upsertedCount == 1;
        return { flag, };

    }


    // 追加note到订单中
    async updateShopRecordNote({ shopId, note, }: { shopId: string, note: { openId: string, text: string, } }): Promise<{ flag: boolean, }> {
        let flag: boolean = true;
        return { flag, };


    }


    // 创建黑店
    async insertRoom({ openId, count, coin, beginTime, endTime, commentDuration, }: { openId: string, count: number, coin: number, beginTime: number, endTime: number, commentDuration: [number, number], }): Promise<{ flag: boolean, roomId?: string, }> {
        let flag: boolean = true;
        let mateList: string[] = [];
        let commentList: { openId: string, comment: number, }[] = [];
        let room: Schema.IRoom = { count, coin, beginTime, endTime, owner: openId, mateList, commentDuration, commentList, };
        let { insertedId, insertedCount, } = await this.roomCollection.insertOne(room);

        flag = insertedCount == 1;
        let roomId: string = flag ? insertedId.toHexString() : undefined;
        return { flag, roomId, };
    }

    // 更新战绩
    async updateRoomScore({ roomId, score, }: { roomId: string, score: Schema.IScore }): Promise<{ flag: boolean, }> {
        let flag: boolean = true;
        let { upsertedCount, } = await this.roomCollection.updateOne({ roomId, }, { $set: { score, } });

        flag = upsertedCount == 1;
        return { flag, };
    }

    // 评价黑店
    async commentRoom({ roomId, openId, comment, }: { roomId: string, openId: string, comment: number, }): Promise<{ flag: boolean, }> {
        let flag: boolean = true;

        let key: string = ({ '1': 'good', '0': 'normal', '-1': 'bad', } as { [index: string]: string })[comment.toString()] as string;
        let inc = { [key]: 1 };

        let { upsertedCount, } = await this.roomCollection.updateOne({ _id: new mongodb.ObjectId(roomId), }, { $push: { openId, comment, } });

        flag = upsertedCount == 1;
        return { flag, };
    }

    // 加入黑店
    async applyRoom({ roomId, openId, }: { roomId: string, openId: string, }): Promise<{ flag: boolean, }> {
        let flag: boolean = true;
        let { upsertedCount, } = await this.roomCollection.updateOne({ _id: new mongodb.ObjectId(roomId) }, { $push: { mateList: openId } });
        flag = upsertedCount == 1;
        return { flag, };

    }

    // 查找黑店
    async queryRoom({ roomId, }: { roomId: string, }): Promise<{ flag: boolean, room?: Schema.IRoom }> {
        let flag: boolean = true;
        let room = await this.roomCollection.findOne({ _id: new mongodb.ObjectId(roomId), });
        return { flag, room, };
    }

    // 查询黑店历史
    async queryRoomList({ openId, pageIndex, pageSize }: { openId: string, pageIndex: number, pageSize: number, }): Promise<{ flag: boolean, list?: Schema.IRoom[], totalCount?: number, }> {
        let flag: boolean = true;
        let query = await this.roomCollection.find({ owner: openId, });
        let totalCount = await query.count();
        let list = await query.skip(pageIndex * pageSize).limit(pageSize).toArray();
        return { flag, totalCount, list, };

    }


    // *** dev ***
    async removeUserAll() {
        await this.userCollection.remove({});
        return;
    }

    async removeCheckRecordAll() {
        await this.checkRecordCollection.remove({});
        return;
    }

    async removeItemAll() {
        await this.itemCollection.remove({});
        return;
    }

}