import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs/operators';
import { IError } from 'src/app/shared/models/error.model';
import { DestroyService } from 'src/app/shared/services/destroy.service';
import { TValidators } from 'src/app/shared/validators';
import {
  GasStationService,
  IPumpPole,
  IPumpHoseInput,
  GasBinResponse,
  IPumpHose
} from '../../../gas-station.service';

@Component({
  selector: 'app-pump-hose-modal',
  templateUrl: './pump-hose-modal.component.html',
  styleUrls: ['./pump-hose-modal.component.scss'],
  providers: [DestroyService]
})
export class PumpHoseModalComponent implements OnInit {
  @Input() data: IPumpHose;
  pumpHoseForm: FormGroup;
  gasFields: Array<GasBinResponse>;
  pumpPoles: Array<IPumpPole>;
  constructor(
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    private gasStationService: GasStationService,
    private destroy$: DestroyService
  ) {
    this.pumpPoles = [];
    this.gasFields = [];
  }

  ngOnInit(): void {
    this.gasStationService
      .getPumpPolesByGasStation(this.gasStationService.gasStationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res.data) {
          this.pumpPoles = res.data.filter((pumpPole) => pumpPole.status === 'ACTIVE');
        }
      });
    this.gasStationService
      .getListGasBin(this.gasStationService.gasStationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res.data) {
          this.gasFields = res.data.filter((gasField) => gasField.status === 'ACTIVE');
        }
      });
    if (!this.data) {
      this.pumpHoseForm = this.fb.group({
        code: [
          'SV',
          Validators.compose([
            Validators.required,
            TValidators.patternNotWhiteSpace(/^[A-Za-z0-9]*$/)
          ])
        ],
        name: [null, Validators.compose([Validators.required])],
        gasFieldId: [null, Validators.compose([Validators.required])],
        pumpPoleId: [null, Validators.compose([Validators.required])],
        description: [null],
        status: 'ACTIVE'
      });
    } else {
      this.pumpHoseForm = this.fb.group({
        code: [
          this.data.code,
          Validators.compose([
            Validators.required,
            TValidators.patternNotWhiteSpace(/^[A-Za-z0-9]*$/)
          ])
        ],
        name: [this.data.name, Validators.compose([Validators.required])],
        gasFieldId: [this.data.gasField.id, Validators.compose([Validators.required])],
        pumpPoleId: [this.data.pumpPole.id, Validators.compose([Validators.required])],
        description: [this.data.description],
        status: this.data.status
      });
    }
  }

  submit() {
    this.pumpHoseForm.markAllAsTouched();
    if (this.pumpHoseForm.invalid) {
      return;
    }
    const pumpHoseData: IPumpHoseInput = {
      code: this.pumpHoseForm.controls.code.value,
      gasFieldId: this.pumpHoseForm.controls.gasFieldId.value,
      pumpPoleId: this.pumpHoseForm.controls.pumpPoleId.value,
      description: this.pumpHoseForm.controls.description.value,
      name: this.pumpHoseForm.controls.name.value,
      status: this.pumpHoseForm.controls.status.value
    };
    this.gasStationService
      .createPumpHose(pumpHoseData)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          if (res.data) {
            this.modal.close(res.data);
          }
        },
        (err: IError) => {
          this.checkError(err);
        }
      );
  }

  checkError(error) {
    switch (error.code) {
      case 'SUN-OIL-4502':
        this.pumpHoseForm.get('code').setErrors({ existed: true });
        break;
      case 'SUN-OIL-4503':
        this.pumpHoseForm.get('name').setErrors({ existed: true });
        break;
    }
  }
}
