import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GasStationService, IInfoBarem } from '../../../gas-station.service';
import { takeUntil } from 'rxjs/operators';
import { DestroyService } from '../../../../../shared/services/destroy.service';

@Component({
  selector: 'app-setting-barem',
  templateUrl: './setting-barem.component.html',
  styleUrls: ['./setting-barem.component.scss'],
  providers: [DestroyService]
})
export class SettingBaremComponent implements OnInit {
  @Input() data: IDataTransfer;
  dataSource: IInfoBarem;

  constructor(
    public modal: NgbActiveModal,
    private gasStationService: GasStationService,
    private cdr: ChangeDetectorRef,
    private destroy$: DestroyService
    ) { }

  ngOnInit(): void {
    this.gasStationService.getInfoBarem(this.data.gasBinId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res.data) {
          this.dataSource = res.data;
          this.cdr.detectChanges();
        }
      });
  }

  onSubmit() {
    console.log('lưu');
  }

}

export interface IDataTransfer {
  title: string;
  gasBinId: number;
}
