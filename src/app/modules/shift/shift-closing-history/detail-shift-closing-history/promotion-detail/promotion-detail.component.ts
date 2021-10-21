import { Component, OnInit } from '@angular/core';
import { ShiftService } from '../../../shift.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-promotion-detail',
  templateUrl: './promotion-detail.component.html',
  styleUrls: ['./promotion-detail.component.scss']
})
export class PromotionDetailComponent implements OnInit {
  lockShiftId: number;

  constructor(
    private shiftService: ShiftService,
    private activeRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((res) => {
      this.lockShiftId = res.lockShiftId;
    });
  }

}
