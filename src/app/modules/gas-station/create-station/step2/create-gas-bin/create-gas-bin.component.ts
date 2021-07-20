import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LIST_STATUS } from 'src/app/shared/data-enum/list-status';

@Component({
  selector: 'app-create-gas-bin',
  templateUrl: './create-gas-bin.component.html',
  styleUrls: ['./create-gas-bin.component.scss']
})
export class CreateGasBinComponent implements OnInit {
  @Input() data: any;
  gasBinForm: FormGroup;
  listStatus = LIST_STATUS;

  constructor(private fb: FormBuilder, public modal: NgbActiveModal) {}

  ngOnInit(): void {
    this.gasBinForm = this.initForm();
  }

  initForm() {
    const CODE_REGEX = '^[A-Za-z0-9]*$';
    return this.fb.group({
      code: ['SB', [Validators.required, Validators.pattern(CODE_REGEX)]],
      name: [null, [Validators.required]],
      capacity: [null, [Validators.required]],
      height: [null, [Validators.required]],
      length: [null, [Validators.required]],
      description: [null, [Validators.required]],
      productName: [null, [Validators.required]],
      status: [this.listStatus.ACTIVE]
    });
  }

  onSubmit() {
    this.gasBinForm.markAllAsTouched();
  }
}
