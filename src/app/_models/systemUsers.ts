import {ResultResponse} from './response';

export class SearchUser {
  username: string;
  titleCode: string;//chuc danh
  branchId: string;//chi nhanh
  phone: string;
  employeeId: string;
  fullName: string;
  page: number;
  size: number;
  titleId: any;
  roleId: any;
  userCore: string;

  constructor() {
  }
}

export class SystemUsers {
  id: any;
  userName: string;//ten dang nhap
  fullName: string;//ten day du
  email: string;
  phone: string;
  userAd: string;//ten dang nhap AD
  employeeId: string;//ma nhan vien
  userCore: string;//ma user code
  validFrom: Date;//ngay hieu lục
  validTo: Date;//Ngày hết hạn
  department: string; //phong ban
  titleIds: string;//danh sach id chuc danh
  branchIds: string;//danh sach id chi nhanh
  statusCode: string;// trang thai
  branches: any;
}

export class SystemUsers1 {
  id?: any;
  userName?: string;//ten dang nhap
  fullName?: string;//ten day du
  email?: string;
  phone?: string;
  userAd?: string;//ten dang nhap AD
  employeeId?: string;//ma nhan vien
  userCore?: string;//ma user code
  validFrom?: Date;//ngay hieu lục
  validTo?: Date;//Ngày hết hạn
  department?: string; //phong ban
  titleIds?: string;//danh sach id chuc danh
  branchIds?: string;//danh sach id chi nhanh
  statusCode?: string;// trang thai
  branches?: any;
  roles?: string;
}
