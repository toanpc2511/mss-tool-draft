import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, pluck, switchMap, takeUntil, tap } from 'rxjs/operators';
import { convertDateToDisplay } from 'src/app/shared/helpers/functions';
import { DestroyService } from 'src/app/shared/services/destroy.service';
import { FileService } from 'src/app/shared/services/file.service';
import { SubheaderService } from 'src/app/_metronic/partials/layout';
import { GasStationResponse } from '../../gas-station/gas-station.service';
import { EFace, EMaritalStatus, EmployeeService, ESex, IEmployeeDetail } from '../employee.service';

@Component({
	selector: 'app-employee-detail-modal',
	templateUrl: './employee-detail-modal.component.html',
	styleUrls: ['./employee-detail-modal.component.scss'],
	providers: [DestroyService]
})
export class EmployeeDetailModalComponent implements OnInit, AfterViewInit {
	eFace = EFace;
	eSex = ESex;
	eMaritalStatus = EMaritalStatus;
	employeeData: IEmployeeDetail;

	constructor(
		private employeeService: EmployeeService,
		private activeRoute: ActivatedRoute,
		private cdr: ChangeDetectorRef,
		private subheader: SubheaderService,
		private fileService: FileService,
		private destroy$: DestroyService
	) {}

	setBreadcumb() {
		setTimeout(() => {
			this.subheader.setBreadcrumbs([
				{
					title: 'Quản lý nhân viên',
					linkText: 'Quản lý nhân viên',
					linkPath: '/nhan-vien/danh-sach'
				},
				{
					title: 'Chi tiết thông tin nhân viên',
					linkText: 'Chi tiết thông tin nhân viên',
					linkPath: null
				}
			]);
		}, 1);
	}

	ngAfterViewInit(): void {
		this.setBreadcumb();
	}

	ngOnInit(): void {
		this.activeRoute.params
			.pipe(
				pluck('id'),
				filter((id) => !!id),
				switchMap((id) => {
					this.setBreadcumb();
					return this.employeeService.getEmployeeById(id);
				}),
				tap((res) => {
					this.employeeData = res.data;
					this.cdr.detectChanges();
				}),
				takeUntil(this.destroy$)
			)
			.subscribe();
	}

	convertDateToDisplay(value: string) {
		return convertDateToDisplay(value);
	}

	displayStationList(stations: GasStationResponse[]) {
		if (!stations) {
			return '';
		}
		return stations.map((s) => s.name).join(', ');
	}

	downloadFile(fileId: string, fileName: string) {
		this.fileService.downloadFile(fileId, fileName);
	}
}
