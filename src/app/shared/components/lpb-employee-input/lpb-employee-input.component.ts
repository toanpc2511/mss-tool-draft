import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormHelpers } from 'src/app/shared/utilites/form-helpers';
import { HttpService } from '../../services/http.service';
import { environment } from 'src/environments/environment';
import { DataResponse } from '../../models/data-response.model';

@Component({
  selector: 'app-lpb-employee-input',
  templateUrl: './lpb-employee-input.component.html',
  styleUrls: ['./lpb-employee-input.component.scss'],
})
export class LpbEmployeeInputComponent implements OnInit {
  employeeName: string;
  @Input() control = new FormControl();
  @Input() serviceName: string = 'deposit-service';
  private serviceRoute = `${environment.apiUrl}/deposit-service`;

  FORM_VAL_ERRORS = {
    REQUIRED: 'required',
    NO_EXIST: 'noExist',
  };

  constructor(private httpService: HttpService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.serviceName){
      this.serviceRoute = `${environment.apiUrl}/${this.serviceName}`;
    }
  }

  ngOnInit() {
    setTimeout(() => {
      const value = this.control.value;
      if (value) {
        if (value === this.userInfo.employeeId) {
          this.employeeName = this.userInfo.fullName;
        } else {
          this.getEmployeeInfo(value);
        }
      }
    })

    this.control.valueChanges.subscribe((value) => {
      if (value && this.control.disabled) {
        this.getEmployeeInfo(value);
      }
    });
  }

  get userInfo(): any {
    try {
      return JSON.parse(localStorage.getItem('userInfo'));
    } catch (error) {
      return null;
    }
  }

  getEmployeeInfo(employeeId: string, ignoreError: boolean = false): void {
    const handleError = (error?) => {
      if (!ignoreError) {
        this.employeeName = null;
        FormHelpers.setFormError({
          control: this.control,
          errorName: this.FORM_VAL_ERRORS.NO_EXIST,
        });
      }
    };

    if (!employeeId) {
      handleError();
      return;
    }

    this.httpService
      .get(
        `${this.serviceRoute}/customer/getEmployeeName?employeeId=${employeeId}`,
        {}
      )
      .subscribe(
        (res: DataResponse<string>) => {
          if (res) {
            this.employeeName = res.data;
          } else {
            handleError();
          }
        },
        (error) => handleError(error),
        () => {}
      );
  }

  changeTellerCode(event: Event & { target: HTMLInputElement }) {
    const employeeId = event.target.value?.toString().trim();
    if (
      !this.control.hasError(this.FORM_VAL_ERRORS.REQUIRED) &&
      this.control.value
    ) {
      this.getEmployeeInfo(employeeId);
    }
  }

  onEmployeeIdInputChange(event: Event & { target: HTMLInputElement }) {
    const crrEmployeeID = event.target.value;
    if (!crrEmployeeID) {
      this.employeeName = null;
    }
  }
}
