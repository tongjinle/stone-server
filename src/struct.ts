// 黑店战绩
export interface IRoomScore {

}

// 黑店信息
export interface IRoomInfo {
    // 黑店编号
    roomId: number,
    // 黑店价格
    coin: number,
    // 黑店创建了之后,5min(默认)之内如果没有人参加就不能参加了
    // 创建黑店的时间戳
    begin: number,
    // 黑店加入的结束时间,(意思过了这个时间点则不能再申请加入)
    end: number,
    // 可以评价的时间
    // 备注下,"元组"数据类型,下面的表示数组就只有2个元素,且都是number类型
    commentDuration: [number, number],
    // 成员以及成员的评价
    commentList?: {
        openId: number,
        // 评价
        // 1 好评
        // 0 普通(默认评价)
        // -1 差评
        comment: number,
    }[],
    // 战绩统计,统计方式待定
    score?: IRoomScore,
}

// 黑店总结
export interface IRoomRusume {
    // 黑店的开始时间戳
    begin: number,
    // 好评率
    comment: {
        good: number,
        normal: number,
        bad: number,
    },
    // 黑店为店主带来的虚拟币总收入
    income: number,
    score: IRoomScore,
}