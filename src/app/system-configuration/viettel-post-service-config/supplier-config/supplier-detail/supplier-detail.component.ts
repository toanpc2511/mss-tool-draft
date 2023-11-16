import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DestroyService} from '../../../../shared/services/destroy.service';
import {ViettelPostServiceConfigService} from '../../viettel-post-service-config.service';
import {takeUntil} from 'rxjs/operators';
import {ISupplierViettelPost} from '../../../shared/models/lvbis-config.interface';

@Component({
  selector: 'app-supplier-detail',
  templateUrl: './supplier-detail.component.html',
  styleUrls: ['./supplier-detail.component.scss'],
  providers: [DestroyService]
})
export class SupplierDetailComponent implements OnInit {
  idSupplier: string;
  supplier: ISupplierViettelPost;

  constructor(private route: ActivatedRoute,
              private destroy$: DestroyService,
              private viettelPostService: ViettelPostServiceConfigService,
  ) {}

  ngOnInit(): void {
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        if (params) {
          this.idSupplier = params.id;
          this.getDetailSupplier();
        }
      });
  }

  getDetailSupplier(): void {
    this.viettelPostService.getDetailSupplier(this.idSupplier)
      .subscribe((res) => {
        if (res.data) {
          this.supplier = ({
            ...res.data
          });
          console.log(this.supplier);
        }
      });
  }
}
