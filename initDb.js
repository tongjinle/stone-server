/*
    初始化数据库dota
    1 建立用户
    2 建立索引
    ** 因为有dropDatabase操作,所以要小心数据被清洗
*/

const mongodb = require('mongodb');

// let connectStr = 'mongodb://sa:sa@localhost:27017/admin';
let connectStr = 'mongodb://localhost:27017';

let {
    MongoClient,
} = mongodb;

let databaseName = 'dota';

let userInfoList = [
    {
        userName:'zhangjinjie',
        password:'19880101',
    },
    {
        userName:'tongjinle',
        password:'tongjinle19840118',
    }
];

async function init() {
    let ins = await MongoClient.connect(connectStr);

    await clear(ins);
    await createUser(ins);
    await createIndex(ins); 

    await ins.close();

}

async function clear(ins) {
    let curr = ins.db(databaseName);
    await curr.dropDatabase();

    let admin = ins.db('admin');
    admin.collection('system.users').remove({db:databaseName});
}

// 建立用户
async function createUser(ins) {
    let admin = ins.db(databaseName);
    let fn = (userName, password, ) => {

        admin.addUser(userName, password, {
            roles: [{
                role: 'readWrite',
                db: databaseName,
            }]
        });
    }
    userInfoList.forEach(n => {
        fn(n.userName, n.password, );
    });
}

// 建立数据库索引
async function createIndex(ins) {
    let curr = ins.db(databaseName);
    await curr.collection('user').createIndex({
        openId: 1,
    }, {
        unique: true
    });
    await curr.collection('checkRecord').createIndex({
        openId: 1,
    });
    await curr.collection('item').createIndex({
        name: 1
    });
    await curr.collection('shopRecord').createIndex({
        openId: 1,
        itemName: 1,
    })
    await curr.collection('room').createIndex({
        ownerId: 1
    });

}

init();