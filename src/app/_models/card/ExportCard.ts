export class ExportCard {
    createdDateFrom: string;
    createdDateTo: string;
    page: number;
    size: number;
    brand: string ;
    createdByUserName: string;
    branchCode: string;
    productCodes: Array<string>;
    fileId: string;
    cardType: string;

}

export class ExportCardOut{
    id: string;
    fileId: string;
    customerCode: string;
    fullName: string;
    cardProductCode: string;
    cardProductName: string;
    cardHolderName: string;
    branchCode: string;
    branchName: string;
    createdByUserName: string;
    createdDate: number;
    issueDate: string;
    cardCategory: string;
}
