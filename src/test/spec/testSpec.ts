import { ITestFunc, IResult, } from '../ItestFunc';

let fn: ITestFunc = async () => {
    let ret: IResult[] = [];
    ret.push({ title: 'test sync', expect: 1, calc: 1 });
    return ret;
};

export default fn;