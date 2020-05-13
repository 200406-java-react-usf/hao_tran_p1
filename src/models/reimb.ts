export class Reimb {

    reimb_id: number;
    amount: number;
    submitted: string;
    resolved: string;
    description: string;
    reciept: any;
    author: string;
    resolver: string;
    reimb_status: string;
    reimb_type: string;

    constructor(
        id: number,
        am: number,
        sub: string,
        res: string,
        des: string,
        rec: any,
        auth: string,
        resv: string,
        rei_sta: string,
        rei_typ: string
    ) {
        this.reimb_id = id;
        this.amount = am;
        this.submitted = sub;
        this.resolved = res;
        this.description = des;
        this.reciept = rec;
        this.author = auth;
        this.resolver = resv;
        this.reimb_status = rei_sta;
        this.reimb_type = rei_typ;
    }

}