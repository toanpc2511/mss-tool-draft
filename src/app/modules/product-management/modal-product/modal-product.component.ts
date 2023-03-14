import { DATA_CATEGORY } from './../../../shared/contants/contants';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-modal-product',
  templateUrl: './modal-product.component.html',
  styleUrls: ['./modal-product.component.scss']
})
export class ModalProductComponent implements OnInit {
  @Input() data: any;

  categorys: any[] = DATA_CATEGORY;

  dataForm: FormGroup;

  constructor(private fb: FormBuilder, public modal: NgbActiveModal) {
    this.initForm();
  }

  initForm() {
    this.dataForm = this.fb.group({
      type: ['', [Validators.required]],
      name: ['', [Validators.required]],
      code: ['', [Validators.required]],
      prefix: ['', [Validators.required]],
      prefixx: [{ value: '', disabled: true }, [Validators.required]]
    });
  }

  ngOnInit(): void {
    console.log(this.data);
    if (this.data) {
      this.dataForm.patchValue({
        name: this.data.name,
        code: this.data.code
      });

      this.dataForm.get('code').disable();
    }
  }

  onSubmit() {
    this.dataForm.markAllAsTouched();
    if (this.dataForm.invalid) return;
    console.log(this.dataForm.getRawValue());
    // this.modal.close(true);
  }

  onReset() {
    this.dataForm.reset();
    // this.initForm();
  }
}
