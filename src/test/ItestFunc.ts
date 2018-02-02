import Database from '../db';
import { AxiosInstance, } from 'axios';


export interface IResult {
    title: string,
    expect:any,
    calc:any,
};

export interface ITestFunc {
    ({ db, axi, }: { db?: Database, axi?: AxiosInstance }): Promise<IResult[]>,
}