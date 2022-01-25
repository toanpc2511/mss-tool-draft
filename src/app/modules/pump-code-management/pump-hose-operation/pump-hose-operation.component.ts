import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { IMqttMessage, MqttConnectionState, MqttService } from 'ngx-mqtt';
import { ToastrService } from 'ngx-toastr';
import { error } from 'protractor';
import { Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import {
  InventoryManagementService,
  IStationActiveByToken
} from '../../inventory-management/inventory-management.service';
import { DestroyService } from '../../../shared/services/destroy.service';
import { IPumpCode, PumpCodeManagementService } from '../pump-code-management.service';

@Component({
  selector: 'app-pump-hose-operation',
  templateUrl: './pump-hose-operation.component.html',
  styleUrls: ['./pump-hose-operation.component.scss'],
  providers: [DestroyService]
})
export class PumpHoseOperationComponent implements OnInit, OnDestroy {
  dataSource;
  msg;
  subscription: Subscription;
  listStation: IStationActiveByToken[] = []
  station = new FormControl('');
  pumpCodes: IPumpCode[] = [];

  constructor(
    private mqttService: MqttService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    private inventoryMSv: InventoryManagementService,
    private pumpCodeMSv: PumpCodeManagementService,
    private destroy$: DestroyService,
  ) {}

  ngOnInit(): void {
    this.mqttService.onConnect
      .subscribe((connack) => {
        this.toastr.success('Kết nối thành công!');
        this.cdr.checkNoChanges()
      }, () => this.toastr.error('Kết nối thất bại'));
    this.getListStation();
    this.getPumpCode('');
    this.changestation();
    this.getData('');
  }

  changestation() {
    this.station.valueChanges.subscribe((value: string) => {
      this.getData(value);
      this.getPumpCode(value);
    })
  }

  getPumpCode(stationValue: string) {
    this.pumpCodeMSv.getPumpCode(stationValue)
      .subscribe((res) => {
        if (res) {
          this.pumpCodes = res.data;
          this.cdr.detectChanges();
        }
      })
  }

  getData(station: string) {
    let topic = '';
    topic = !station ? topic = 'sunoil/pub/#' : topic = `sunoil/pub/${station}/#`
    this.subscription = this.mqttService.observe(topic)
      .subscribe((message: IMqttMessage) => {
        this.msg = new TextDecoder('utf-8').decode(message.payload);
        // console.log(this.msg);
        console.log(JSON.parse(this.msg));
        this.cdr.detectChanges()
      });
  }

  getListStation() {
    this.inventoryMSv
      .getStationByToken('ACTIVE', 'false')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.listStation = res.data;
        this.cdr.detectChanges();
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
