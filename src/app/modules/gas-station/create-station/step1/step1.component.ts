import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { combineLatest, concat, merge, Observable } from 'rxjs';
import { combineAll, concatMap, map, startWith, takeUntil, tap } from 'rxjs/operators';
import { LIST_STATUS } from 'src/app/shared/data-enum/list-status';
import { IError } from 'src/app/shared/models/error.model';
import { DestroyService } from 'src/app/shared/services/destroy.service';
import { TValidators } from 'src/app/shared/validators';
import {
  CreateStation,
  GasStationService,
  IDistrict,
  IProvince,
  IWard
} from '../../gas-station.service';

@Component({
  selector: 'app-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.scss'],
  providers: [DestroyService]
})
export class Step1Component implements OnInit, OnChanges {
  @Output() stepSubmitted = new EventEmitter();
  @Input() step1Data: CreateStation;
  provinces: Array<IProvince> = [];
  districts: Array<IDistrict> = [];
  wards: Array<IWard> = [];
  stationForm: FormGroup;
  listStatus = LIST_STATUS;
  isUpdate = false;
  constructor(
    private gasStationService: GasStationService,
    private fb: FormBuilder,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private destroy$: DestroyService
  ) {}

  ngOnInit(): void {
    this.gasStationService
      .getAllProvinces()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.provinces = res;
      });
    this.stationForm
      .get('provinceId')
      .valueChanges.pipe(
        concatMap((provinceId: number) => {
          this.districts = [];
          this.wards = [];
          this.stationForm.get('districtId').reset();
          this.stationForm.get('wardId').reset();
          const areaName = this.provinces.find((p) => p.provinceId === Number(provinceId))?.area
            .name;
          this.stationForm.get('area').patchValue(areaName);
          return this.gasStationService.getDistrictsByProvince(provinceId);
        }),
        tap((districts) => {
          this.districts = districts;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
    this.stationForm
      .get('districtId')
      .valueChanges.pipe(
        concatMap((districtId: number) => {
          this.wards = [];
          this.stationForm.get('wardId').reset();
          return this.gasStationService.getWardsByDistrict(districtId);
        }),
        tap((wards) => {
          this.wards = wards;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();

    const pronvice$ = this.stationForm
      .get('provinceId')
      .valueChanges.pipe(startWith(0), takeUntil(this.destroy$)) as Observable<number>;
    const district$ = this.stationForm
      .get('districtId')
      .valueChanges.pipe(startWith(0), takeUntil(this.destroy$)) as Observable<number>;
    const ward$ = this.stationForm
      .get('wardId')
      .valueChanges.pipe(startWith(0), takeUntil(this.destroy$)) as Observable<number>;
    const address$ = this.stationForm
      .get('address')
      .valueChanges.pipe(startWith(''), takeUntil(this.destroy$)) as Observable<string>;
    combineLatest([pronvice$, district$, ward$, address$])
      .pipe(
        map(([proviceId, districtId, wardId, address]) => ({
          proviceId,
          districtId,
          wardId,
          address
        })),
        tap((data) => {
          const provinceName = this.provinces.find(
            (p) => p.provinceId === Number(data.proviceId)
          )?.name;
          const districtName = this.districts.find(
            (p) => p.districtId === Number(data.districtId)
          )?.name;
          const wardName = this.wards.find((p) => p.wardId === Number(data.wardId))?.name;
          const fullAddress = [data.address, wardName, districtName, provinceName]
            .filter((l) => !!l)
            .join(', ');
          this.stationForm.get('fullAddress').patchValue(fullAddress);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.stationForm) {
      this.stationForm = this.initForm();
    }
    if (this.step1Data) {
      this.isUpdate = true;
      this.stationForm.patchValue(this.step1Data);
    }
  }

  initForm() {
    return this.fb.group({
      stationCode: [
        'ST',
        [Validators.required, TValidators.patternNotWhiteSpace(/^[A-Za-z0-9]*$/)]
      ],
      name: ['', [Validators.required]],
      provinceId: [null, [Validators.required]],
      districtId: [null, [Validators.required]],
      wardId: [null, [Validators.required]],
      address: [''],
      fullAddress: [null],
      area: [null],
      status: [this.listStatus.ACTIVE]
    });
  }

  onSubmit() {
    this.stationForm.markAllAsTouched();

    if (this.stationForm.invalid) {
      return;
    }

    if (!this.isUpdate) {
      this.gasStationService.createStation(this.stationForm.value).subscribe(
        (res) => {
          if (res.data) {
            this.stepSubmitted.next({
              currentStep: 1,
              step1: { data: this.stationForm.value, isValid: true }
            });
            this.gasStationService.gasStationId = res.data.id;
            this.gasStationService.gasStationStatus = res.data.status;
          }
        },
        (err: IError) => {
          this.checkError(err);
        }
      );
    } else {
      this.gasStationService
        .updateStation(this.gasStationService.gasStationId, this.stationForm.value)
        .subscribe(
          (res) => {
            if (res.data) {
              this.stepSubmitted.next({
                currentStep: 1,
                step1: { data: this.stationForm.value, isValid: true }
              });
              this.gasStationService.gasStationStatus = res.data.status;
            }
          },
          (err: IError) => {
            this.checkError(err);
          }
        );
    }
  }

  checkError(err: IError) {
    if (err.code === 'SUN-OIL-4149') {
      this.stationForm.get('stationCode').setErrors({ codeExisted: true });
    }
    if (err.code === 'SUN-OIL-4148') {
      this.stationForm.get('name').setErrors({ nameExisted: true });
    }
    this.cdr.detectChanges();
  }

  backToList() {
    this.router.navigate(['/tram-xang']);
  }
}
