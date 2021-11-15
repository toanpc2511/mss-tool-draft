import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-setting-barem',
  templateUrl: './setting-barem.component.html',
  styleUrls: ['./setting-barem.component.scss']
})
export class SettingBaremComponent implements OnInit {
  dataSource = [];

  constructor(
    public modal: NgbActiveModal,
    ) { }

  ngOnInit(): void {
    console.log('aư');
  }

  onSubmit() {
    console.log('lưu');
  }

}
