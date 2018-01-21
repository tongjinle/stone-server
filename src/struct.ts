// 黑店战绩
export interface IRoomScore {

}


export interface IComment {
    good: number,
    normal: number,
    bad: number,
};

// 黑店信息
export interface IRoomInfo {
    // 黑店编号
    roomId: string,
    // 黑店价格
    coin: number,
    // 新人位置数量
    count: number,
    // 黑店创建了之后,5min(默认)之内如果没有人参加就不能参加了
    // 创建黑店的时间戳
    beginTime: number,
    // 黑店加入的结束时间,(意思过了这个时间点则不能再申请加入)
    endTime: number,
    // 可以评价的时间
    // 备注下,"元组"数据类型,下面的表示数组就只有2个元素,且都是number类型
    commentDuration: [number, number],
    // 好评率
    comment: IComment,
    // 战绩统计,统计方式待定
    score?: IRoomScore,
    // 店主的dotaId
    owner: string,
    // 新人们的dotaId
    mateList: string[],

}

// 黑店总结
export interface IRoomRusume {
    // 黑店的开始时间戳
    begin: number,
    // 好评率
    comment: IComment,
    // 黑店为店主带来的虚拟币总收入
    income: number,
    score: IRoomScore,
}