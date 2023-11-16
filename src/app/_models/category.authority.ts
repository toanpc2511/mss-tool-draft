// danh muc pham vi quy quyen
// danh muc nganh nghe
// danh muc loai giay to tuy than
// danh muc gioi tinh
// danh muc quoc gia
export class MenuGeneralModel {
    code: string;
    displayPriority: string;
    id: string;
    name: string;
    statusCode: string;
    statusName: string;
    industryGroupCode: string;
    industryGroupName: string;
    constructor(item: any) {
        this.id = item.id;
        this.code = item.code;
        this.displayPriority = item.displayPriority;
        this.name = item.name;
        this.statusCode = item.statusCode;
        this.statusName = item.statusName;
        this.industryGroupCode = item.industryGroupCode;
        this.industryGroupName = item.industryGroupName;
    }
}
// danh muc quan huyen
// danh muc phuong xa
export class DistrictAndWardModel {
    cityCode: string;
    cityName: string;
    code: string;
    displayPriority: string;
    districtCode: string;
    districtName: string;
    id: string;
    name: string;
    statusCode: string;
    statusName: string;
    constructor(item: any) {
        this.id = item.id;
        this.code = item.code;
        this.displayPriority = item.displayPriority;
        this.name = item.name;
        this.statusCode = item.statusCode;
        this.statusName = item.statusName;
        this.cityCode = item.cityCode;
        this.cityName = item.cityName;
        this.districtCode = item.districtCode;
        this.districtName = item.districtName;
    }
}

