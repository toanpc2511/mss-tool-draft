import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pump-pole-modal',
  templateUrl: './pump-pole-modal.component.html',
  styleUrls: ['./pump-pole-modal.component.scss']
})
export class PumpPoleModalComponent implements OnInit {
  @Input() data: any;
  isLoading$;
  constructor(private fb: FormBuilder, public modal: NgbActiveModal) {}

  ngOnInit(): void {
    console.log(this.data);
  }
}
