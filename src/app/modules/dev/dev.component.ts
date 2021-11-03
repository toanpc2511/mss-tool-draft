import { UserModel } from './../auth/services/auth.service';
import { Router } from '@angular/router';
import { Component, OnInit, isDevMode } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';

@Component({
	selector: 'app-dev',
	templateUrl: './dev.component.html',
	styleUrls: ['./dev.component.scss']
})
export class DevComponent implements OnInit {
	currentToken: string;
	currentActions: string[] = [];
	permisionKey = '';
	constructor(private authService: AuthService, private router: Router) {
		if (!isDevMode()) {
			this.router.navigate(['']);
		}
		this.currentToken = authService.getCurrentUserValue()?.token;
	}
	ngOnInit(): void {
		this.currentActions = this.authService.getCurrentUserValue()?.actions || [];
	}

	inputToken($event) {
		this.currentToken = $event.target.value;
	}

	updateToken() {
		this.authService.setCurrentUserValue({
			...this.authService.getCurrentUserValue(),
			token: this.currentToken
		});
		window.location.reload();
	}

	inputPermissionKey($event) {
		this.permisionKey = $event.target.value;
	}

	addPermission() {
		this.currentActions = [...this.currentActions].concat(this.permisionKey.split(','));
		this.updateUserPermission();
	}

	addFullPermission() {
		const fullPermission = `dashboard,menu_gas_staion_management,create_gas_station_button,update_gas_station_button,delete_gas_station_button,view_gas_field_screen,create_gas_field_button,update_gas_field_button,delete_gas_field_button,view_pump_pole_screen,create_pump_pole_button,update_pump_pole_button,delete_pump_pole_button,view_pump_pole_screen,create_pump_pole_button,update_pump_pole_button,delete_pump_pole_button,view_category_screen,create_category_button,update_category_button,delete_category_button,view_oil_list_screen,create_oil_button,update_oil_button,delete_oil_button,setup_price_button,view_other_product_screen,create_other_product_screen,update_other_product_screen,delete_other_product_screen,view_pump_pole_qr_list_screen,view_product_qr_list_screen,download_pump_pole_qr_button,download_product_qr_button,view_account_list_screen,create_account_button,update_account_button,delete_account_button,view_contract_list_screen,view_contract_detail_button,create_contract_button,update_contract_button,delete_contract_button,accept_contract_button,reject_contract_buttion,view_driver_list_screen,view_driver_detail_screen,update_driver_info_button,create_vehicle_button,view_driver_children_button,view_contract_info_button,view_rank_list_screen,update_rank_button,view_discount_list_screen,update_discount_button,view_point_list_screen,update_point_button,view_promotion_list_screen,create_promotion_button,update_promotion_button,delete_promotion_button,view_role_list_screen,create_role_button,update_role_button,delete_role_button,view_employee_list_screen,view_employee_detail_screen,create_employee_button,update_employee_button,delete_employee_button,view_shift_config_screen,create_shift_config_button,update_shift_config_button,delete_shift_config_button,view_calendar _screen,create_calendar_button,update_calendar_button,delete_calendar_button,view_swap_shift_screen,view_swap_shift_screen,reject_swap_shift_button,accept_swap_shift_button,view_revenue_oil_detail_screen,view_revenue_other_product_detail_screen,view_promotion_report_screen,view_revenue_summary_screen,update_promotion_report_button,update_revenue_other_product_button,confirm_close_shift_button,request_,print_sell_report_button,transfer_point_button,view_transfer_point_history_menu,view_transaction_history_menu,export_file_transation_history_button,view_transaction_history_detail_button,accept_accumulate_points_button,view_history_revenue_shift,view_pump_hose_screen,create_pump_hose_button,update_pump_hose_button,delete_pump_hose_button`;
		this.currentActions = [...this.currentActions].concat(fullPermission.split(','));
		this.updateUserPermission();
	}

	removePermission(actionRemove) {
		this.currentActions = [...this.currentActions].filter((action) => action !== actionRemove);
		this.updateUserPermission();
	}

	clearPermission() {
		this.currentActions = [];
		this.updateUserPermission();
	}

	updateUserPermission() {
		const newUserValue: UserModel = {
			...this.authService.getCurrentUserValue(),
			actions: this.currentActions
		};
		this.authService.setCurrentUserValue(newUserValue);
	}
}
