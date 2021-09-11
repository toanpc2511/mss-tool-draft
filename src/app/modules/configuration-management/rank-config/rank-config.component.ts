import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { NgbAccordion } from '@ng-bootstrap/ng-bootstrap';
import { DestroyService } from '../../../shared/services/destroy.service';
import { ConfigurationManagementService } from '../configuration-management.service';
import { takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
	selector: 'app-rank-config',
	templateUrl: './rank-config.component.html',
	styleUrls: ['./rank-config.component.scss'],
	providers: [DestroyService, FormBuilder]
})
export class RankConfigComponent implements OnInit {
	permissionForm: FormGroup;
	moduleAccordion: NgbAccordion;
	groupAccordions: Array<NgbAccordion>;
	configRankFormArray: FormArray = new FormArray([]);
	arrayLength = [];

	@ViewChild('moduleAccordion', { static: false }) set module(element: NgbAccordion) {
		this.moduleAccordion = element;
	}

	constructor(
		private fb: FormBuilder,
		private configManagement: ConfigurationManagementService,
		private cdr: ChangeDetectorRef,
		private destroy$: DestroyService,
		private toastr: ToastrService
	) {}

	ngOnInit(): void {
		this.getListRank();
	}

	getListRank() {
		this.configManagement.getListRank().subscribe((res) => {
			this.configRankFormArray = this.fb.array(
				res.data.map((x) => {
					this.arrayLength.push({
						policy: x.policy.length,
						introduction: x.introduction.length,
						promotion: x.promotion.length
					});
					return this.fb.group({
						id: [x.id],
						name: [x.name],
						score: [x.score],
						introduction: [x.introduction],
						policy: [x.policy],
						promotion: [x.promotion]
					});
				})
			);
			this.cdr.detectChanges();
		});
	}

	onSubmit() {
		const req = {
			rankRequests: this.configRankFormArray.value
		};
		this.configManagement
			.updateRankConfig(req)
			.pipe(takeUntil(this.destroy$))
			.subscribe((res) => {
				if (res.data) {
					this.toastr.success('Lưu thông tin thành công');
				}
			});
	}

	cancel() {
		this.getListRank();
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

	autoGrowTextZone(e) {
		e.target.style.height = 'auto';
		e.target.style.height = e.target.scrollHeight + 10 + 'px';
	}
}
