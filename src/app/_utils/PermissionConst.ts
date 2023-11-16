export class PermissionConst {


  public static CHU_KY = {
    EDIT: '/attachment/signature/edit',
    DETAIL: '/attachment/signature/detail',
    DELETE: '/attachment/signature/delete',
    CREATE: '/attachment/signature/create',
    HISTORY: '/attachment/signature/history',
    CAP_NHAT: '/attachment/signature/update',
    VIEW: '/attachment/signature/view',
    VIEW_HISTORY: '/attachment/signature/viewHistory',
    DELETE_FILE: '/attachment/signature/deleteFile',
  };


  public static TAI_LIEU_DINH_KEM = {
    HISTORY: '/attachment/attachment/history',
    CREATE: '/attachment/attachment/create',
    VIEW_HISTORY: '/attachment/attachment/viewHistory',
    VIEW: '/attachment/attachment/view',
    UPDATE: '/attachment/attachment/update',
    DETAIL: '/attachment/attachment/detail',
    DELETE: '/attachment/attachment/delete',
    DELETE_FILE: '/attachment/attachment/deleteFile',
  };

  public static THE_CHINH = {
    UPDATE: '/card/card/update',
    LIST_ALL: '/card/card/listAll',
    DETAIL: '/card/card/detail',
    CREATE: '/card/card/create',
    DELETE: '/card/card/delete',
    CREATE_SUB_CARD: '/card/supCard/create'
  };

  public static THE_PHU = {
    LIST_ALL: '/card/supCard/listAll',
    CREATE: '/card/supCard/create',
    UPDATE: '/card/supCard/update',
    DETAIL: '/card/supCard/detail',
    DELETE: '/card/supCard/delete'
  };

  public static KET_XUAT_THE = {
    LIST: '/card/exportCard/list',
    EXPORT_XML: '/card/exportCard/exportXml',
  };

  public static TAI_KHOAN = {
    DETAIL: '/account/account/detail',
    CREATE: '/account/account/create',
    ACCOUNT_LINK_LIST: '/account/account/accountLinkList',
    LIST: '/account/account/list',
    UPDATE: '/account/account/update',
    DELETE: '/account/account/delete'
  };

  public static TK_UY_QUYEN = {
    UPDATE: '/account/accountAuthor/update',
    LIST: '/account/accountAuthor/list',
    DETAIL: '/account/accountAuthor/detail',
    CREATE: '/account/accountAuthor/create',
    DELETE: '/account/accountAuthor/delete'
  };

  public static TK_DONG_SO_HUU = {
    DETAIL: '/process/customer/detailCoowner',
    DELETE: '/process/customer/deleteCoowner',
    CREATE: '/process/customer/createCoowner',
    CREATE_ID: '/process/customer/{id}',
    UPDATE: '/process/customer/updateCoowner',
    LIST: '/process/customer/listCoowner',
  };

  public static HO_SO_GIAO_DICH = {
    DELETE: '/process/process/{processId}',
    SEND_MODIFY: '/process/process/sendModify',
    UPDATE: '/process/process/update',
    SEND_CANCEL: '/process/process/sendCancel',
    SEND_APPROVE_ONE: '/process/process/sendApproveOne',
    SEND_APPROVE_CREATE_CIF: '/process/process/sendApproveCreateCIF',
    SEND_APPROVE_UPDATE_CIF: '/process/process/sendApproveUpdateCIF',
    SEND_APPROVE_CREATE_FAST_CIF: '/process/process/sendApproveCreateFastCIF',
    SEND_APPROVE_CREATE_ACCOUNT: '/process/process/sendApproveCreateAccount',
    SEND_APPROVE_UPDATE_ACCOUNT: '/process/process/sendApproveUpdateAccount',
    SEND_APPROVE_CREATE_COOWNER: '/process/process/sendApproveCreateCoowner',
    SEND_APPROVE_CREATE_AUTHOR: '/process/process/sendApproveCreateAuthor',
    SEND_APPROVE_CREATE_CARD: '/process/process/sendApproveCreateCard',
    SEND_APPROVE_CREATE_SUP_CARD: '/process/process/sendApproveCreateSupCard',
    SEND_APPROVE_CREATE_SIGNATURE: '/process/process/sendApproveCreateSignature',
    SEND_APPROVE_UPDATE_SIGNATURE: '/process/process/sendApproveUpdateSignature',
    SEND_APPROVE_CREATE_ATTACHMENT: '/process/process/sendApproveCreateAttachment',
    SEND_APPROVE: '/process/process/sendApprove',
    OPEN_CIF: '/process/process/openCIF',
    LOCK_SERVICE: '/process/process/lockService',
    SEND_REJECT_ONE: '/process/process/sendRejectOne',
    SEND_REJECT_CREATE_CIF: '/process/process/sendRejectCreateCIF',
    SEND_REJECT_UPDATE_CIF: '/process/process/sendRejectUpdateCIF',
    SEND_REJECT_CREATE_FAST_CIF: '/process/process/sendRejectCreateFastCIF',
    SEND_REJECT_CREATE_ACCOUNT: '/process/process/sendRejectCreateAccount',
    SEND_REJECT_UPDATE_ACCOUNT: '/process/process/sendRejectUpdateAccount',
    SEND_REJECT_CREATE_COOWNER: '/process/process/sendRejectCreateCoowner',
    SEND_REJECT_CREATE_AUTHOR: '/process/process/sendRejectCreateAuthor',
    SEND_REJECT_CREATE_CARD: '/process/process/sendRejectCreateCard',
    SEND_REJECT_CREATE_SUP_CARD: '/process/process/sendRejectCreateSupCard',
    SEND_REJECT_CREATE_SIGNATURE: '/process/process/sendRejectCreateSignature',
    SEND_REJECT_UPDATE_SIGNATURE: '/process/process/sendRejectUpdateSignature',
    SEND_REJECT_CREATE_ATTACHMENT: '/process/process/sendRejectCreateAttachment',
    SEND_REJECT: '/process/process/sendReject',
    APPROVE_ALL: '/process/process/approveAll',
    SEND_MODIFY_ONE: '/process/process/sendModifyOne',
    SEND_MODIFY_CREATE_CIF: '/process/process/sendModifyCreateCIF',
    SEND_MODIFY_UPDATE_CIF: '/process/process/sendModifyUpdateCIF',
    SEND_MODIFY_CREATE_FAST_CIF: '/process/process/sendModifyCreateFastCIF',
    SEND_MODIFY_CREATE_ACCOUNT: '/process/process/sendModifyCreateAccount',
    SEND_MODIFY_UPDATE_ACCOUNT: '/process/process/sendModifyUpdateAccount',
    SEND_MODIFY_CREATE_COOWNER: '/process/process/sendModifyCreateCoowner',
    SEND_MODIFY_CREATE_AUTHOR: '/process/process/sendModifyCreateAuthor',
    SEND_MODIFY_CREATE_CARD: '/process/process/sendModifyCreateCard',
    SEND_MODIFY_CREATE_SUP_CARD: '/process/process/sendModifyCreateSupCard',
    SEND_MODIFY_CREATE_SIGNATURE: '/process/process/sendModifyCreateSignature',
    SEND_MODIFY_UPDATE_SIGNATURE: '/process/process/sendModifyUpdateSignature',
    SEND_MODIFY_CREATE_ATTACHMENT: '/process/process/sendModifyCreateAttachment',
    APPROVE_ONE: '/process/process/approveOne',
    APPROVE_CREATE_CIF: '/process/process/approveCreateCIF',
    APPROVE_UPDATE_CIF: '/process/process/approveUpdateCIF',
    APPROVE_CREATE_FAST_CIF: '/process/process/approveCreateFastCIF',
    APPROVE_CREATE_ACCOUNT: '/process/process/approveCreateAccount',
    APPROVE_UPDATE_ACCOUNT: '/process/process/approveUpdateAccount',
    APPROVE_CREATE_OWNER: '/process/process/approveCreateCoowner',
    APPROVE_CREATE_AUTHOR: '/process/process/approveCreateAuthor',
    APPROVE_CREATE_CARD: '/process/process/approveCreateCard',
    APPROVE_CREATE_SUP_CARD: '/process/process/approveCreateSupCard',
    APPROVE_CREATE_SIGNATURE: '/process/process/approveCreateSignature',
    APPROVE_UPDATE_SIGNATURE: '/process/process/approveUpdateSignature',
    APPROVE_CREATE_ATTACHMENT: '/process/process/approveCreateAttachment',
    APPROVE_SERVICE: '/process/process/approveService',
    DELETE_SERVICE: '/process/process/delete',
    DETAIL: '/process/process/detail',
    GET_DATE_BRANCH: '/process/process/getDateBranch',
  };

  public static TRANG_THAI_GD = {
    SEND_MODIFY_ONE: '/process/processAction/sendModifyOne',
    SEND_REJECT_ONE: '/process/processAction/sendRejectOne',
    SEND_APPROVE_ONE: '/process/processAction/sendApproveOne',
  };

  public static TIM_KIEM_KH = {
    SEARCH_SIGNATURE: '/process/customerSearch/searchSignature',
    SEARCH_CUSTOMER: '/process/customerSearch/searchCustomer'
  };

  public static GHI_CHU_TRANG_THAI_DV = {
    INTEGRATED_STATUS: '/process/integrated/integratedStatus',
  };

  public static TICH_HOP_ESB_CIF = {
    GET_CUSTOMER_PROCESS: '/process/customerESB/getCustomerProcess',
    GET_CUSTOMER_INFO: '/process/customerESB/getCustomerInfo',
  };

  public static DICH_VU_DUYET = {
    CREATE: '/process/processIntegrated/create',
    DETAIL: '/process/processIntegrated/id',
    LIST: '/process/processIntegrated/listAll',
  };

  public static SYSTEM_MANAGEMENT = {
    USER: 'SYS_MANAGEMENT_USER',
    TITLE: 'SYS_MANAGEMENT_TITLE',
    ROLE: 'SYS_MANAGEMENT_ROLE',
    FUNCTION: 'SYS_MANAGEMENT_FUNCTION',
    ACTION: 'SYS_MANAGEMENT_ACTION',
    ROLE_MAPPING: 'SYS_MANAGEMENT_ROLE_MAPPING',
  };

  public static HO_SO = {
    DANH_SACH: '/process/process/list',
    DANH_SACH_DANG_XU_LY: '/process/process/listGdv',
    CHI_TIET: '/process/process/detail',
    CAP_NHAT: '/process/process/update',
    GUI_DUYET: '/process/process/sendApproveOne',
    XOA: '/process/process/{processId}',
    YC_BO_SUNG: '/process/process/sendModifyCreateCIF',
    TC_HO_SO: '/process/process/sendRejectCreateCIF',
    DUYET: '/process/process/approveCreateCIF'
  };

  public static THE = {
    DANH_SACH: '/card/card/listAll',
    TAO_MOI: '/card/card/create',
    CAP_NHAT: '/card/card/update',
    CHI_TIET: '/card/card/detail',
    XOA: '/card/card/delete',
    GUI_DUYET: '/process/process/sendApproveCreateCard',
    THEM_MOI_THE_PHU: '/card/supCard/create'
  };

  public static DOI_SOAT = {
    DANH_SACH_CORE: '/bankpayment/getListCrossCheckingCore',
    DANH_SACH_CORE_PD: '/bankpayment/getListCrossCheckingCorepPD',
    TAO_MOI: '/bankpayment/addCreditPayment',
    CAP_NHAT: '/bankpayment/updateStatus',
    TU_CHOI: '/bankpayment/refuseCreditCard',
    EXPORT: '/report/export',
  };

  public static TTHD_NUOC = {
    SEARCH_BILL: '/water-service/bills',
  };

  public static OTHER_SERVICE = {
      SEARCH_SMS_STATUS: ''
  }
  //
  //
  //
  //
  // public static GUI_DUYET = {
  //   DANH_SACH: '/process/processIntegrated/listAll',
  // };
  //
  // public static DUYET = {
  //   DANH_SACH: '/process/processIntegrated/listAllApprove',
  // };

}
