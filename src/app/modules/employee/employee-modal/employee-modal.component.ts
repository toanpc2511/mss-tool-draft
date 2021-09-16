import { HttpEventType } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { combineLatest, Observable, of } from 'rxjs';
import {
	concatMap,
	debounceTime,
	pluck,
	startWith,
	switchMap,
	takeUntil,
	tap
} from 'rxjs/operators';
import { NO_EMIT_EVENT } from 'src/app/shared/app-constants';
import { convertDateToServer, renameUniqueFileName } from 'src/app/shared/helpers/functions';
import { DataResponse } from 'src/app/shared/models/data-response.model';
import { IError } from 'src/app/shared/models/error.model';
import { DestroyService } from 'src/app/shared/services/destroy.service';
import { EFileType, FileService, IFile } from 'src/app/shared/services/file.service';
import { TValidators } from 'src/app/shared/validators';
import { SubheaderService } from 'src/app/_metronic/partials/layout';
import {
	GasStationService,
	IAddress,
	IDistrict,
	IProvince,
	IWard
} from '../../gas-station/gas-station.service';
import {
	EFace,
	EMaritalStatus,
	EmployeeService,
	ESex,
	IDepartment,
	IEmployeeInput,
	IImage,
	IPosition
} from '../employee.service';

@Component({
	selector: 'app-employee-modal',
	templateUrl: './employee-modal.component.html',
	styleUrls: ['./employee-modal.component.scss'],
	providers: [DestroyService]
})
export class EmployeeModalComponent implements OnInit, AfterViewInit {
	currentDate = new Date();
	maxDate: NgbDateStruct = {
		day: this.currentDate.getDate(),
		month: this.currentDate.getMonth() + 1,
		year: this.currentDate.getFullYear()
	};

	eFace = EFace;
	eSex = ESex;
	eMaritalStatus = EMaritalStatus;
	employeeId: string;
	isUpdate = false;
	filesUploaded: Array<IFile> = [];
	filesUploadProgress: Array<number> = [];

	avatarImage: IImage;
	credentialImages: IImage[] = [];
	employeeForm: FormGroup;

	departments: IDepartment[] = [];
	selectedDepartment: IDepartment;
	positions: IPosition[] = [];
	selectedPosition: IPosition;
	stationAddress: IAddress[] = [];

	provinces: IProvince[] = [];
	selectedProvince: IProvince;
	districts: IDistrict[] = [];
	selectedDistrict: IDistrict;
	wards: IWard[] = [];
	selectedWard: IWard;

	isFirstLoad = true;

	constructor(
		private fb: FormBuilder,
		private employeeService: EmployeeService,
		private stationService: GasStationService,
		private activeRoute: ActivatedRoute,
		private cdr: ChangeDetectorRef,
		private subheader: SubheaderService,
		private fileService: FileService,
		private toastr: ToastrService,
		private router: Router,
		private destroy$: DestroyService
	) {}

	setBreadcumb() {
		let subBreadcump = {
			title: 'Thêm mới nhân viên',
			linkText: 'Thêm mới nhân viên',
			linkPath: null
		};
		if (this.isUpdate) {
			subBreadcump = {
				title: 'Sửa thông tin nhân viên',
				linkText: 'Sửa thông tin nhân viên',
				linkPath: null
			};
		}
		setTimeout(() => {
			this.subheader.setBreadcrumbs([
				{
					title: 'Quản lý nhân viên',
					linkText: 'Quản lý nhân viên',
					linkPath: '/nhan-vien/danh-sach'
				},
				subBreadcump
			]);
		}, 1);
	}

	ngAfterViewInit(): void {
		this.setBreadcumb();
	}

	ngOnInit(): void {
		this.buildForm();

		this.getAllProvinces();

		this.getAllDepartment();
		this.getAllStationAddress();

		this.handleProvinceChange();
		this.handleDistrictChange();
		this.handleWardChange();
		this.combineAddress();

		this.activeRoute.params
			.pipe(
				pluck('id'),
				tap((id) => {
					this.employeeId = id;
					if (this.employeeId) {
						this.isUpdate = true;
						this.setBreadcumb();
					}
				}),
				takeUntil(this.destroy$)
			)
			.subscribe();
	}

	getAllProvinces() {
		this.stationService
			.getAllProvinces()
			.pipe(takeUntil(this.destroy$))
			.subscribe((res) => {
				this.provinces = res.data;
				this.cdr.detectChanges();
			});
	}

	handleProvinceChange() {
		this.employeeForm
			.get('provinceId')
			.valueChanges.pipe(
				concatMap((provinceId: number) => {
					this.districts = [];
					this.wards = [];
					this.employeeForm.get('districtId').reset(null, NO_EMIT_EVENT);
					this.selectedDistrict = null;
					this.employeeForm.get('wardId').reset(null, NO_EMIT_EVENT);
					this.selectedWard = null;
					if (provinceId) {
						this.selectedProvince = this.provinces.find((p) => p.id === Number(provinceId));
						return this.stationService.getDistrictsByProvince(provinceId);
					}
					return of(null);
				}),
				tap((res) => {
					this.districts = res.data;
					this.cdr.detectChanges();
				}),
				takeUntil(this.destroy$)
			)
			.subscribe();
	}

	handleDistrictChange() {
		this.employeeForm
			.get('districtId')
			.valueChanges.pipe(
				concatMap((districtId: number) => {
					this.selectedDistrict = this.districts.find((d) => d.id === Number(districtId));
					this.wards = [];
					this.selectedWard = null;
					this.employeeForm.get('wardId').reset(null, NO_EMIT_EVENT);
					return this.stationService.getWardsByDistrict(districtId);
				}),
				tap((res) => {
					this.wards = res.data || [];
					this.cdr.detectChanges();
				}),
				takeUntil(this.destroy$)
			)
			.subscribe();
	}

	handleWardChange() {
		this.employeeForm
			.get('wardId')
			.valueChanges.pipe(
				tap((wardId: number) => {
					this.selectedWard = this.wards.find((w) => w.id === Number(wardId));
				}),
				takeUntil(this.destroy$)
			)
			.subscribe();
	}

	combineAddress() {
		const pronvice$ = this.employeeForm
			.get('provinceId')
			.valueChanges.pipe(startWith(0), takeUntil(this.destroy$)) as Observable<number>;
		const district$ = this.employeeForm
			.get('districtId')
			.valueChanges.pipe(startWith(0), takeUntil(this.destroy$)) as Observable<number>;
		const ward$ = this.employeeForm
			.get('wardId')
			.valueChanges.pipe(startWith(0), takeUntil(this.destroy$)) as Observable<number>;
		const address$ = this.employeeForm
			.get('address')
			.valueChanges.pipe(startWith(''), takeUntil(this.destroy$)) as Observable<string>;

		combineLatest([pronvice$, district$, ward$, address$])
			.pipe(
				debounceTime(300),
				concatMap(([proviceId, districtId, wardId, address]) =>
					of({
						proviceId,
						districtId,
						wardId,
						address
					})
				),
				tap((data) => {
					if (this.isUpdate && this.isFirstLoad) {
						this.isFirstLoad = false;
						return;
					}
					const provinceName = this.provinces.find((p) => p.id === Number(data.proviceId))?.name;
					const districtName = this.districts.find((d) => d.id === Number(data.districtId))?.name;
					const wardName = this.wards.find((w) => w.id === Number(data.wardId))?.name;
					const fullAddress = [data.address, wardName, districtName, provinceName]
						.filter((l) => !!l)
						.join(', ');

					this.employeeForm.get('fullAddress').patchValue(fullAddress);
				}),
				takeUntil(this.destroy$)
			)
			.subscribe();
	}

	getAllDepartment() {
		this.employeeService
			.getAllDepartment()
			.pipe(
				tap((res) => {
					this.departments = res.data;
					this.cdr.detectChanges();
				}),
				takeUntil(this.destroy$)
			)
			.subscribe();
	}

	getAllStationAddress() {
		this.stationService
			.getAddress()
			.pipe(
				tap((res) => {
					this.stationAddress = res.data;
					this.cdr.detectChanges();
				}, takeUntil(this.destroy$))
			)
			.subscribe();
	}

	buildForm(): void {
		this.employeeForm = this.fb.group({
			name: [null, TValidators.required],
			dateOfBirth: [null],
			sex: [null],
			phone: [null, TValidators.pattern(/^([\\+84|84|0]+(3|5|7|8|9))+([0-9]{8})$/)],
			email: [null, TValidators.email],
			departmentId: [null, TValidators.required],
			positionId: [null, TValidators.required],
			stationIds: [null],
			nation: [null],
			address: [null],
			religion: [null],
			identityCardNumber: [
				null,
				[TValidators.required, TValidators.pattern(/^[0-9]{12}$/)]
			],
			dateRange: [null],
			fullAddress: [null],
			supplyAddress: [],
			provinceId: [null],
			districtId: [null],
			wardId: [null],
			maritalStatus: [null]
		});

		//Disable form control
		this.employeeForm.get('fullAddress').disable(NO_EMIT_EVENT);

		//Handle form event

		this.employeeForm
			.get('departmentId')
			.valueChanges.pipe(
				switchMap((value: number) => {
					this.selectedDepartment = this.departments.find((d) => d.id === Number(value));
					return this.employeeService.getPositionByDepartment(
						this.selectedDepartment?.departmentType || ''
					);
				}),
				tap((res) => {
					this.employeeForm.get('positionId').patchValue(null, NO_EMIT_EVENT);
					this.selectedPosition = null;
					this.positions = res.data;
					this.cdr.detectChanges();
				}),
				takeUntil(this.destroy$)
			)
			.subscribe();

		this.employeeForm
			.get('positionId')
			.valueChanges.pipe(
				tap((value: number) => {
					this.selectedPosition = this.positions.find((d) => d.id === Number(value));
				}),
				takeUntil(this.destroy$)
			)
			.subscribe();
	}

	addFiles($event: Event) {
		const inputElement = $event.target as HTMLInputElement;
		const files = Array.from(inputElement.files);
		if (files.length > 0 && files.length <= 10 - this.filesUploaded.length) {
			let filePush: Array<File> = [];

			for (const file of files) {
				if (file.size <= 5000000) {
					const newFile = renameUniqueFileName(file, `${file.name}`);
					filePush = [...filePush, newFile];
				} else {
					this.toastr.error('File tải lên có dung lượng lớn hơn 5Mb');
					filePush = [];
					break;
				}
			}
			this.filesUploaded = [...this.filesUploaded].concat(
				filePush.map((file) => ({ name: file.name }))
			);
			const startIndex = this.filesUploaded.length - filePush.length;
			for (let i = startIndex; i < filePush.length + startIndex; i++) {
				this.uploadFile(i, filePush[i - startIndex]);
			}
		} else {
			this.toastr.error('Không được tải lên quá 10 file');
		}
		inputElement.value = null;
	}

	uploadFile(index: number, file: File) {
		this.filesUploadProgress[index] = 0;
		const formData = new FormData();
		formData.append('files', file);
		this.fileService
			.uploadFile(formData, EFileType.OTHER)
			.pipe(takeUntil(this.destroy$))
			.subscribe((event: any) => {
				if (event?.type === HttpEventType.UploadProgress) {
					this.filesUploadProgress[index] = Math.round((100 * event.loaded) / event.total);
				}
				if (event?.data) {
					this.filesUploaded[index].id = event.data[0].id;
					this.filesUploaded[index].url = event.data[0].url;
					this.filesUploaded[index].name = event.data[0].name;
				}
				this.cdr.detectChanges();
			});
	}

	removeFile(type: 'ALL' | 'ONE', id?: number) {
		if (type === 'ALL') {
			this.filesUploaded = [];
		} else {
			this.filesUploaded = [...this.filesUploaded].filter(
				(_, index) => this.filesUploaded.findIndex((f) => f.id === id) !== index
			);
		}
	}

	addImage($event, face?: EFace) {
		const inputElement = $event.target as HTMLInputElement;
		const files = Array.from(inputElement.files);

		if (files[0].size > 2000000) {
			this.toastr.error('Dung lượng ảnh quá lớn');
		}

		this.uploadImageFile(files[0], face);

		inputElement.value = null;
	}

	uploadImageFile(file: File, face?: EFace) {
		const formData = new FormData();
		formData.append('files', file);
		this.fileService
			.uploadFile(formData, EFileType.IMAGE)
			.pipe(takeUntil(this.destroy$))
			.subscribe((event: any) => {
				// if (event?.type === HttpEventType.UploadProgress) {

				// }
				if (event?.data) {
					if (face) {
						const existImageIndex = this.credentialImages.findIndex((ci) => ci.face === face);
						if (existImageIndex >= 0) {
							this.credentialImages[existImageIndex].id = event.data[0].id;
							this.credentialImages[existImageIndex].name = event.data[0].name;
							this.credentialImages[existImageIndex].url = event.data[0].url;
						} else {
							const credentialImage: IImage = {
								id: event.data[0].id,
								name: event.data[0].name,
								url: event.data[0].url,
								type: 'img',
								face
							};
							this.credentialImages = [...this.credentialImages, credentialImage];
						}
					} else {
						const avatarImage: IImage = {
							id: event.data[0].id,
							name: event.data[0].name,
							url: event.data[0].url,
							type: 'img',
							face: EFace.FRONT
						};
						this.avatarImage = avatarImage;
					}
				}
				this.cdr.detectChanges();
			});
	}

	onSubmit(): void {
		this.employeeForm.markAllAsTouched();
		if (this.employeeForm.invalid) {
			return;
		}

		const employeeFormValue = this.employeeForm.getRawValue() as IEmployeeInput;

		const dataEmployee: IEmployeeInput = {
			...employeeFormValue,
			department: {
				code: this.selectedDepartment.code,
				departmentType: this.selectedDepartment.departmentType
			},
			positions: {
				code: this.selectedPosition.code,
				departmentType: this.selectedDepartment.departmentType
			},
			province: {
				id: this.selectedProvince.id,
				name: this.selectedProvince.name
			},
			district: {
				id: this.selectedDistrict.id,
				name: this.selectedDistrict.name
			},
			ward: {
				id: this.selectedWard.id,
				name: this.selectedWard.name
			},
			dateOfBirth: convertDateToServer(employeeFormValue.dateOfBirth),
			dateRange: convertDateToServer(employeeFormValue.dateRange),
			attachmentRequests: this.filesUploaded.map((f) => f.id),
			avatar: this.avatarImage,
			credentialImages: this.credentialImages
		};

		if (!this.isUpdate) {
			this.employeeService.createEmployee(dataEmployee).subscribe(
				(res) => this.checkRes(res),
				(error: IError) => this.checkError(error)
			);
		} else {
			this.employeeService.updateEmployee(this.employeeId, dataEmployee).subscribe(
				(res) => this.checkRes(res),
				(error: IError) => this.checkError(error)
			);
		}
	}

	checkRes(res: DataResponse<any>) {
		if (res.data) {
			this.router.navigate(['/nhan-vien/danh-sach']);
		}
	}

	checkError(err: IError) {
		if (err.code) {
			const code = err.code;
			if (code === 'SUN-OIL-4854') {
				this.employeeForm.get('phone').setErrors({ existed: true });
			}
			if (code === 'SUN-OIL-4247') {
				this.employeeForm.get('email').setErrors({ existed: true });
			}
			if (code === 'SUN-OIL-4246') {
				this.employeeForm.get('identityCardNumber').setErrors({ existed: true });
			}
		}
	}
}
