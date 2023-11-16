import {BehaviorSubject} from 'rxjs';
import {AccountModel} from './account';
import {Card} from './card/Card';
import {AuthenticationService} from '../_services/authentication.service';
import {PermissionConst} from '../_utils/PermissionConst';

export class TreeNode {
  children: BehaviorSubject<TreeNode[]>;
  data: any;

  constructor(public item: string, public treeItem: TreeItem, children?: TreeNode[], public parent?: TreeNode) {
    this.children = new BehaviorSubject(children === undefined ? [] : children);
    this.data = treeItem;
  }

  getRouter(): (string | { processId: string; id: string; })[] | (string | { processId: string; })[] {
    return this.treeItem.getRouter();
  }
}

export class TreeItem {
  parentLink: string;
  routerLink: string;
  processId: string;
  id: string;

  constructor(routerLink: string = '', processId: string = '', id: string = '') {
    this.routerLink = routerLink;
    this.processId = processId;
    this.id = id;
  }

  getRouter(): (string | { processId: string; id: string; })[] | (string | { processId: string; })[] {
    if (this.id !== '' && this.processId !== '') {
      return [this.routerLink, {processId: this.processId, id: this.id}];
    } else if (this.id === '' && this.processId !== '') {
      return [this.routerLink, {processId: this.processId}];
    } else {
      return ['fileProcessed'];
    }
  }
}

export class MenuTree {
  generalInformation: TreeNode = new TreeNode('Thông tin chung', new TreeItem('generalInformation'));
  customer: TreeNode = new TreeNode('Khách hàng', new TreeItem('customer'));
  //servicePack: TreeNode = new TreeNode('Gói dịch vụ', new TreeItem('goi-dich-vu'));
  account: TreeNode = new TreeNode('Tài khoản', new TreeItem('account'));
  // eBanking: TreeNode = new TreeNode('E-Banking', new TreeItem('ebanking'));
  // tslint:disable-next-line:variable-name
  balance_change: TreeNode = new TreeNode('Biến động số dư', new TreeItem('balance'));
  card: TreeNode = new TreeNode('Thẻ', new TreeItem('card'));
  formAccount: TreeNode = new TreeNode('Biểu mẫu', new TreeItem('form-account'));
  attachDocument: TreeNode = new TreeNode('Tài liệu đính kèm', new TreeItem('attachment'));
  signature: TreeNode = new TreeNode('Chữ ký', new TreeItem('signature'));
  sendForApproval: TreeNode = new TreeNode('Gửi duyệt', new TreeItem('confirm'));
  approvalInformation: TreeNode = new TreeNode('Duyệt dịch vụ', new TreeItem('service-approval'));


  setProcessId(processId: string): void {
    this.generalInformation.treeItem.processId = processId;
    this.customer.treeItem.processId = processId;
    // this.servicePack.treeItem.processId = processId;
    this.account.treeItem.processId = processId;
    // this.eBanking.treeItem.processId = processId;
    this.balance_change.treeItem.processId = processId;
    this.card.treeItem.processId = processId;
    this.formAccount.treeItem.processId = processId;
    this.attachDocument.treeItem.processId = processId;
    this.signature.treeItem.processId = processId;
    this.sendForApproval.treeItem.processId = processId;
    this.approvalInformation.treeItem.processId = processId;

  }

  setAccountList(accounts: AccountModel[]): void {
    this.account.item = `Tài khoản (${accounts.length})`;
    const lst = accounts.map((item) => {
      return new TreeNode(item.accountNumber || `Tài khoản mới ${item.accountIndex}`,
        new TreeItem('detailAccount', this.account.treeItem.processId, item.id), [
          new TreeNode('Đồng sở hữu',
            new TreeItem('co-owner', this.account.treeItem.processId, item.id),
            // [new TreeNode('OANH1', new TreeItem('oanh1'))]
          ),
          new TreeNode('Ủy quyền', new TreeItem('authority', this.account.treeItem.processId, item.id)),
        ]);
    });
    this.account.children = new BehaviorSubject(lst);
  }

  setCard(cards: Card[]): void {
    this.card.item = `Thẻ (${cards.length})`;
    const lstC = cards.map((item, index) => {
      return new TreeNode(`Thẻ mới ${index + 1}`,
        new TreeItem('card-infor', this.card.treeItem.processId, item.id), [
          new TreeNode('Danh sách thẻ phụ',
            new TreeItem('sup-card', this.card.treeItem.processId, item.id)
          )
        ]);
    });
    this.card.children = new BehaviorSubject(lstC);
  }

  setPrintOut(accounts: AccountModel[]): void {
    this.formAccount.item = `Biểu mẫu`;

  }


  getTree(authenticationService: AuthenticationService): TreeNode[] {

    const trees = [
      this.generalInformation,
    ];

    trees.push(this.customer);
    if (authenticationService.isPermission(PermissionConst.TAI_KHOAN.LIST)) {
      trees.push(this.account);
    }
    // trees.push(this.balance_change);
    if (authenticationService.isPermission(PermissionConst.THE_CHINH.LIST_ALL)) {
      trees.push(this.card);
    }
    // trees.push(this.card);

    trees.push(this.formAccount);
    if (authenticationService.isPermission(PermissionConst.TAI_LIEU_DINH_KEM.VIEW)) {
      trees.push(this.attachDocument);
    }
    if (authenticationService.isPermission(PermissionConst.CHU_KY.VIEW)) {
      trees.push(this.signature);
    }
    if (authenticationService.isPermission(PermissionConst.HO_SO_GIAO_DICH.SEND_APPROVE)) {
      trees.push(this.sendForApproval);
    }
    if (authenticationService.isPermission(PermissionConst.HO_SO_GIAO_DICH.APPROVE_ONE)) {
      trees.push(this.approvalInformation);
    }

    return trees;
  }
}
