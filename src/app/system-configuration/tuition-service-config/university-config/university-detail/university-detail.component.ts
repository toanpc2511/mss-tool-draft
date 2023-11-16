import { Component, OnInit } from '@angular/core';
import {IUniversity} from '../../../shared/models/lvbis-config.interface';
import {TuitionServiceConfigService} from '../../tuition-service-config.service';
import {DestroyService} from '../../../../shared/services/destroy.service';
import { ActivatedRoute } from '@angular/router';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-university-detail',
  templateUrl: './university-detail.component.html',
  styleUrls: ['./university-detail.component.scss'],
  providers: [DestroyService]
})
export class UniversityDetailComponent implements OnInit {
  idUni = '';
  university: IUniversity;
  constructor(
    private route: ActivatedRoute,
    private destroy$: DestroyService,
    private tuitionService: TuitionServiceConfigService,
  ) { }

  ngOnInit(): void {
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        if (params) {
          this.idUni = params.id;
          this.getDetailSupplier();
        }
      });
  }

  getDetailSupplier(): void {
    this.tuitionService.getDetailUniversity(this.idUni)
      .subscribe((res) => {
        if (res.data) {
          this.university = ({
            ...res.data
          });

          console.log(this.university);
        }
      });
  }
}
