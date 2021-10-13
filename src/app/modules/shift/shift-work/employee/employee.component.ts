import { CheckAllPipe } from './check-all.pipe';
import {
	Component,
	EventEmitter,
	Input,
	OnChanges,
	Output,
	ChangeDetectorRef,
	OnInit
} from '@angular/core';
import { IEmployee } from './../../shift.service';

export type EmployeeCheck = {
	status: 'checkall' | 'uncheckall' | 'singlecheck';
	data: number[];
};
class EmployeeCheckBox implements IEmployee {
	id: number;
	code: string;
	name: string;
	isChecked: boolean;
}

@Component({
	selector: 'app-employee',
	templateUrl: './employee.component.html',
	styleUrls: ['./employee.component.scss'],
	providers: [CheckAllPipe]
})
export class EmployeeComponent implements OnInit {
	@Input() employees: IEmployee[];
	@Output() selectedEmployeeChange = new EventEmitter<EmployeeCheck>();
	employeesDisplay: EmployeeCheckBox[];

	constructor(private cdr: ChangeDetectorRef, private checkAllPipe: CheckAllPipe) {}

	ngOnInit(): void {
		this.employeesDisplay = [...this.employees].map((employee) => ({
			...employee,
			isChecked: true
		}));
	}

	changeSelect(id: number) {
		const index = this.employeesDisplay.findIndex((employee) => employee.id === id);
		this.employeesDisplay[index].isChecked = !this.employeesDisplay[index].isChecked;
		const selectedLength = this.employeesDisplay?.filter((e) => e.isChecked)?.length || 0;
		if (selectedLength === 0) {
			this.emitEvent('uncheckall');
		} else if (selectedLength === this.employeesDisplay.length) {
			this.emitEvent('checkall');
		} else {
			this.emitEvent('singlecheck');
		}
	}

	changeSelectAll() {
		const isCheckAll = !this.employeesDisplay.some((employee) => !employee.isChecked);
		this.employeesDisplay = [...this.employeesDisplay].map((employee) => ({
			...employee,
			isChecked: !isCheckAll
		}));
		this.emitEvent(!isCheckAll ? 'checkall' : 'uncheckall');
	}

	emitEvent(status?: 'checkall' | 'uncheckall' | 'singlecheck') {
		return this.selectedEmployeeChange.emit({
			status,
			data: this.employeesDisplay?.filter((e) => e.isChecked)?.map((e) => e.id) || []
		});
	}
}
