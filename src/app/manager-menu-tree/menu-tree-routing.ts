import { Routes } from '@angular/router';
import { AccountComponent } from './account/account-component';
import { AuthorityComponent } from './authority/authority-component';
import { CreateAuthorityComponent } from './create-authority/create-authority.component';
import { DetailCustomerComponent } from '../manager-smart-form/process/view/detail-customer.component';
import { DetailAccountComponent } from './account/detail-account/detail-account.component';
import { DetailAuthorityComponent } from './detail-authority/detail-authority.component';
import { EbankingComponent } from './ebanking/ebanking.component';
import { ManagerMenuTreeComponent } from './manager-menu-tree.component';
import { UpdateAccountComponent } from './account/update-account/update-account.component';
import { UpdateAuthorityComponent } from './update-authority/update-authority.component';
import { AddSmsBankingComponent } from '../manager-smart-form/sms-banking/add-sms-banking/add-sms-banking.component';
import { GoiDichVuComponent } from './goi-dich-vu/goi-dich-vu.component';
import { FormAccountComponent } from './form-account/form-account.component';
import { GenarateInforComponent } from '../manager-smart-form/genarate-infor/genarate-infor.component';
import { SmsBankingComponent } from '../manager-smart-form/sms-banking/sms-banking/sms-banking.component';
import { SignatureComponent } from './signature/signature.component';
import { PrintoutAccountComponent } from './form-account/printout-account/printout-account.component';
import { ListMainCardComponent } from './card/main-card/list-main-card/list-main-card.component';
import { AddNewCardComponent } from './card/main-card/add-new-card/add-new-card.component';
import { UpdateMainCardComponent } from './card/main-card/update-main-card/update-main-card.component';
import { ListSupCardComponent } from './card/supCard/list-sup-card/list-sup-card.component';
import { CardInfoComponent } from './card/main-card/card-info/card-info.component';
import { AddSupCardComponent } from './card/supCard/add-sup-card/add-sup-card.component';
import { InforSupCardComponent } from './card/supCard/infor-sup-card/infor-sup-card.component';
import { UpdateSupCardComponent } from './card/supCard/update-sup-card/update-sup-card.component';
import { AccountCreateComponent } from './account/account-create/account-create.component';
import { UpdateCifComponent } from './update-cif/update-cif.component';
import { SendApporveComponent } from './send-apporve/send-apporve.component';
import { BrowseApporeComponent } from './browse-appore/browse-appore.component';
import { DetailCifComponent } from './detail-cif/detail-cif.component';
import { AccountOwnerCreateComponent } from './account/account-owner/account-owner-create/account-owner-create.component';
import { AccountAuthorityCreateComponent } from './account/account-authority/account-authority-create/account-authority-create.component';
import { AccountAuthorityUpdateComponent } from './account/account-authority/account-authority-update/account-authority-update.component';
import { AccountOwnerListComponent } from './account/account-owner/account-owner-list/account-owner-list.component';
import { AccountOwnerUpdateComponent } from './account/account-owner/account-owner-update/account-owner-update.component';
import { AccountOwnerDetailComponent } from './account/account-owner/account-owner-detail/account-owner-detail.component';
import { AccountAuthorityDetailComponent } from './account/account-authority/account-authority-detail/account-authority-detail.component';
import { AttachmentComponent } from './attachment/attachment.component';
import {AuthGuard} from '../_helpers/auth.guard';
import {PermissionConst} from '../_utils/PermissionConst';
import {RoleBaseGuard} from '../_helpers/role-base.guard';



export const routesMenuTree: Routes = [
  {
    path: '', component: ManagerMenuTreeComponent,
    canActivate: [RoleBaseGuard],
    canActivateChild: [RoleBaseGuard],
    children: [
      {
        path: 'confirm',
        component: SendApporveComponent
      },
      // {
      //   path: 'confirm-new',
      //   component: SendApporveComponent
      // },
      // {
      //   path: 'browse-new',
      //   component: BrowseApporeComponent
      // },
      // {
      //   path: 'fileProcessed/:processId',
      //   component: DetailCustomerComponent
      // },
      {
        path: 'fileProcessed/:processId',
        component: DetailCifComponent,
        data: { action: PermissionConst.HO_SO_GIAO_DICH.DETAIL }
      },
      {
        path: 'account',
        component: AccountComponent,
        runGuardsAndResolvers: 'always',
      },
      // {
      //   path: 'fileProcessed/:processId/update',
      //   component: ProcessUpdateComponent
      // },
      {
        path: 'fileProcessed/:processId/update',
        component: UpdateCifComponent
      },
      {
        path: 'createAccount',
        component: AccountCreateComponent
      },
      {
        path: 'detailAccount',
        component: DetailAccountComponent
      },
      {
        path: 'customer',
        component: DetailCifComponent
      },
      {
        path: 'ebanking',
        component: EbankingComponent
      },
      {
        path: 'signature',
        component: SignatureComponent
      },
      {
        path: 'attachment',
        component: AttachmentComponent
      },
      {
        path: 'service-approval',
        component: BrowseApporeComponent
      },
      {
        path: 'updateAccount',
        component: UpdateAccountComponent
      },
      {
        path: 'authority',
        component: AuthorityComponent
      },
      {
        path: 'createAuthority',
        // component: CreateAuthorityComponent
        component: AccountAuthorityCreateComponent
      },
      {
        path: 'createAuthority-new',
        component: AccountAuthorityCreateComponent
      },
      {
        path: 'detailAuthority',
        // component: DetailAuthorityComponent
        component: AccountAuthorityDetailComponent
      },
      {
        path: 'detailAuthority-new',
        component: AccountAuthorityDetailComponent
      },
      {
        path: 'updateAuthority',
        // component: UpdateAuthorityComponent
        component: AccountAuthorityUpdateComponent
      },
      {
        path: 'updateAuthority-new',
        component: AccountAuthorityUpdateComponent
      },
      // {
      //   path: 'co-owner',
      //   component: CoOwnerAccountComponent
      // },
      {
        path: 'co-owner',
        component: AccountOwnerListComponent
      },
      // {
      //   path: 'co-owner/create',
      //   component: CreateCoOwnerComponent
      // },
      {
        path: 'co-owner/create',
        component: AccountOwnerCreateComponent
      },
      // {
      //   path: 'co-owner/update',
      //   component: UpdateCoOwnerComponent
      // },
      {
        path: 'co-owner/update',
        component: AccountOwnerUpdateComponent
      },
      // {
      //   path: 'co-owner/view',
      //   component: DetailCoOwnerComponent
      // },
      {
        path: 'co-owner/view',
        component: AccountOwnerDetailComponent
      },
      // {path:'processRequest', component:ProcessTheRequestComponent},
      // {path:'detailCustomer',component: DetailCustomerComponent},
      // {path:'lstAccount',component: LstAccountComponent},
      // {path:'createAccount',component: CreateAccountComponent},
      // {path:'detailAccount',component:DetailAccountComponent}
      {
        path: 'card',
        component: ListMainCardComponent,
        data: { action: PermissionConst.THE_CHINH.LIST_ALL }
      },
      {
        path: 'add-new-card',
        component: AddNewCardComponent,
        data: { action: PermissionConst.THE_CHINH.CREATE }
      },
      {
        path: 'update-main-card',
        component: UpdateMainCardComponent,
        data: { action: PermissionConst.THE_CHINH.UPDATE }
      },
      {
        path: 'sup-card',
        component: ListSupCardComponent,
        data: { action: PermissionConst.THE_PHU.LIST_ALL }
      },
      {
        path: 'card-infor',
        component: CardInfoComponent,
        data: { action: PermissionConst.THE_CHINH.DETAIL }
      },
      {
        path: 'add-sup-card/:cardId/:processId',
        component: AddSupCardComponent,
        data: { action: PermissionConst.THE_PHU.CREATE }
      },
      {
        path: 'infor-sup-card/:id/:cardId/:processId',
        component: InforSupCardComponent,
        data: { action: PermissionConst.THE_PHU.DETAIL }
      },
      {
        path: 'update-sup-card/:id/:cardId/:processId',
        component: UpdateSupCardComponent,
        data: { action: PermissionConst.THE_PHU.UPDATE }
      },

      {
        path: 'sms',
        component: SmsBankingComponent,
      },
      {
        path: 'add-sms-banking',
        component: AddSmsBankingComponent,
      },
      {
        path: 'goi-dich-vu',
        component: GoiDichVuComponent,
      },
      {
        path: 'form-account',
        component: FormAccountComponent,
      },
      {
        path: 'printout-account',
        component: PrintoutAccountComponent,
      },
      {
        path: 'generalInformation',
        component: GenarateInforComponent,
        data: { action: PermissionConst.HO_SO_GIAO_DICH.DETAIL }
      },
    ]
  },

];

