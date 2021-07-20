import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { takeUntil } from 'rxjs/operators';
import { DestroyService } from 'src/app/shared/services/destroy.service';
import { TValidators } from 'src/app/shared/validators';
import { GasStationService, IPumpPole, IPumpPoleCreate } from '../../../gas-station.service';

@Component({
  selector: 'app-pump-hose-modal',
  templateUrl: './pump-hose-modal.component.html',
  styleUrls: ['./pump-hose-modal.component.scss'],
  providers: [DestroyService]
})
export class PumpHoseModalComponent implements OnInit {
  @Input() data: IPumpPole;
  pumpPoleForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    private gasStationService: GasStationService,
    private destroy$: DestroyService
  ) {}

  ngOnInit(): void {
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
  }

  submit() {
    this.pumpPoleForm.markAllAsTouched();
    if (this.pumpPoleForm.invalid) {
      return;
    }
    const pumpPoleData: IPumpPoleCreate = {
      code: this.pumpPoleForm.controls.code.value,
      gasStationId: this.gasStationService.gasStationId,
      description: this.pumpPoleForm.controls.description.value,
      name: this.pumpPoleForm.controls.name.value,
      status: this.pumpPoleForm.controls.status.value
    };
    this.gasStationService
      .createPumpPole(pumpPoleData)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        console.log(res);
      });
  }
}
