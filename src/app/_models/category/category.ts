export class Category {
  id: string;
  parentId: string;
  code: string;
  name: string;
  description: string;
  displayPriority: string;
  statusCode: string;
  statusName: string;
  disable: boolean;
  branchCodeName: string;

  constructor(item: any) {
    this.id = item.id;
    this.parentId = item.parentId;
    this.code = item.code;
    this.name = item.name;
    this.description = item.description;
    this.displayPriority = item.displayPriority;
    this.statusCode = item.statusCode;
    this.statusName = item.statusName;
    this.branchCodeName = item.branchCodeName;
  }
}

export class Phone {
  id: any;
  key: any;
  valueString: any;
  valueNumber: any;
  valueBool: any;
  valueDate: any;
  enable: any;
  checkPhone: any;
}

export class RegisType {
  createdBy: string;
  createdDate: string;
  displayPriority: number;
  id: string;
  modifiedBy: string;
  modifiedDate: string;
  name: string;
  statusCode: string;
  value: string;
  constructor(item: any) {
    this.createdBy = item.createdBy;
    this.createdDate = item.createdDate;
    this.displayPriority = item.displayPriority;
    this.id = item.id;
    this.modifiedBy = item.modifiedBy;
    this.modifiedDate = item.modifiedDate;
    this.name = item.name;
    this.statusCode = item.statusCode;
    this.value = item.value;
  }
}
