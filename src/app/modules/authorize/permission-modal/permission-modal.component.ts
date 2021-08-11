import {
	ChangeDetectorRef,
	Component,
	Input,
	OnInit,
	ViewChild,
	ViewChildren
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbAccordion, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs/operators';
import { DataResponse } from 'src/app/shared/models/data-response.model';
import { IError } from 'src/app/shared/models/error.model';
import { DestroyService } from 'src/app/shared/services/destroy.service';
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
export class PermissionModalComponent implements OnInit {
	moduleAccordion: NgbAccordion;
	groupAccordions: Array<NgbAccordion>;

	@ViewChild('moduleAccordion', { static: false }) set module(element: NgbAccordion) {
		this.moduleAccordion = element;
	}

	@ViewChildren('groupAccordion') set group(elements: Array<NgbAccordion>) {
		this.groupAccordions = elements;
	}

	@Input() roleId: number;
	modules: Array<IModule> = [];
	modulesData: Array<ModuleData> = [];
	eMethod = EMethod;
	permissionForm: FormGroup;
	isUpdate = false;
	constructor(
		public modal: NgbActiveModal,
		private fb: FormBuilder,
		private permissionService: PermissionService,
		private cdr: ChangeDetectorRef,
		private toastr: ToastrService,
		private destroy$: DestroyService
	) {}

	ngOnInit(): void {
		this.permissionService
			.getModules()
			.pipe(takeUntil(this.destroy$))
			.subscribe((res) => {
				this.modules = res.data || [];
				this.modulesData = this.modules.map((m) => new ModuleData(m));
			});
		this.buildForm();
		if (this.roleId) {
			this.isUpdate = true;
		}
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
					(res) => this.closeModal(res),
					(err: IError) => this.checkError(err)
				);
		} else {
			this.permissionService
				.updateRole(this.roleId, this.convertPermissionData(this.modulesData))
				.pipe(takeUntil(this.destroy$))
				.subscribe(
					(res) => this.closeModal(res),
					(err: IError) => this.checkError(err)
				);
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

		const dataInput: IModuleInput = {
			name: this.permissionForm.get('name').value,
			groupFeature: Object.fromEntries(permissionData)
		};

		return dataInput;
	}

	closeModal(res: DataResponse<any>) {
		if (res.data) {
			this.modal.close(true);
		}
	}

	checkError(err: IError) {
		if (err.code === 'SUN-OIL-4179') {
			this.permissionForm.get('name').setErrors({ existed: true });
		}
	}

	onClose(): void {
		this.modal.close();
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
				break;
			case 'FEATURE':
				this.setPermissionFeature(checked, featureData);
				break;
		}
	}

	setPermissionModule(checked: boolean, moduleData: ModuleData) {
		if (checked) {
			moduleData.checked = true;
			moduleData.groups = moduleData.groups.map((g) => {
				g.checked = true;
				g.features = g.features.map((f) => {
					if (f.method !== EMethod.DELETE) {
						f.checked = true;
					}
					return f;
				});
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

	checkPermissionModule(moduleId: number) {
		const moduleData = this.modulesData.find((m) => m.id === moduleId);
		moduleData.checked = moduleData.groups.some((g) => g.checked);
	}

	setPermissionGroup(checked: boolean, groupData: GroupData) {
		if (checked) {
			groupData.checked = true;
			groupData.features = groupData.features.map((f) => {
				if (f.method !== EMethod.DELETE) {
					f.checked = true;
				}
				return f;
			});
		} else {
			groupData.checked = false;
			groupData.features = groupData.features.map((f) => ({ ...f, checked: false }));
		}
		this.checkPermissionModule(groupData.moduleId);
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
