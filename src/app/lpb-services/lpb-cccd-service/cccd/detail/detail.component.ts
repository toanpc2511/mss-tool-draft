import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CustomNotificationService} from '../../../../shared/services/custom-notification.service';
import {CccdServiceService} from '../../services/cccd-service.service';
import {ICccd} from '../../model/cccd.model';
import {ActionModel} from '../../../../shared/models/ActionModel';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  cccd: ICccd | null = null;
  actions: ActionModel[] = [
    {
      actionName: 'Print',
      actionIcon: 'print',
      actionClick: () => this.onPrint(),
    }
  ];
  constructor(private route: ActivatedRoute,
              private customNotificationService: CustomNotificationService,
              private cccdServiceService: CccdServiceService) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params.id) {
        this.onFetch(params.id);
      }
    });
  }

  onFetch(id): void {

    // let infoMessage = '';
    this.cccdServiceService.getById(id).subscribe(
      (res) => {
        const data = {
          ...res.data
        };
        console.log('detail', data);
        this.cccd = data;
      },
      (error) => {
        this.customNotificationService.error('Lỗi', error?.message);
      },
      () => {
        // this.customNotificationService.success('Thông báo', infoMessage);
      }
    );
  }

  onPrint(): void {
    window.print();
  }

  previousState(): void {
    window.history.back();
  }

}
