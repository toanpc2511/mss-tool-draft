import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ElectricServiceConfigService } from '../../electric-service-config.service';
import { DestroyService } from '../../../../shared/services/destroy.service';
import { takeUntil } from 'rxjs/operators';
import { ISupplierElectric } from '../../../shared/models/lvbis-config.interface';
import { PERIOD_DETAILS_ELECTRIC, PREFIXS_ELECTRIC, TYPES_CONFIG_ELECTRIC } from '../../../shared/contants/system-constant';
import { BreadCrumbHelper } from '../../../../shared/utilites/breadCrumb-helper';

@Component({
  selector: 'app-detail-supplier',
  templateUrl: './detail-supplier.component.html',
  styleUrls: ['./detail-supplier.component.scss'],
  providers: [DestroyService]
})
export class DetailSupplierComponent implements OnInit {
  idSupplier = '';
  supplier: ISupplierElectric;
  typeConfigs = TYPES_CONFIG_ELECTRIC;
  prefixs: any[] = PREFIXS_ELECTRIC;
  periodDetails: any[] = PERIOD_DETAILS_ELECTRIC;
  prefixFormat = "";
  billFormatDetail = "";
  constructor(
    private route: ActivatedRoute,
    private destroy$: DestroyService,
    private electricService: ElectricServiceConfigService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    BreadCrumbHelper.setBreadCrumb([
      'Cấu hình dịch vụ',
      'Dịch vụ điện',
      'Chi tiết',
    ]);
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
    this.electricService.getDetailSupplier(this.idSupplier)
      .subscribe((res) => {
        if (res.data) {
          this.supplier = ({
            ...res.data,
            typeConfigs: this.typeConfigs.find((x) => x.value === res.data?.supplierMetadata.paymentConfigType),
            supplierFormGroups: res.data.supplierFormGroups.map((item) => ({
              ...item,
              ruleName: item.ruleResponses.filter((item) => item.selected).map(x => x.name).join(', ')
            }))
          });
          this.prefixFormat = this.replaceValueToLabel(this.supplier?.supplierMetadata.prefixFormat, this.prefixs);
          this.billFormatDetail = this.replaceValueToLabel(this.supplier?.supplierMetadata.billFormat, this.periodDetails);
          this.cdr.detectChanges();
        }
      });
  }

  replaceValueToLabel(str: string, arr: any[]) {
    for (const row of arr) {
      const searchRegExp = new RegExp(row["value"], 'g');
      str = str.replace(searchRegExp, row["label"]);
    }
    return str;
  }
}
