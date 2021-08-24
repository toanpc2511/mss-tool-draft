import {
	AfterViewInit,
	ChangeDetectorRef,
	Component,
	OnInit,
	ViewChild,
	ViewChildren
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbAccordion } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { DataResponse } from 'src/app/shared/models/data-response.model';
import { IError } from 'src/app/shared/models/error.model';
import { DestroyService } from 'src/app/shared/services/destroy.service';
import { SubheaderService } from 'src/app/_metronic/partials/layout';
import {
	EMethod,
	FeatureData,
	GroupData,
	IModule,
	IModuleInput,
	ModuleData,
	PermissionService
} from '../permission.service';

@Component({
	selector: 'app-permission-modal',
	templateUrl: './permission-modal.component.html',
	styleUrls: ['./permission-modal.component.scss'],
	providers: [DestroyService, FormBuilder]
})
export class PermissionModalComponent implements OnInit, AfterViewInit {
	moduleAccordion: NgbAccordion;
	groupAccordions: Array<NgbAccordion>;

	@ViewChild('moduleAccordion', { static: false }) set module(element: NgbAccordion) {
		this.moduleAccordion = element;
	}

	@ViewChildren('groupAccordion') set group(elements: Array<NgbAccordion>) {
		this.groupAccordions = elements;
	}
	roleId: number;
	modules: Array<IModule> = [];
	modulesData: Array<ModuleData> = [];
	eMethod = EMethod;
	permissionForm: FormGroup;
	isUpdate = false;
	constructor(
		private fb: FormBuilder,
		private permissionService: PermissionService,
		private cdr: ChangeDetectorRef,
		private toastr: ToastrService,
		private router: Router,
		private subheader: SubheaderService,
		private activeRoute: ActivatedRoute,
		private destroy$: DestroyService
	) {}

	ngOnInit(): void {
		this.buildForm();
		this.activeRoute.queryParams
			.pipe(
				map((queryParams) => [queryParams.id, queryParams.roleName]),
				switchMap(([id, roleName]) => {
					if (id) {
						this.roleId = id;
						this.isUpdate = true;
						this.permissionForm.get('name').patchValue(roleName || null);
						return this.permissionService.getPermissionByRoleId(id);
					}
					if (this.activeRoute.routeConfig.path === 'sua-nhom-quyen') {
						this.router.navigate(['/phan-quyen']);
					}
					return of(null as DataResponse<ModuleData[]>);
				}),
				switchMap((res) => {
					if (!this.isUpdate) {
						return this.permissionService.getModules();
					} else {
						if (res?.data) {
							this.modulesData = res.data;
						}
					}
					return of(null as DataResponse<any>);
				}),
				takeUntil(this.destroy$)
			)
			.subscribe((res) => {
				if (res?.data) {
					this.modules = res.data || [];
					this.modulesData = this.modules.map((m) => new ModuleData(m));
				}
				this.cdr.detectChanges();
			});
	}

	ngAfterViewInit(): void {
		let subBreadcump = {
			title: 'Thêm nhóm quyền',
			linkText: 'Thêm nhóm quyền',
			linkPath: '/phan-quyen/them-nhom-quyen'
		};
		if (this.isUpdate) {
			subBreadcump = {
				title: 'Sửa nhóm quyền',
				linkText: 'Sửa nhóm quyền',
				linkPath: null
			};
		}
		setTimeout(() => {
			this.subheader.setBreadcrumbs([
				{
					title: 'Quản lý phân quyền',
					linkText: 'Quản lý phân quyền',
					linkPath: '/phan-quyen'
				},
				subBreadcump
			]);
		}, 1);
	}

	buildForm(): void {
		this.permissionForm = this.fb.group({
			name: [null, [Validators.required]]
		});
	}

	onSubmit(): void {
		this.permissionForm.markAllAsTouched();
		if (this.permissionForm.invalid) {
			return;
		}
		const isHasOnePermission = this.modulesData.some((m) => m.checked);
		if (!isHasOnePermission) {
			this.toastr.error('Không thể thêm nhóm quyền này vì chưa có chức năng nào được chọn');
			return;
		}

		if (!this.isUpdate) {
			this.permissionService
				.createRole(this.convertPermissionData(this.modulesData))
				.pipe(takeUntil(this.destroy$))
				.subscribe(
					(res) => {
						this.navigateToList(res);
					},
					(err: IError) => this.checkError(err)
				);
		} else {
			this.permissionService
				.updateRole(this.roleId, this.convertPermissionData(this.modulesData))
				.pipe(takeUntil(this.destroy$))
				.subscribe(
					(res) => {
						this.navigateToList(res);
					},
					(err: IError) => this.checkError(err)
				);
		}
	}

	navigateToList(res: any) {
		if (res.data) {
			this.router.navigate(['/phan-quyen']);
		}
	}

	convertPermissionData(data: Array<ModuleData>): IModuleInput {
		const permissionData = new Map<string, Array<number>>();
		for (const module of data) {
			for (const group of module.groups) {
				let featureIds = [];
				for (const feature of group.features) {
					if (feature.checked) {
						featureIds = [...featureIds, feature.id];
					}
				}
				permissionData.set(group.id, featureIds);
			}
		}

		const name = this.permissionForm.get('name').value;
		const groupFeature = Object.fromEntries(permissionData);
		return {
			name,
			groupFeature
		};
	}

	checkError(err: IError) {
		if (err.code === 'SUN-OIL-4131') {
			this.permissionForm.get('name').setErrors({ existed: true });
		}
		this.cdr.detectChanges();
	}

	permissionChange(
		$event: Event,
		moduleId: number,
		type: 'MODULE' | 'GROUP' | 'FEATURE',
		groupId?: string,
		featureId?: number
	) {
		const checked = ($event.target as HTMLInputElement).checked;
		const moduleData = this.modulesData.find((m) => m.id === moduleId);
		const groupData = moduleData.groups.find((g) => g.id === groupId);
		const featureData = groupData?.features.find((f) => f.id === featureId);
		switch (type) {
			case 'MODULE':
				this.setPermissionModule(checked, moduleData);
				break;
			case 'GROUP':
				this.setPermissionGroup(checked, groupData);
				this.checkPermissionModule(moduleData);
				break;
			case 'FEATURE':
				this.setPermissionFeature(checked, featureData);
				this.checkPermissionGroup(groupData);
				this.checkPermissionModule(moduleData);
				break;
		}
	}

	setPermissionModule(checked: boolean, moduleData: ModuleData) {
		if (checked) {
			moduleData.checked = true;
			moduleData.groups = moduleData.groups.map((g) => {
				g.checked = true;
				g.features = this.checkAllFeatureWithGroup(g);
				return g;
			});
		} else {
			moduleData.checked = false;
			moduleData.groups = moduleData.groups.map((g) => {
				g.checked = false;
				g.features = g.features.map((f) => ({ ...f, checked: false }));
				return g;
			});
		}
	}

	checkPermissionModule(moduleData: ModuleData) {
		moduleData.checked = moduleData.groups.some((g) => g.checked);
	}

	setPermissionGroup(checked: boolean, groupData: GroupData) {
		if (checked) {
			groupData.checked = true;
			groupData.features = this.checkAllFeatureWithGroup(groupData);
		} else {
			groupData.checked = false;
			groupData.features = groupData.features.map((f) => ({ ...f, checked: false }));
		}
	}

	checkAllFeatureWithGroup(groupData: GroupData): FeatureData[] {
		return groupData.features.map((f) => {
			if (f.method !== EMethod.DELETE) {
				f.checked = true;
			}
			return f;
		});
	}

	checkPermissionGroup(groupData: GroupData) {
		groupData.checked = groupData.features.some((f) => f.checked);
		if (groupData.checked) {
			for (const feature of groupData.features) {
				if (feature.method === EMethod.GET) {
					feature.checked = true;
				}
			}
		}
	}

	setPermissionFeature(checked: boolean, featureData: FeatureData) {
		featureData.checked = checked;
	}

	isOpenModule(moduleId) {
		return this.moduleAccordion && this.moduleAccordion.activeIds.includes(moduleId);
	}

	isOpenGroup(groupId) {
		return (
			this.groupAccordions?.length > 0 &&
			this.groupAccordions.some((ga) => ga.activeIds.includes(groupId))
		);
	}
}
