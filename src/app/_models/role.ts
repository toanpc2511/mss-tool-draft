import { ResultResponse } from './response'

export class Role {
    id:any
    code:string
    name:string
    description:string
    statusCode:string
    titleIds:any[]
    titleCode:string
    onFocus: boolean;
    roleTemplateIds: string[];
}
export class Permission{
    static SYSTEM_MANAGEMENT = 'SYSTEM_MANAGEMENT'
}
