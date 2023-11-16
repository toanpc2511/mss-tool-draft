export class BranchModels {
    id: string;
    parentId: string; // mã cha
    name: string;
    code: string; // mã
    phone: string;
    fax: string;
    contactName: string; // tên người liên hệ
    email: string;
    address: string; // dia chi chi nhánh
    cityCode: string; // ma tinh thanh
    districtCode: string; // mã quân huyện
    displayPriority: string; // thứ tự hiển thị
    statusCode: string; // trang thái sử dụng
}

export class Branch {
id:	string;

parentId: string;

code: string;

name: string;

phone: string;

fax: string;

contactName: string;

email: string;

address: string;

cityCode: string;

districtCode: string;

displayPriority: number;

statusCode:	string;

statusName:	string;

createdDate: string;

createdBy: string;

modifiedDate: string;

modifiedBy:	string;

}
