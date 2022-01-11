import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { IMqttMessage, MqttConnectionState, MqttService } from 'ngx-mqtt';
import { ToastrService } from 'ngx-toastr';
import { error } from 'protractor';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pump-hose-operation',
  templateUrl: './pump-hose-operation.component.html',
  styleUrls: ['./pump-hose-operation.component.scss']
})
export class PumpHoseOperationComponent implements OnInit, OnDestroy {
  dataSource;
  msg;
  subscription: Subscription;

  constructor(
    private mqttService: MqttService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.mqttService.onConnect
      .subscribe((connack) => {
        this.toastr.success('Kết nối thành công!');
        this.cdr.checkNoChanges()
      }, () => this.toastr.error('Kết nối thất bại'));

    this.getData();
  }

  getData() {
    this.subscription = this.mqttService.observe('sunoil/tram1')
      .subscribe((message: IMqttMessage) => {
        this.msg = new TextDecoder('utf-8').decode(message.payload);
        this.cdr.detectChanges()
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
