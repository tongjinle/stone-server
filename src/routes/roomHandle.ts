import * as express from 'express';
import * as Protocol from '../protocol';
import config from '../config';
import * as Struct from '../struct';
import Database from '../db';

enum eCreateRoomCode {
    // 参数不合法
    invalidParams,
};

enum eQueryRoomCode {
    notExists,
};

enum eApplyRoomCode {
    notEnoughCoin,
    notExists,
    expires,
    enoughMate,
};

enum eCommentRoomCode {
    notExists,
    noRight,
    expries,
}

enum eComment {
    good = 1,
    normal = 0,
    bad = -1,
};



function formatCommentList(commentList: { openId: string, comment: number, }[]): Struct.IComment {
    return commentList.reduce((prev, n, i) => {
        if (n.comment == eComment.good) {
            prev.good++;
        } else if (n.comment == eComment.bad) {
            prev.bad++;
        } else if (n.comment == eComment.normal) {
            prev.normal++;
        }
        return prev;
    }, { good: 0, normal: 0, bad: 0, });
}

export default function handle(app: express.Express) {
    // 创建黑店房间
    app.post('/auth/room/create', async (req, res) => {
        let resData: Protocol.IResCreateRoom;
        let { count, coin, } = req.body as Protocol.IReqCreateRoom;
        let code: number = undefined;

        if (!(/^\d+$/.test(count + '') && /^\d+$/.test(coin + ''))){
            code = eCreateRoomCode.invalidParams;

        }
        let db = await Database.getIns();

        let beginTime: number = Date.now(),
            endTime: number = beginTime + config.roomEndTime,
            commentDuration: [number, number] = [beginTime + config.commentBeginTime, beginTime + config.commentEndTime];

        let openId: string = req.headers['openId'] as string;
        let { user, } = await db.queryUser({ openId, });
        let dotaId = user.dotaId;
        let { roomId, } = await db.insertRoom({ openId, dotaId, count, coin, beginTime, endTime, commentDuration, });
        await db.updateUserCurrRoomId({ openId, roomId, });
        resData = { code, id: roomId, };
        res.json(resData);
    });

    // 通过黑店编号获取黑店信息
    app.get('/auth/room/info', async (req, res) => {
        let resData: Protocol.IResRoomInfo;
        let { roomId, } = req.query as Protocol.IReqRoomInfo;
        let code: number = undefined;
        let info: Struct.IRoomInfo;

        let db = await Database.getIns();
        let { flag, room, } = await db.queryRoom({ roomId, });

        if (!room) {
            code = eQueryRoomCode.notExists;
            resData = { code, };
            res.json(resData);
            return;
        }

        let comment: Struct.IComment = formatCommentList(room.commentList);
        let owner = room.owner
        info = {
            roomId,
            count: room.count,
            coin: room.coin,
            beginTime: room.beginTime,
            endTime: room.endTime,
            commentDuration: room.commentDuration,
            comment,
            score: room.score,
            owner: room.ownerDotaId,
            mateList: room.mateList.map(n => n.dotaId),
        };

        resData = { code, info, };
        res.json(resData);
    });

    // 请求加入黑店
    app.post('/auth/room/apply', async (req, res) => {
        let resData: Protocol.IResApplyRoom;
        let { roomId, } = req.body as Protocol.IReqApplyRoom;
        let code: number = undefined;

        let db = await Database.getIns();
        let { room, } = await db.queryRoom({ roomId, });

        // 黑店不存在
        if (!room) {
            res.json({ code: eApplyRoomCode.notExists, msg: '黑店不存在', });
            return;
        }

        // coin不够
        let openId: string = req.headers['openId'] as string;
        let { user, } = await db.queryUser({ openId, });
        if (user.coin < room.coin) {
            res.json({ code: eApplyRoomCode.notEnoughCoin, msg: 'coin不足', });
            return;
        }

        // 黑店已经超过了申请时间
        {
            let now = Date.now();
            if (room.endTime < now) {
                console.log('黑店已经超过了申请时间', room.endTime, now);
                res.json({ code: eApplyRoomCode.expires, msg: '黑店已经超过了申请时间', });
                return;
            }

        }

        // 黑店人数到达最大上限
        {
            if (room.mateList.length >= room.count) {
                res.json({ code: eApplyRoomCode.enoughMate, });
                return;
            }
        }

        let dotaId: string = user.dotaId;
        await db.applyRoom({ roomId, openId, dotaId, });
        await db.updateUserCurrRoomId({ openId, roomId, });
        resData = { code, };
        res.json(resData);
    });

    // 评价黑店
    app.post('/auth/room/comment', async (req, res) => {
        let { roomId, comment, } = req.body as Protocol.IReqCommentRoom;
        let code: number = undefined;
        let resData: Protocol.IResCommentRoom;
        let openId: string = req.headers['openId'] as string;

        let db = await Database.getIns();
        let { room, } = await db.queryRoom({ roomId, });

        // 黑店不存在
        if (!room) {
            res.json({ code: eCommentRoomCode.notExists, msg: '黑店不存在', });
            return;
        }

        // 不是用户的黑店
        {
            let { user, } = await db.queryUser({ openId, });
            if (user.currRoomId != roomId || room.owner == openId) {
                res.json({ code: eCommentRoomCode.noRight, msg: '非该黑店新人', });
                return;
            }


        }

        // 评价时间不匹配
        {
            let now = Date.now();
            if (now < room.commentDuration[0] || now > room.commentDuration[1]) {
                res.json({ code: eCommentRoomCode.expries, msg: '不在可以评价的时间内' });
                return;
            }
        }

        await db.commentRoom({ roomId, openId, comment, });

        resData = { code, };
        res.json(resData);
    });


    // 查询开黑历史
    app.get('/auth/room/history', async (req, res) => {
        let { pageIndex, pageSize, } = req.body as Protocol.IReqRoomHistory;
        let code: number = undefined;
        let list: Struct.IRoomRusume[] = [];

        //
        {
            let h = 60 * 60 * 1000;
            let begin: number = Date.now() - 24 * h;
            list.push({
                begin,
                comment: {
                    good: 3,
                    normal: 1,
                    bad: 1,
                },
                income: 500,
                score: {}
            })
        }
        let data: Protocol.IResRoomHistory = { code, list };
        res.json(data);
    });
};