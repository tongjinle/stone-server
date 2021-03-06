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

enum eStatus {
    open, close,
};

export default class Database {
    private connectStr: string;
    private db: mongodb.Db;
    private userCollection: mongodb.Collection<Schema.IUser>;
    private checkRecordCollection: mongodb.Collection<Schema.ICheckRecord>;
    private itemCollection: mongodb.Collection<Schema.IItem>;
    private shopRecordCollection: mongodb.Collection<Schema.IShopRecord>;
    private roomCollection: mongodb.Collection<Schema.IRoom>;
    private status: eStatus;
    // 返回一个连接实例
    private static ins: Database;
    static async getIns(): Promise<Database> {
        if (!Database.ins) {
            Database.ins = new Database();
        }

        let ins: Database = Database.ins;
        if (ins.status == eStatus.close) {
            await ins.open();

        }

        return Database.ins;
    }

    private constructor() {
        this.connectStr = config.connectStr;
        this.status = eStatus.close;
    }

    async open() {
        this.db = (await mongodb.MongoClient.connect(this.connectStr));
        this.status = eStatus.open;
        // console.log({db:!!this.db});
        let dotaDb = this.db.db('dota');
        this.userCollection = dotaDb.collection('user');
        this.checkRecordCollection = dotaDb.collection('checkRecord');
        this.itemCollection = dotaDb.collection('item');
        this.shopRecordCollection = dotaDb.collection('shopRecord');
        this.roomCollection = dotaDb.collection('room');
    }

    async close() {
        await this.db.close();
        this.status = eStatus.close;
    }


    // 查询

    // 插入一个用户
    // 第一次绑定id
    async insertUser({ openId, dotaId, reward, bindTime, }: { openId: string, dotaId: string, reward: number, bindTime: number, }): Promise<{ flag: boolean, }> {
        let flag: boolean = true;
        await this.userCollection.insertOne({ openId, dotaId, coin: reward, bindTime, });
        return { flag, };
    }


    // 修改一个用户
    // 再次绑定(即修改dotaId)
    async updateUser({ openId, dotaId }: { openId: string, dotaId: string, }): Promise<{ flag: boolean, }> {
        let flag: boolean = true;
        await this.userCollection.updateOne({ openId, }, { $set: { dotaId, } });
        return { flag, };
    }

    // 修改一个用户的coin
    // coinDelta coin增量
    async updateUserCoin({ openId, coinDelta, coinAbs }: { openId: string, coinDelta?: number, coinAbs?: number, }): Promise<{ flag: boolean, }> {
        let flag: boolean = true;
        if (coinAbs !== undefined) {
            let { modifiedCount } = await this.userCollection.updateOne({ openId, }, { $set: { coin: coinAbs, } });
            flag = modifiedCount == 1;
        } else if (coinDelta != undefined) {
            let { modifiedCount } = await this.userCollection.updateOne({ openId, }, { $inc: { coin: coinDelta, } });
            flag = modifiedCount == 1;
        } else {
            flag = false;
        }
        return { flag, };
    }

    // 设置一个用户的当前房间id
    async updateUserCurrRoomId({ openId, roomId, }: { openId: string, roomId: string, }): Promise<{ flag: boolean, }> {
        let flag: boolean = true;
        await this.userCollection.updateOne({ openId, }, { $set: { currRoomId: roomId, } });
        return { flag, };
    }

    // 删除一个用户的当前房间id
    async removeUserCurrRoomId({ openId, }: { openId: string, }): Promise<{ flag: boolean, }> {
        let flag: boolean = true;
        await this.userCollection.updateOne({ openId, }, { $unset: { currRoomId: 1, } });
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
        let { deletedCount, } = await this.itemCollection.deleteOne({ name, });
        flag = deletedCount == 1;
        return { flag, };
    }

    // 修改一条dota2虚拟道具记录
    async updateItem({ name, coin, src, newName, }: { name: string, newName?: string, coin?: number, src?: string }): Promise<{ flag: boolean, }> {
        let flag: boolean = true;
        let modi: any = {};
        if (newName !== undefined) {
            modi.name = newName;
        }
        if (coin != undefined) {
            modi.coin = coin;
        }
        if (src != undefined) {
            modi.src = src;
        }
        let { modifiedCount, } = await this.itemCollection.updateOne({ name, }, { $set: modi });
        flag = modifiedCount == 1;
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
        console.log({ filter });
        let query = await this.itemCollection.find(filter, { _id: 0 });
        totalCount = await query.count();
        list = await query.sort({ coin: 1, }).skip(pageSize * pageIndex).limit(pageSize).toArray();
        return { flag, list, totalCount };
    }


    async queryShopRecord({ id }: { id: string, }): Promise<{ flag: boolean, shop?: Schema.IShopRecord }> {
        let flag = true;
        let shop = await this.shopRecordCollection.findOne({ _id: new mongodb.ObjectId(id), });
        flag = !!shop;
        return { flag, shop };
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
    async insertRoom({ openId, dotaId, count, coin, beginTime, endTime, commentDuration, }: { openId: string, dotaId: string, count: number, coin: number, beginTime: number, endTime: number, commentDuration: [number, number], }): Promise<{ flag: boolean, roomId?: string, }> {
        let flag: boolean = true;
        let mateList: { openId: string, dotaId: string, }[] = [];
        let commentList: { openId: string, comment: number, }[] = [];
        let room: Schema.IRoom = { count, coin, beginTime, endTime, owner: openId, ownerDotaId: dotaId, mateList, commentDuration, commentList, };
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

        let { upsertedCount, } = await this.roomCollection.updateOne({ _id: new mongodb.ObjectId(roomId), }, { $push: { commentList: { openId, comment, }, } });

        flag = upsertedCount == 1;
        return { flag, };
    }

    // 加入黑店
    async applyRoom({ roomId, openId, dotaId, }: { roomId: string, openId: string, dotaId: string, }): Promise<{ flag: boolean, }> {
        let flag: boolean = true;
        let { upsertedCount, } = await this.roomCollection.updateOne({ _id: new mongodb.ObjectId(roomId) }, { $push: { mateList: { openId, dotaId, }, } });
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

    async updateRoomUser({ roomId, openId, dotaId, }: { roomId: string, openId: string, dotaId: string, }): Promise<{ flag: boolean, }> {
        let flag: boolean = true;
        let { room, } = await this.queryRoom({ roomId, });
        if (!!room) {
            if (room.owner == openId) {
                await this.roomCollection.updateOne({ _id: new mongodb.ObjectId(roomId), }, { $set: { ownerDotaId: dotaId, }, });
            } else if (room.mateList.some(n => n.openId == openId)) {
                await this.roomCollection.updateOne({ $and: [{ _id: new mongodb.ObjectId(roomId) }, { "mateList.openId": openId, },] }, { $set: { "mateList.$.dotaId": dotaId, }, });
            }
        }
        return { flag, };
    }

    // 查询没有mark的黑店
    async clearRoomList({ count, deadline, }: { count: number, deadline: number, }): Promise<void> {
        let list = await this.roomCollection.find({ marked: undefined, }).sort({ beginTime: 1 }).limit(count).toArray();
        list.forEach(ro => {
            if (ro.endTime + config.commentEndTime < deadline) {
                this.roomCollection.updateOne({ _id: new mongodb.ObjectId(ro._id) }, { $set: { marked: 1, } });

                let openIdList = [ro.owner, ...ro.mateList.map(ma => ma.openId),];
                openIdList.forEach(async (openId) => {
                    let { user, } = await this.queryUser({ openId, });
                    if (user && user.currRoomId == ro._id) {
                        // 清理掉用户的当前黑店
                        this.removeUserCurrRoomId({ openId, });

                        // 自动评价,缺省评价为1(好评)
                        if (!ro.commentList.some(co => co.openId == openId)) {
                            await this.commentRoom({ roomId: ro._id, openId, comment: 1, });
                        }
                    }
                });
            }
        });
    }

    // 修改黑店的创建时间
    // 同时修改申请时间的区间,评论时间的区间
    // 仅仅为了测试而用
    async updateRoomTime({ roomId, createTime, }: { roomId: string, createTime: number, }): Promise<void> {
        let beginTime: number = createTime;
        let endTime: number = config.roomEndTime + createTime;
        let commentDuration = [endTime + config.commentBeginTime, endTime + config.commentEndTime,];
        let update = { beginTime, endTime, commentDuration, };
        await this.roomCollection.updateOne({ _id: new mongodb.ObjectId(roomId), }, { $set: update }, );
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

    async removeRoomAll() {
        await this.roomCollection.remove({});
        return;
    }

}