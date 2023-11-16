import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ProcessService} from '../../../_services/process.service';
import {Location} from '@angular/common';
import {CategoryService} from '../../../_services/category/category.service';
import {ErrorHandlerService} from '../../../_services/error-handler.service';
import {MissionService} from '../../../services/mission.service';
import {MatDialog} from '@angular/material/dialog';
import {DetailProcess} from '../../../_models/process';
import {Process} from '../../../_models/process/Process';
import {OwnerBenefitsCif} from '../../../_models/ownerBenefitsCif';
import {Mis} from '../../../_models/register.cif';
import {CategoryList} from '../../../_models/category/categoryList';
import {CifCondition} from '../../../_models/cif';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {dateValidator, futureDate} from '../../../_validator/cif.register.validator';
import {MisCifComponent} from '../create/mis-cif/mis-cif.component';
import {DialogConfig} from '../../../_utils/_dialogConfig';
import {UdfCifComponent} from '../create/udf-cif/udf-cif.component';
import {ReferenceCifComponent} from '../create/reference-cif/reference-cif.component';
import {CommissionCifComponent} from '../create/commission-cif/commission-cif.component';
import {Legal} from '../../../_models/process/legal/Legal';
import {LegalCustomer} from '../../../_models/process/legal/LegalCustomer';
import * as moment from 'moment';
import {OwnerBenefitsCifComponent} from '../create/owner-benefits-cif/owner-benefits-cif.component';
import {DeputyCifComponent} from '../create/deputy-cif/deputy-cif.component';
import {GlobalConstant} from '../../../_utils/GlobalConstant';
import {map, startWith} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {ObjConfigPopup} from '../../../_utils/_objConfigPopup';
import {NotificationService} from '../../../_toast/notification_service';
import {CommissionCif} from '../../../_models/commision';
import {Customer, DeputyCif, GuardianList} from '../../../_models/deputy';
import {OwnerBenefitsCif2} from '../../../_models/ownerBenefitsCif2';
import {ErrorMessage} from '../../../_utils/ErrorMessage';
import {Category} from '../../../_models/category/category';
import {PerDocNoList} from '../../../_models/process/PerDocNoList';

import {CommonService} from '../../../_services/common.service';
import {existSoGTXM} from '../../../_validator/cif.register.validator';
import {GtxmValidator} from '../../../_validator/gtxm.validator';
import {validateNationality} from '../../../_validator/common.validator';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter} from "@angular/material-moment-adapter";


@Component({
  selector: 'app-process-update',
  templateUrl: './process-update.component.html',
  styleUrls: ['./process-update.component.css'],

})
export class ProcessUpdateComponent implements OnInit {
  processId = '';
  constructor(private router: Router,
              private route: ActivatedRoute,
              private fb: FormBuilder,
              private cifService: ProcessService,
              private location: Location,
              private category: CategoryService,
              private errorHandler: ErrorHandlerService,
              private missionService: MissionService,
              private notificationService: NotificationService,
              private commonService: CommonService,
              private gtxmValidator: GtxmValidator,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {

    this.route.paramMap.subscribe(paramMap => {
        this.processId = paramMap.get('processId');
      }
    );
    this.missionService.setProcessId(this.processId);

  }

}
