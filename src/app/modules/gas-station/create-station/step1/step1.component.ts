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
import { combineLatest, Observable, of } from 'rxjs';
import { concatMap, debounceTime, startWith, takeUntil, tap } from 'rxjs/operators';
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
  isFirstLoad = true;
  constructor(
    private gasStationService: GasStationService,
    private fb: FormBuilder,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private destroy$: DestroyService
  ) {}

  ngOnInit(): void {
    if (!this.stationForm) {
      this.stationForm = this.initForm();
    }

    this.gasStationService
      .getAllProvinces()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.provinces = res.data;
        this.cdr.detectChanges();
      });

    this.stationForm
      .get('provinceId')
      .valueChanges.pipe(
        concatMap((provinceId: number) => {
          this.districts = [];
          this.wards = [];
          if (this.stationForm.get('districtId').value) {
            this.stationForm.get('districtId').reset();
          }
          if (this.stationForm.get('wardId').value) {
            this.stationForm.get('wardId').reset();
          }
          const area = this.provinces.find((p) => p.id === Number(provinceId))?.areaType;
          if (area === 'AREA_1') {
            this.stationForm.get('areaDisplay').patchValue('Vùng 1');
            this.stationForm.get('areaType').patchValue('AREA_1');
          } else {
            this.stationForm.get('areaDisplay').patchValue('Vùng 2');
            this.stationForm.get('areaType').patchValue('AREA_2');
          }
          return this.gasStationService.getDistrictsByProvince(provinceId);
        }),
        tap((res) => {
          this.districts = res.data;
          this.cdr.detectChanges();
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
    this.stationForm
      .get('districtId')
      .valueChanges.pipe(
        concatMap((districtId: number) => {
          this.wards = [];
          if (this.stationForm.get('wardId').value) {
            this.stationForm.get('wardId').reset();
          }
          if (districtId) {
            return this.gasStationService.getWardsByDistrict(districtId);
          }
          return of(null);
        }),
        tap((res) => {
          this.wards = res?.data || [];
          this.cdr.detectChanges();
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
        debounceTime(300),
        concatMap(([proviceId, districtId, wardId, address]) =>
          of({
            proviceId,
            districtId,
            wardId,
            address
          })
        ),
        tap((data) => {
          if (this.isUpdate && this.isFirstLoad) {
            this.isFirstLoad = false;
            return;
          }
          const provinceName = this.provinces.find((p) => p.id === Number(data.proviceId))?.name;
          const districtName = this.districts.find((d) => d.id === Number(data.districtId))?.name;
          const wardName = this.wards.find((w) => w.id === Number(data.wardId))?.name;
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
      setTimeout(() => {
        this.stationForm.patchValue(this.step1Data);
      });
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
      areaType: [null],
      areaDisplay: [null],
      status: [this.listStatus.ACTIVE]
    });
  }

  onSubmit() {
    this.stationForm.markAllAsTouched();

    if (this.stationForm.invalid) {
      return;
    }
    const value = { ...this.stationForm.value };
    delete value.areaDisplay;

    if (!this.isUpdate) {
      this.gasStationService.createStation(value).subscribe(
        (res) => {
          if (res.data) {
            this.stepSubmitted.next({
              currentStep: 1,
              step1: { data: this.stationForm.value as CreateStation, isValid: true }
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
      this.gasStationService.updateStation(this.gasStationService.gasStationId, value).subscribe(
        (res) => {
          if (res.data) {
            this.stepSubmitted.next({
              currentStep: 1,
              step1: { data: this.stationForm.value as CreateStation, isValid: true }
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
