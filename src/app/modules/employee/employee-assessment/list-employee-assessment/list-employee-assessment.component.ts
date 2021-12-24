import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { takeUntil, tap } from 'rxjs/operators';
import { InventoryManagementService } from '../../../inventory-management/inventory-management.service';
import { DestroyService } from '../../../../shared/services/destroy.service';
import { IStationActiveByToken } from '../models/station-active-by-token.interface';
import { DataResponse } from '../../../../shared/models/data-response.model';
import { EmployeeService, IEmployee } from '../../employee.service';
import * as moment from 'moment';
import { IEmployeeAssessment } from '../models/employee-assessment.interface';
import { IPaginatorState, PaginatorState } from '../../../../_metronic/shared/crud-table';
import { ShiftService } from '../../../shift/shift.service';
import { FileService } from '../../../../shared/services/file.service';

@Component({
  selector: 'app-list-employee-assessment',
  templateUrl: './list-employee-assessment.component.html',
  styleUrls: ['./list-employee-assessment.component.scss'],
  providers: [DestroyService]
})
export class ListEmployeeAssessmentComponent implements OnInit {

  searchForm: FormGroup;
  listStationByToken: IStationActiveByToken[];
  listEmployee: IEmployee[];
  employeeAssessment: IEmployeeAssessment;
  today: string;
  paginatorState = new PaginatorState();

  constructor(private fb: FormBuilder,
              private inventoryManagementService: InventoryManagementService,
              private destroy$: DestroyService,
              private cdr: ChangeDetectorRef,
              private employeeService: EmployeeService,
              private shiftService: ShiftService,
              private fileService: FileService
  ) { }

  ngOnInit(): void {
    this.today = moment().format('DD/MM/YYYY');
    this.initSearchForm();
    this.getEmployee();
    this.getStationToken();
    this.getEmployeeAssessment();
  }

  initSearchForm(): void {
    this.searchForm = this.fb.group({
      stationId: [null],
      employeeId: [null],
      dateFrom: [null],
      dateTo: [null],
    });
    this.initDate();
  }

  onSearch(): void {
    this.validateDate();
    if (!this.searchForm.invalid) {
      this.getEmployeeAssessment();
    }
  }

  onReset(): void {
    this.searchForm.reset();
    this.initDate();
    this.getEmployee();
    this.getEmployeeAssessment();
  }

  initDate(): void {
    this.searchForm.get('dateFrom').patchValue(this.today);
    this.searchForm.get('dateTo').patchValue(this.today);
  }

  validateDate(): void {
    const timeStart = new Date(
      moment(this.searchForm.get('dateFrom').value, 'DD/MM/YYYY').format('MM/DD/YYYY')
    );
    const timeEnd = new Date(
      moment(this.searchForm.get('dateTo').value, 'DD/MM/YYYY').format('MM/DD/YYYY')
    );

    if (timeStart > timeEnd) {
      this.searchForm.get('dateFrom').setErrors({ errorDateStart: true });
      this.searchForm.get('dateTo').setErrors({ errorDateEnd: true });
    } else {
      this.searchForm.get('dateFrom').setErrors(null);
      this.searchForm.get('dateTo').setErrors(null);
    }
  }

  getEmployeeAssessment(): void {
    const params = {
      page: this.paginatorState.page,
      size: this.paginatorState.pageSize,
      filter: this.searchForm.value
    }
    this.employeeService.getListEmployeeAssessment(params).subscribe((res: DataResponse<IEmployeeAssessment>) => {
      this.employeeAssessment = res.data;
      this.paginatorState.recalculatePaginator(res.data.totalElement);
      this.cdr.detectChanges();
    });
  }

  getStationToken() {
    this.inventoryManagementService
      .getStationByToken('NOT_DELETE', 'false')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: DataResponse<IStationActiveByToken[]>) => {
        this.listStationByToken = res.data;
        this.cdr.detectChanges();
      });
  }

  getEmployeeByStation() {
    this.shiftService.getEmployeesByStation(this.searchForm.get('stationId').value).subscribe((res: DataResponse<IEmployee[]>): void => {
      this.listEmployee = res.data;
      this.cdr.detectChanges();
    });
  }

  getEmployee(): void {
    this.employeeService
      .getAllEmployees()
      .subscribe((res: DataResponse<IEmployee[]>): void => {
        this.listEmployee = res.data;
        this.cdr.detectChanges();
      });
  }

  pagingChange($event: IPaginatorState): void {
    this.paginatorState = $event as PaginatorState;
    this.onSearch();
  }

  exportFileExcel(): void {
    const params = {
      filter: this.searchForm.value
    }

    this.employeeService.exportExcelEmployeeAssessment(params)
      .pipe(
        tap((res: DataResponse<string>) => {
          if (res) {
            this.fileService.downloadFromUrl(res.data);
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  getQueryParam(employeeId: number) {
    return {
      dateFrom: this.searchForm.get('dateFrom').value,
      dateTo: this.searchForm.get('dateTo').value,
      employeeId,
      stationId: this.searchForm.get('stationId').value || ''
    }
  }

}
