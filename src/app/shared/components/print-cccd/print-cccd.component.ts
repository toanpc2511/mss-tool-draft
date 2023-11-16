import {Component, Input, OnInit} from '@angular/core';
import {Cccd} from '../../../lpb-services/lpb-cccd-service/model/cccd.model';
import {UniStorageService} from '../../services/uni-storage.service';
import {UserModel} from '../../models/UserModel';

@Component({
  selector: 'app-print-cccd',
  templateUrl: './print-cccd.component.html',
  styleUrls: ['./print-cccd.component.scss']
})
export class PrintCccdComponent implements OnInit {
  @Input() cccd: Cccd;
  userInfo: UserModel;
  current = new Date();
  constructor(private uniStorageService: UniStorageService) {
  }

  ngOnInit(): void {
    this.userInfo = this.uniStorageService.getUserInfo();
    console.log(this.cccd.id, this.cccd);
  }

}
