export default class AdminMgr {
    private list: string[];

    private constructor() {
        this.list = [];
    }

    private static ins: AdminMgr;
    static getIns() {
        if (!AdminMgr.ins) {
            AdminMgr.ins = new AdminMgr();
        }
        return AdminMgr.ins;
    }


    add(admin: string): void {
        if (this.check(admin)) {
            return;
        }
        this.list.push(admin);
    }

    check(admin: string): boolean {
        return this.list.some(n => n == admin);
    }
}