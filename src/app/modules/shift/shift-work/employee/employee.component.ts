import { Component, EventEmitter, Input, OnChanges, Output, ChangeDetectorRef } from '@angular/core';
import { IEmployee } from './../../shift.service';

@Component({
	selector: 'app-employee',
	templateUrl: './employee.component.html',
	styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnChanges {
	@Input() employees: IEmployee[];
	@Output() selectedEmployeeChange = new EventEmitter<IEmployee[]>();
	employeesDisplay: any[];

	constructor(private cdr: ChangeDetectorRef) {}

	ngOnChanges(): void {
		this.employeesDisplay = [...this.employees].map((employee) => ({
			...employee,
			isChecked: false
		}));
	}

	changeSelect(id: any) {
		const index = this.employeesDisplay.findIndex((employee) => employee.id === id);
		this.employeesDisplay[index].isChecked = !this.employeesDisplay[index].isChecked;
	}
	changeSelectAll() {
		const isCheckAll = !this.employeesDisplay.some((employee) => !employee.isChecked);
		this.employeesDisplay = [...this.employeesDisplay].map((employee) => ({
			...employee,
			isChecked: !isCheckAll
		}));
	}
}
