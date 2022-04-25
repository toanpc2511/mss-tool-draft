import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { IMqttMessage, MqttConnectionState, MqttService } from 'ngx-mqtt';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { finalize, takeUntil } from 'rxjs/operators';
import {
  InventoryManagementService,
  IStationActiveByToken
} from '../../inventory-management/inventory-management.service';
import { DestroyService } from '../../../shared/services/destroy.service';
import { IDataConnectMqtt, IPumpCode, PumpCodeManagementService } from '../pump-code-management.service';

@Component({
  selector: 'app-pump-hose-operation',
  templateUrl: './pump-hose-operation.component.html',
  styleUrls: ['./pump-hose-operation.component.scss'],
  providers: [DestroyService]
})
export class PumpHoseOperationComponent implements OnInit, OnDestroy {
  listStation: IStationActiveByToken[] = [];
  station = new FormControl('');
  pumpCodes: IPumpCode[] = [];

  // topic: string;

  constructor(
    private mqttService: MqttService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    private inventoryMSv: InventoryManagementService,
    private pumpCodeMSv: PumpCodeManagementService,
    private destroy$: DestroyService
  ) {
    this.connectMqtt();
  }

  ngOnInit(): void {
    this.getListStation();
    this.getPumpCode('');
    this.changestation();
    this.checkConnectMqtt();
  }
  ngOnDestroy() {
    this.mqttService.disconnect(true)
  }

  connectMqtt() {
    this.mqttService.onConnect.pipe(finalize(() => {
    }), takeUntil(this.destroy$))
      .subscribe(() => {
        this.toastr.success('Kết nối thành công!');
        this.getDataMqtt();
        this.cdr.detectChanges();
      });
  }

  checkConnectMqtt() {
    this.mqttService.state.pipe(takeUntil(this.destroy$)).subscribe((s: MqttConnectionState) => {
      const status = s === MqttConnectionState.CONNECTED ? 'CONNECTED' : 'DISCONNECTED';
      if (s !== MqttConnectionState.CONNECTED) {
        this.toastr.error(`Kết nối thất bại!`);
      }
    });
  }

  getDataMqtt(station?: string) {
    const topic = !station ? 'sunoil/pub/#' : `sunoil/pub/${station}/#`;
    this.mqttService.observe(topic).pipe(takeUntil(this.destroy$))
      .subscribe((message: IMqttMessage) => {
        const msg = new TextDecoder('utf-8').decode(message.payload);
        this.bindData(JSON.parse(msg));
        this.cdr.detectChanges();
      });
  }

  bindData(dataMqtt: any[]) {
    dataMqtt.forEach((stationMqttData: any[]) => {
      stationMqttData.forEach((pumpPole: IDataConnectMqtt) => {
        const a = this.pumpCodes.find((x) => x.stationCodeChip === pumpPole.station && x.pumpHoseCodeChip === pumpPole.slave);
        a.statusPump = pumpPole.statusPump;
        a.valuePumped = Number(pumpPole.valuePumped / 1000).toLocaleString('en-US');
        a.moneyPumped = a.unitPrice * pumpPole.valuePumped / 1000;
        a.totalCumulativeLitersChip = pumpPole.totalCumulativeLiters?.toLocaleString('en-US');
        a.totalAmountAccumulatedChip = pumpPole.totalAmountAccumulated?.toLocaleString('en-US');
      });
    });
  }

  changestation() {
    this.station.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value: string) => {
      this.getPumpCode(value);
      this.getDataMqtt(value);
    });
  }

  getPumpCode(stationValue: string) {
    this.pumpCodeMSv.getPumpCode(stationValue).pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res) {
          this.pumpCodes = res.data;
          this.pumpCodes.map(x => {
            x.statusPump = 0;
            x.valuePumped = 0;
            x.moneyPumped = 0;
            x.totalCumulativeLitersChip = x.totalCumulativeLiters?.toLocaleString('en-US') || 0;
            x.totalAmountAccumulatedChip = x.totalAmountAccumulated?.toLocaleString('en-US') || 0;
          });
          this.cdr.detectChanges();
        }
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
}
