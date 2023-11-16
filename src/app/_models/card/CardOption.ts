export class CardOption{
    id:string;
    code:string;
    name:string;
    description:string;
    displayPriority:number;
    statusCode:string;
    statusName:string;
}
export class CardProduct{
    cardOption: CardOption;
    cardTypeCode:string;
    cardTypeName:string;
    cardRateCode: string;
    code: string;
    name: string;
}
export class CardRequest{
    cardTypeCode:string;
}
export class CardProductRequest{
    cardTypeName:string;
    constructor(cardTypeName: string) {
        this.cardTypeName = cardTypeName
      }
}
