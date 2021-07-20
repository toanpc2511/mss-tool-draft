import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs/operators';
import { DestroyService } from 'src/app/shared/services/destroy.service';
import { TValidators } from 'src/app/shared/validators';
import { GasStationService, IPumpPole, IPumpHoseInput } from '../../../gas-station.service';

@Component({
  selector: 'app-pump-hose-modal',
  templateUrl: './pump-hose-modal.component.html',
  styleUrls: ['./pump-hose-modal.component.scss'],
  providers: [DestroyService]
})
export class PumpHoseModalComponent implements OnInit {
  @Input() data: IPumpPole;
  pumpHoseForm: FormGroup;
  gasFields = [];
  pumpPoles = [];
  constructor(
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    private gasStationService: GasStationService,
    private toastr: ToastrService,
    private destroy$: DestroyService
  ) {}

  ngOnInit(): void {
    this.gasStationService
      .getPumpPolesByGasStation(1)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res.data) {
          this.pumpPoles = res.data;
        }
      });
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
      .subscribe((res) => {
        console.log(res);
        this.toastr.success('Thành công');
      });
  }
}
