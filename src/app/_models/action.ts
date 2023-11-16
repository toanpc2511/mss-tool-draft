
export class Action{
    id:string
    name:string
    functionId:string
    statusCode:string
    parentID:string//ma action cha
    url:string
    method:string//get,post,delete
    isMenu:boolean
    description:string
    roles:any
    functionCode:string
    code:string
    checked:boolean
    feUrl: string;
    imagePath: string;
    parentName: string;
    parentId: string;
    tabOrder: number
}
export class ActionRequest{
    functionCode:string
    page:number
    size:number
    parentId: string
    textSearch: string
}
