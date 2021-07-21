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
    private toastr: ToastrService,
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
        description: [null],
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

    const codeControl = this.pumpPoleForm.get('code');
    codeControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      if (codeControl.hasError('existed')) {
        codeControl.setErrors({ existed: null });
      }
    });

    const nameControl = this.pumpPoleForm.get('name');
    nameControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      if (nameControl.hasError('existed')) {
        nameControl.setErrors({ existed: null });
      }
    });
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
    this.gasStationService
      .createPumpPole(pumpPoleData)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          this.modal.close(res);
          this.toastr.success('Thành công');
        },
        (err: IError) => {
          this.checkError(err);
        }
      );
  }

  checkError(error) {
    switch (error.code) {
      case 'SUN-OIL-4240':
        this.pumpPoleForm.get('code').setErrors({ existed: true });
        break;
      case 'SUN-OIL-4241':
        this.pumpPoleForm.get('name').setErrors({ existed: true });
        break;
    }
  }
}
