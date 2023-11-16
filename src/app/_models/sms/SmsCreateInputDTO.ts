// import { SmsDetailCreateInputDTO } from "./SmsDetailCreateInputDTO"

export class SmsCreateInputDTO {

    smsDetailList: SmsDetailCreateInputDTO[];
    processId: string
}
export class SmsUpdateInputDTO {
    id: string
    smsCreateInputDTO:SmsCreateInputDTO[]
}

export class SmsDetailCreateInputDTO {
    smsAccountList: SmsAccountCreateInputDTO[];
    mobileNo: string;
    accountId: string;
    packageCode: string;
    actionCode: string;
}

export class SmsAccountCreateInputDTO {
    accountId: string;
    isRegister: boolean;
    isFeeCharge: boolean;
    isDefault: boolean;
    isService: boolean;
    isNotify: boolean
}
