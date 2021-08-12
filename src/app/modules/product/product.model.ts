export class ProductModel {
  dataSource: any;
  constructor(
    public id: string = "",
    public code: string = "",
    public name: string = "",
    public status: string = "",
    public price: number = 0,
    public entryPrice: number = 0,
    public priceAreaOne: number = 0,
    public priceAreaTwo: number = 0,
    public categoryId: number = 0,
    public description: string = '',
    public qrCode: string = '',
    public unit: string = '',
    public valueAddedTax: number = 0,
    public vat: number = 0
  ) { };
}
