import {
	Component,
	EventEmitter,
	Input,
	OnChanges,
	Output,
	ChangeDetectorRef
} from '@angular/core';
import { IEmployee } from './../../shift.service';

class EmployeeCheckBox implements IEmployee {
	id: number;
	code: string;
	name: string;
	isChecked: boolean;
}

@Component({
	selector: 'app-employee',
	templateUrl: './employee.component.html',
	styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnChanges {
	@Input() employees: IEmployee[];
	@Output() selectedEmployeeChange = new EventEmitter<number[]>();
	employeesDisplay: EmployeeCheckBox[];

	constructor(private cdr: ChangeDetectorRef) {}

	ngOnChanges(): void {
		this.employeesDisplay = [...this.employees].map((employee) => ({
			...employee,
			isChecked: true
		}));
		this.emitEvent();
	}

	changeSelect(id: any) {
		const index = this.employeesDisplay.findIndex((employee) => employee.id === id);
		this.employeesDisplay[index].isChecked = !this.employeesDisplay[index].isChecked;
		this.emitEvent();
	}
	changeSelectAll() {
		const isCheckAll = !this.employeesDisplay.some((employee) => !employee.isChecked);
		this.employeesDisplay = [...this.employeesDisplay].map((employee) => ({
			...employee,
			isChecked: !isCheckAll
		}));
		this.emitEvent();
	}

	emitEvent() {
		return this.selectedEmployeeChange.emit(this.employeesDisplay.map((e) => e.id));
	}
}
