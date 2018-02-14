import Database from '../../db';
import * as axiosNs from 'axios';
import config from '../../config';
import * as qs from 'querystring';
import * as Protocol from '../../protocol';
import { ITestFunc, IResult } from '../ItestFunc';
import * as utils from '../utils';


let { apiPrefix, } = config;

async function createRoom(axi: axiosNs.AxiosInstance, count: number, coin: number, ): Promise<Protocol.IResCreateRoom> {
    let { data, } = await axi.post(apiPrefix + 'auth/room/create', { count, coin, } as Protocol.IReqCreateRoom) as { data: Protocol.IResCreateRoom };
    return data;
};

async function applyRoom(axi: axiosNs.AxiosInstance, roomId: string, ): Promise<Protocol.IResApplyRoom> {
    let { data, } = await axi.post(apiPrefix + 'auth/room/apply', { roomId, } as Protocol.IReqApplyRoom) as { data: Protocol.IResApplyRoom, };
    return data;
}

async function commentRoom(axi: axiosNs.AxiosInstance, roomId: string, comment: number): Promise<Protocol.IResCommentRoom> {
    let { data, } = await axi.post(apiPrefix + 'auth/room/comment', { roomId, comment, } as Protocol.IReqCommentRoom) as { data: Protocol.IResCommentRoom };
    return data;
}

async function updateRoomTime(db: Database, roomId: string, createTime: number, ): Promise<void> {
    await db.updateRoomTime({ roomId, createTime, });
}

async function logRoom(db: Database, roomId: string): Promise<void> {
    let { room, } = await db.queryRoom({ roomId, });
    console.log(JSON.stringify(room, undefined, 4));
}

let fn: ITestFunc = async function({ db, axi, }) {
    let ret: IResult[] = [];

    // 建立黑店
    // !成功,用户存在当前黑店
    // 再次建立黑店
    // !失败,因为用户有当前黑店
    {
        await db.removeUserAll();
        await db.removeRoomAll();

        let count = 3;
        let coin = 10;
        let dotaId = '1328192478';

        await utils.createUser(axi, dotaId);

        {
            let data = await createRoom(axi, count, coin);
            ret.push({ title: '建立黑店', expect: undefined, calc: data.code, });
        }


        {
            let data = await createRoom(axi, count, coin);
            ret.push({ title: '再次建立黑店', expect: 200, calc: data.code, });
        }
    }

    // 有黑店的状态下,不能参加别的黑店
    // puman建立黑店,记作ra
    // puman参加黑店ra
    // !失败,自己不能参加自己的黑店
    // dino参加黑店ra
    // !成功
    // dino已经参加了他人的黑店,自己再建立黑店
    // !失败
    // tong建立黑店,记作rb
    // tong参加黑店ra
    // !失败,自己已经有黑店了
    // dino参加黑店rb
    // !失败,自己已经有黑店了
    {
        await db.removeUserAll();
        await db.removeRoomAll();

        let puman = await utils.getAxios('puman');
        let dino = await utils.getAxios('dino');
        let tong = await utils.getAxios('tong');

        await utils.createUser(puman, '123456');
        await utils.createUser(dino, '1234567');
        await utils.createUser(tong, '12345678');

        let { id: roomId, } = await createRoom(puman, 10, 1);
        {
            let data = await applyRoom(puman, roomId);
            ret.push({ title: 'puman参加自己创建的黑店-失败', expect: 200, calc: data.code });
        }

        {
            let data = await applyRoom(dino, roomId);
            ret.push({ title: 'dino参加puman的黑店-成功', expect: undefined, calc: data.code, });
        }

        {
            let data = await createRoom(dino, 2, 10);
            ret.push({ title: 'dino已经参加了他人的黑店,自己再建立黑店', expect: 200, calc: data.code, });
        }

        let { id: otherRoomId, } = await createRoom(tong, 10, 1);
        {
            let data = await applyRoom(tong, roomId);
            ret.push({ title: 'tong建立了黑店,又参加puman的黑店-失败', expect: 200, calc: data.code });
        }

        {
            let data = await applyRoom(tong, otherRoomId);
            ret.push({ title: 'dino已经参加了puman的黑店,又参加tong的黑店-失败', expect: 200, calc: data.code });
        }
    }

    // 黑店coin不足,不能参加
    {
        await db.removeUserAll();
        await db.removeRoomAll();

        let hugeCoin = 10 * 1000;
        await utils.createUser(axi, '654321');
        let { id: roomId, } = await createRoom(axi, 3, hugeCoin);

        let puman = await utils.getAxios('puman');
        await utils.createUser(puman, '123456');

        let data = await applyRoom(puman, roomId);
        ret.push({ title: '黑店coin不足,不能参加', expect: 0, calc: data.code });

    }

    // 黑店超过时间了,不能参加
    {
        await db.removeUserAll();
        await db.removeRoomAll();

        await utils.createUser(axi, '654321');
        let { id: roomId, } = await createRoom(axi, 3, 10);

        let createTime: number = new Date(1900, 1, 1).getTime();
        await updateRoomTime(db, roomId, createTime);


        let puman = await utils.getAxios('puman');
        await utils.createUser(puman, '123456');

        let data = await applyRoom(puman, roomId);
        ret.push({ title: '黑店超过时间了,不能参加', expect: 2, calc: data.code, });

        // await logRoom(db, roomId);

    }

    // 黑店超过最大人员,不能参加
    {
        await db.removeUserAll();
        await db.removeRoomAll();

        await utils.createUser(axi, '654321');
        let { id: roomId, } = await createRoom(axi, 2, 10);

        let puman = await utils.getAxios('puman');
        await utils.createUser(puman, '123456');

        let puman1 = await utils.getAxios('puman1');
        await utils.createUser(puman1, '1234567');

        let puman2 = await utils.getAxios('puman2');
        await utils.createUser(puman2, '12345678');

        await applyRoom(puman, roomId);
        await applyRoom(puman1, roomId);
        let data = await applyRoom(puman2, roomId);
        ret.push({ title: '黑店超过最大人员,不能参加', expect: 3, calc: data.code });

    }

    // 正常评价
    {
        await db.removeUserAll();
        await db.removeRoomAll();

        await utils.createUser(axi, '654321');
        let { id: roomId, } = await createRoom(axi, 2, 10);

        let puman = await utils.getAxios('puman');
        await utils.createUser(puman, '123456');

        await applyRoom(puman, roomId);

        let now = Date.now();
        let createTime: number = now - config.roomEndTime - config.commentBeginTime - 5 * 60 * 1000;
        await updateRoomTime(db, roomId, createTime);

        let comment: number = 1;
        let data = await commentRoom(puman, roomId, comment);
        ret.push({ title: '正常评价', expect: undefined, calc: data.code });

    }

    // 不是黑店人员,不能评价
    {
        await db.removeUserAll();
        await db.removeRoomAll();

        await utils.createUser(axi, '654321');
        let { id: roomId, } = await createRoom(axi, 2, 10);

        let puman = await utils.getAxios('puman');
        await utils.createUser(puman, '123456');

        let now = Date.now();
        let createTime: number = now - config.roomEndTime - config.commentBeginTime - 5 * 60 * 1000;
        await updateRoomTime(db, roomId, createTime);

        let comment: number = 1;
        let data = await commentRoom(puman, roomId, comment);
        ret.push({ title: '不是黑店人员,不能评价', expect: 1, calc: data.code });
    }

    // 黑店超过评价时间了,不能评价
    // 黑店超过评价时间了,会自动评价
    // 黑店超过评价时间了,参与者的当前黑店的状态自动解除
    {
        await db.removeUserAll();
        await db.removeRoomAll();

        await utils.createUser(axi, '654321');
        let { id: roomId, } = await createRoom(axi, 2, 10);

        let puman = await utils.getAxios('puman');
        await utils.createUser(puman, '123456');

        await applyRoom(puman, roomId);

        let createTime: number = new Date(1900, 1, 1).getTime();
        await updateRoomTime(db, roomId, createTime);

        let comment: number = 1;
        let data = await commentRoom(puman, roomId, comment);
        ret.push({ title: '黑店超过评价时间了,不能评价', expect: 2, calc: data.code });

        await utils.delay(2 * config.clearRoom.interval);
        let { room, } = await db.queryRoom({ roomId, });
        let openId = await utils.getOpenId(puman);
        let flag: boolean = room.commentList.some(n => n.openId == openId && n.comment == 1);
        ret.push({ title: '黑店超过评价时间了,会自动评价', expect: true, calc: flag });

        let { user, } = await db.queryUser({ openId, });
        ret.push({ title: '黑店超过评价时间了,参与者的当前黑店的状态自动解除', expect: undefined, calc: user.currRoomId, });

    }

    {
        // puman参加了一个黑店
        // 然后修改了自己的dotaId
        await db.removeUserAll();
        await db.removeRoomAll();

        await utils.createUser(axi, '654321');
        let { id: roomId, } = await createRoom(axi, 2, 10);

        let puman = await utils.getAxios('123456');
        await utils.createUser(puman, '123');

        await applyRoom(puman, roomId);
        let { room: lastRoom, } = await db.queryRoom({ roomId, });

        await puman.post(apiPrefix + 'bind', { dotaId: '321', });
        let { room: currRoom, } = await db.queryRoom({ roomId, });

        ret.push({ title: '参加了黑店,重新绑定dotaId', expect: [true, true,], calc: [lastRoom.mateList.some(n => n.dotaId === '123'), currRoom.mateList.some(n => n.dotaId === '321')], });


    }
    {
        // puman创建了一个黑店
        // 然后修改了自己的dotaId
        await db.removeUserAll();
        await db.removeRoomAll();

        let puman = await utils.getAxios('123456');
        await utils.createUser(puman, '123');


        let { id: roomId, } = await createRoom(puman, 2, 10);


        let { room: lastRoom, } = await db.queryRoom({ roomId, });

        await puman.post(apiPrefix + 'bind', { dotaId: '321', });
        let { room: currRoom, } = await db.queryRoom({ roomId, });

        ret.push({ title: '参加了黑店,重新绑定dotaId', expect: ['123', '321',], calc: [lastRoom.ownerDotaId, currRoom.ownerDotaId,]});


    }

    {
        await db.removeUserAll();
        await db.removeRoomAll();

        await utils.createUser(axi, '654321');
        let { id: roomId, } = await createRoom(axi, 3, 10);

        let puman = await utils.getAxios('puman');
        await utils.createUser(puman, '123456');

        let puman1 = await utils.getAxios('puman1');
        await utils.createUser(puman1, '1234561');

        let puman2 = await utils.getAxios('puman2');
        await utils.createUser(puman2, '1234562');

        await applyRoom(puman, roomId);
        await applyRoom(puman1, roomId);
        await applyRoom(puman2, roomId);

        let now: number = Date.now();
        let createTime: number = now - config.roomEndTime - config.commentBeginTime - 5 * 60 * 1000;
        await updateRoomTime(db, roomId, createTime);

        await commentRoom(puman, roomId, 1);
        await commentRoom(puman1, roomId, 1);
        await commentRoom(puman2, roomId, -1);


        {
            let { data, } = await axi.get(apiPrefix + 'auth/room/info' + '?' + qs.stringify({ roomId, })) as { data: Protocol.IResRoomInfo, };
            let { good, normal, bad, } = data.info.comment;
            ret.push({ title: '黑店信息统计', expect: [2, 0, 1], calc: [good, normal, bad,] });
        }
    }



    return ret;
}




export default fn;