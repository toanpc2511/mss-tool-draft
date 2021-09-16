import { HttpEventType } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { combineLatest, Observable, of } from 'rxjs';
import {
	catchError,
	concatMap,
	debounceTime,
	pluck,
	startWith,
	switchMap,
	takeUntil,
	tap
} from 'rxjs/operators';
import { NO_EMIT_EVENT } from 'src/app/shared/app-constants';
import { renameUniqueFileName } from 'src/app/shared/helpers/functions';
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

	avatarImage: IImage = {
		id: null,
		name: null,
		type: 'img',
		url: null,
		face: EFace.FRONT
	};
	credentialImages: IImage[] = [
		{
			id: null,
			name: null,
			type: 'img',
			url: null,
			face: EFace.FRONT
		},
		{
			id: null,
			name: null,
			type: 'img',
			url: null,
			face: EFace.BACK
		}
	];
	employeeForm: FormGroup;

	departments: IDepartment[] = [];
	positions: IPosition[] = [];
	stationAddress: IAddress[] = [];

	provinces: IProvince[] = [];
	districts: IDistrict[] = [];
	wards: IWard[] = [];

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
					this.employeeForm.get('wardId').reset(null, NO_EMIT_EVENT);
					if (provinceId) {
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
					this.wards = [];
					if (this.employeeForm.get('wardId').value) {
						this.employeeForm.get('wardId').reset();
					}
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
				[TValidators.required, TValidators.pattern(/^[0-9]{9}$|^[0-9]{12}$/)]
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
				switchMap((value: string) => this.employeeService.getPositionByDepartment(value)),
				tap((res) => {
					this.employeeForm.get('positionId').patchValue(null, NO_EMIT_EVENT);
					this.positions = res.data;
					this.cdr.detectChanges();
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
						const index = this.credentialImages.findIndex((ci) => ci.face === face);
						this.credentialImages[index].id = event.data[0].id;
						this.credentialImages[index].name = event.data[0].name;
						this.credentialImages[index].url = event.data[0].url;
					} else {
						this.avatarImage.id = event.data[0].id;
						this.avatarImage.name = event.data[0].name;
						this.avatarImage.url = event.data[0].url;
						console.log(this.avatarImage);
					}
				}
				this.cdr.detectChanges();
			});
	}

	onSubmit(): void {
		this.employeeForm.markAllAsTouched();
		console.log(this.employeeForm.getRawValue());

		if (!this.isUpdate) {
		} else {
		}
	}

	checkError(err: IError) {}
}
