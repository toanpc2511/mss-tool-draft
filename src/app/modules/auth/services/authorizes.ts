// Cập nhật mới nhất ngày 01/11/2021
export enum EAuthorize {
  DASH_BOARD = 'dashboard',

  /* Quản lý trạm xăng */
  MENU_GAS_STAION_MANAGEMENT = 'menu_gas_staion_management',
  CREATE_GAS_STATION_BUTTON = 'create_gas_station_button',
  UPDATE_GAS_STATION_BUTTON = 'update_gas_station_button',
  DELETE_GAS_STATION_BUTTON = 'delete_gas_station_button',
  VIEW_GAS_FIELD_SCREEN = 'view_gas_field_screen',
  CREATE_GAS_FIELD_BUTTON = 'create_gas_field_button',
  UPDATE_GAS_FIELD_BUTTON = 'update_gas_field_button',
  DELETE_GAS_FIELD_BUTTON = 'delete_gas_field_button',
  VIEW_PUMP_POLE_SCREEN = 'view_pump_pole_screen',
  CREATE_PUMP_POLE_BUTTON = 'create_pump_pole_button',
  UPDATE_PUMP_POLE_BUTTON = 'update_pump_pole_button',
  DELETE_PUMP_POLE_BUTTON = 'delete_pump_pole_button',
  VIEW_PUMP_HOSE_SCREEN = 'view_pump_hose_screen',
  CREATE_PUMP_HOSE_BUTTON = 'create_pump_hose_button',
  UPDATE_PUMP_HOSE_BUTTON = 'update_pump_hose_button',
  DELETE_PUMP_HOSE_BUTTON = 'delete_pump_hose_button',
  /* End */

  /* Quản lý qr code */
  VIEW_PRODUCT_QR_LIST_SCREEN = 'view_product_qr_list_screen',
  VIEW_PUMP_HOSE_QR_LIST_SCREEN = 'view_pump_hose_qr_list_screen',
  DOWNLOAD_PUMP_HOSE_QR_BUTTON = 'download_pump_hose_qr_button',
  DOWNLOAD_PRODUCT_QR_BUTTON = 'download_product_qr_button',
  /* End */

  /* Quản lý khách hàng */
  VIEW_DRIVER_LIST_SCREEN = 'view_driver_list_screen',
  VIEW_DRIVER_DETAIL_SCREEN = 'view_driver_detail_screen',
  UPDATE_DRIVER_INFO_BUTTON = 'update_driver_info_button',
  VIEW_CONTRACT_INFO_BUTTON = 'view_contract_info_button',
  VIEW_DRIVER_CHILDREN_BUTTON = 'view_driver_children_button',
  VIEW_VEHICLE_BUTTON = 'view_vehicle_button',
  UPDATE_RANK_CUSTOMER = 'update_rank_customer',
  /* End */

  /* Lịch sử sử dụng điểm + giao dịch */
  VIEW_HISTORY_ACCUMULATE_SCREEN = 'view_history_accumulate_screen',
  EXPORT_HISTORY_ACCUMULATE_BUTTON = 'export_history_accumulate_button',
  VIEW_TRANSACTION_HISTORY_DETAIL_BUTTON = 'view_transaction_history_detail_button',
  /* End */

  /* Quản lý sản phẩm */
  VIEW_CATEGORY_SCREEN = 'view_category_screen',
  CREATE_CATEGORY_BUTTON = 'create_category_button',
  UPDATE_CATEGORY_BUTTON = 'update_category_button',
  DELETE_CATEGORY_BUTTON = 'delete_category_button',
  VIEW_OIL_LIST_SCREEN = 'view_oil_list_screen',
  CREATE_OIL_BUTTON = 'create_oil_button',
  UPDATE_OIL_BUTTON = 'update_oil_button',
  DELETE_OIL_BUTTON = 'delete_oil_button',
  VIEW_OTHER_PRODUCT_SCREEN = 'view_other_product_screen',
  CREATE_OTHER_PRODUCT_SCREEN = 'create_other_product_screen',
  UPDATE_OTHER_PRODUCT_SCREEN = 'update_other_product_screen',
  DELETE_OTHER_PRODUCT_SCREEN = 'delete_other_product_screen',
  SETUP_PRICE_BUTTON = 'setup_price_button',
  /* End */

  /* Quản lý hợp đồng */
  VIEW_CONTRACT_LIST_SCREEN = 'view_contract_list_screen',
  VIEW_CONTRACT_DETAIL_BUTTON = 'view_contract_detail_button',
  CREATE_CONTRACT_BUTTON = 'create_contract_button',
  UPDATE_CONTRACT_BUTTON = 'update_contract_button',
  CREATE_CONTRACT_PLAN_BUTTON = 'create_contract_plan_button',
  UPDATE_CONTRACT_PLAN_BUTTON = 'update_contract_plan',
  DELETE_CONTRACT_BUTTON = 'delete_contract_button',
  ACCEPT_CONTRACT_BUTTON = 'accept_contract_button',
  REJECT_CONTRACT_BUTTION = 'reject_contract_button',
  UPDATE_CONTRACT_PAYMENT_BUTTON = 'update_contract_payment_button',
  CREATE_LIQUIDATION_BUTTON = 'create_liquidation_button',
  ACCEPTANCES_LIQUIDATION_BUTTON = 'acceptances_liquidation_button',
  REJECTIONS_LIQUIDATION_BUTTON = 'rejections_liquidation_button',
  UPDATE_LIQUIDATION_BUTTON = 'update_liquidation_button',
  /* End */

  /* Quản lý nhân viên */
  VIEW_EMPLOYEE_LIST_SCREEN = 'view_employee_list_screen',
  VIEW_EMPLOYEE_DETAIL_SCREEN = 'view_employee_detail_screen',
  CREATE_EMPLOYEE_BUTTON = 'create_employee_button',
  UPDATE_EMPLOYEE_BUTTON = 'update_employee_button',
  DELETE_EMPLOYEE_BUTTON = 'delete_employee_button',
  VIEW_LIST_EVALUATION = 'view_list_evaluation',
  /* End */

  /* Quản lý tài khoản */
  VIEW_ACCOUNT_LIST_SCREEN = 'view_account_list_screen',
  CREATE_ACCOUNT_BUTTON = 'create_account_button',
  UPDATE_ACCOUNT_BUTTON = 'update_account_button',
  DELETE_ACCOUNT_BUTTON = 'delete_account_button',
  RESET_PASSWORD_BUTTON = 'reset_password_button',
  /* End */

  /* Quản lý phân quyền */
  VIEW_ROLE_LIST_SCREEN = 'view_role_list_screen',
  CREATE_ROLE_BUTTON = 'create_role_button',
  UPDATE_ROLE_BUTTON = 'update_role_button',
  DELETE_ROLE_BUTTON = 'delete_role_button',
  /* End */

  /* Quản lý ca làm việc */
  VIEW_SHIFT_CONFIG_SCREEN = 'view_shift_config_screen',
  CREATE_SHIFT_CONFIG_BUTTON = 'create_shift_config_button',
  UPDATE_SHIFT_CONFIG_BUTTON = 'update_shift_config_button',
  DELETE_SHIFT_CONFIG_BUTTON = 'delete_shift_config_button',
  VIEW_CALENDAR_SCREEN = 'view_calendar_screen',
  CREATE_CALENDAR_BUTTON = 'create_calendar_button',
  UPDATE_CALENDAR_BUTTON = 'update_calendar_button',
  DELETE_CALENDAR_BUTTON = 'delete_calendar_button',
  VIEW_SWAP_SHIFT_SCREEN = 'view_swap_shift_screen',
  CONFIRM_AND_REJECT_SWAP_SHIFT = 'confirm_and_reject_swap_shift',
  VIEW_LOCK_SHIFT_LIST_SCREEN = 'view_lock_shift_list_screen',
  UPDATE_PRODUCT_REVENUE = 'update_product_revenue',
  UPDATE_OTHER_PRODUCT_REVENUE = 'update_other_product_revenue',
  UPDATE_PROMOTIONAL_REVENUE = 'update_promotional_revenue',
  UPDATE_PRODUCT_REVENUE_FULL = 'update_product_revenue_full',
  CONFIRM_CLOSE_SHIFT_BUTTON = 'confirm_close_shift_button',
  CONFIRMED_REQUEST_LOCK_SHIFT = 'confirmed_request_lock_shift',
  DELETE_CALENDAR_CONDITION_BUTTON = 'delete_calendar_condition_button',
  ROLL_BACK_SWAP_SHIFT = 'roll_back_swap_shift',
  /* End */

  /* Quản lý cấu hình */
  VIEW_POINT_LIST_SCREEN = 'view_point_list_screen',
  UPDATE_POINT_BUTTON = 'update_point_button',
  VIEW_DISCOUNT_LIST_SCREEN = 'view_discount_list_screen',
  UPDATE_DISCOUNT_BUTTON = 'update_discount_button',
  VIEW_RANK_LIST_SCREEN = 'view_rank_list_screen',
  UPDATE_RANK_BUTTON = 'update_rank_button',
  VIEW_PROMOTION_LIST_SCREEN = 'view_promotion_list_screen',
  CREATE_PROMOTION_BUTTON = 'create_promotion_button',
  UPDATE_PROMOTION_BUTTON = 'update_promotion_button',
  DELETE_PROMOTION_BUTTON = 'delete_promotion_button',
  /* End */

  /* Quản lý kho */
  VIEW_LIST_IMPORT_REQUEST = 'view_list_import_request',
  VIEW_DETAIL_IMPORT_REQUEST = 'view_detail_import_request',
  CREATE_IMPORT_REQUEST = 'create_import_request',
  UPDATE_IMPORT_REQUEST = 'update_import_request',
  DELETE_DETAIL_IMPORT_REQUEST = 'delete_detail_import_request',
  CONFIRM_OR_CANCEL_IMPORT_REQUEST = 'confirm_or_cancel_import_request',
  EXPORT_FILE_WORD_WAREHOUSE_IMPORT = 'export_file_word_warehouse_import',
  VIEW_LIST_SHALLOW_SCREEN = 'view_list_shallow_screen',
  CREATE_SHALLOW_BUTTON = 'create_shallow_button',
  CREATE_MEASURES_BUTTON = 'create_measures_button',
  VIEW_WAREHOUSE_ORDERS_SCREEN = 'view_warehouse_orders_screen',
  BROWSE_WAREHOUSE_ORDER_BUTTON = 'browse_warehouse_order_button',
  REFUSES_WAREHOUSE_ORDERS = 'refuses_warehouse_orders',
  ACCEPT_WAREHOUSE_ORDER = 'accept_warehouse_order',
  REQUIRE_ADJUSTMENT_WAREHOUSE_ORDERS = 'require_adjustment_warehouse_orders',
  VIEW_WAREHOUSE_EXPORT_LIST_SCREEN = 'view_warehouse_export_list_screen',
  COMPLETE_WAREHOUSE_EXPORT_BUTTON = 'complete_warehouse_export_button',
  VIEW_WAREHOUSE_IMPORT_LIST_SCREEN = 'view_warehouse_import_list_screen',
  COMPLETE_WAREHOUSE_IMPORT_BUTTON = 'complete_warehouse_import_button',
  VIEW_MEASURES_SCREEN = 'view_measures_screen',
  VIEW_WAREHOUSE_IMPORT_DETAIL_SCREEN = 'view_warehouse_import_detail_screen',
  CREATE_WAREHOUSE = 'create_warehouse',
  /* End */

  // Exchange point roles
  TRANSFER_POINT_BUTTON = 'transfer_point_button',
  VIEW_TRANSFER_POINT_HISTORY_MENU = 'view_transfer_point_history_menu',
  VIEW_TRANSACTION_HISTORY_MENU = 'view_transaction_history_menu',
  EXPORT_FILE_TRANSATION_HISTORY_BUTTON = 'export_file_transation_history_button',
  // End

  //Banner Roles
  VIEW_BANNERS_SCREEN = 'view_banners_screen',
  UPDATE_BANNER = 'update_banner',
  CREATE_BANNER = 'create_banner',
  DELETE_BANNER = 'delete_banner',
  //End

  // News Roles
  VIEW_LIST_NEWS_SCREEN = 'view_list_news_screen',
  CREATE_NEWS_BUTTON = 'create_news_button',
  UPDATE_NEWS_BUTTON = 'update_news_button',
  DELETE_NEWS_BUTTON = 'delete_news_button',

  // Lịch sử tác động
  VIEW_LOG = 'view_log',

  // Hoạt động vòi bơm
  VIEW_HISTORY_PUMP_CODE = 'view_history_pump_code',
  VIEW_PUMP_CODE = 'view_pump_code'
}
