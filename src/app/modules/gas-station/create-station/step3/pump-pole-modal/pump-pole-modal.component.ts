import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs/operators';
import { IError } from 'src/app/shared/models/error.model';
import { DestroyService } from 'src/app/shared/services/destroy.service';
import { TValidators } from 'src/app/shared/validators';
import { GasStationService, IPumpPole, IPumpPoleInput } from '../../../gas-station.service';

@Component({
  selector: 'app-pump-pole-modal',
  templateUrl: './pump-pole-modal.component.html',
  styleUrls: ['./pump-pole-modal.component.scss'],
  providers: [DestroyService]
})
export class PumpPoleModalComponent implements OnInit {
  @Input() data: IPumpPole;
  pumpPoleForm: FormGroup;
  isUpdate = false;
  constructor(
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    private gasStationService: GasStationService,
    private destroy$: DestroyService
  ) {}

  ngOnInit(): void {
    if (!this.data) {
      this.pumpPoleForm = this.fb.group({
        code: [
          'SC',
          Validators.compose([
            Validators.required,
            TValidators.patternNotWhiteSpace(/^[A-Za-z0-9]*$/)
          ])
        ],
        description: [''],
        name: [null, Validators.compose([Validators.required])],
        status: 'ACTIVE'
      });
    } else {
      this.isUpdate = true;
      this.pumpPoleForm = this.fb.group({
        code: [
          this.data.code,
          Validators.compose([
            Validators.required,
            TValidators.patternNotWhiteSpace(/^[A-Za-z0-9]*$/)
          ])
        ],
        description: [this.data.description],
        name: [this.data.name, Validators.compose([Validators.required])],
        status: [this.data.status]
      });
    }
  }

  submit() {
    this.pumpPoleForm.markAllAsTouched();
    if (this.pumpPoleForm.invalid) {
      return;
    }
    const pumpPoleData: IPumpPoleInput = {
      code: this.pumpPoleForm.controls.code.value,
      gasStationId: this.gasStationService.gasStationId,
      description: this.pumpPoleForm.controls.description.value,
      name: this.pumpPoleForm.controls.name.value,
      status: this.pumpPoleForm.controls.status.value
    };
    if (!this.isUpdate) {
      this.gasStationService
        .createPumpPole(pumpPoleData)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (res) => {
            this.modal.close(res);
          },
          (err: IError) => {
            this.checkError(err);
          }
        );
    } else {
      this.gasStationService
        .updatePumpPole(this.data.id, pumpPoleData)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (res) => {
            this.modal.close(res);
          },
          (err: IError) => {
            this.checkError(err);
          }
        );
    }
  }

  checkError(error: IError) {
    switch (error.code) {
      case 'SUN-OIL-4108':
        this.pumpPoleForm.get('code').setErrors({ existed: true });
        break;
      case 'SUN-OIL-4109':
        this.pumpPoleForm.get('name').setErrors({ existed: true });
        break;
    }
  }
}
