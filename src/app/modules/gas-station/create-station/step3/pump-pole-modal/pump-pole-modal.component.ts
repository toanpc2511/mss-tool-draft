import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { takeUntil } from 'rxjs/operators';
import { DestroyService } from 'src/app/shared/services/destroy.service';
import { GasStationService, IPumpPole, IPumpPoleCreate } from '../../../gas-station.service';

@Component({
  selector: 'app-pump-pole-modal',
  templateUrl: './pump-pole-modal.component.html',
  styleUrls: ['./pump-pole-modal.component.scss'],
  providers: [DestroyService]
})
export class PumpPoleModalComponent implements OnInit {
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
      code: ['SC', Validators.compose([Validators.required])],
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
