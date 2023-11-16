import {
  Component,
  OnInit,
  SimpleChanges,
  Output,
  EventEmitter,
  Input,
  OnChanges,
} from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ActionModel } from '../../models/ActionModel';
import { FOOTER_BUTTON_CODE } from '../../constants/constants';

@Component({
  selector: 'app-lpb-footer',
  templateUrl: './lpb-footer.component.html',
  styleUrls: ['./lpb-footer.component.scss'],
})
export class LpbFooterComponent implements OnInit, OnChanges {
  buttonActions: {
    icon: string;
    actionName: string;
    actionCode: string;
    hiddenType?: 'disable' | 'none';
  }[] = [];
  actionList = [
    FOOTER_BUTTON_CODE.FOOTER_ACTION_EDIT,
    FOOTER_BUTTON_CODE.FOOTER_ACTION_DELETE,
    FOOTER_BUTTON_CODE.FOOTER_ACTION_SEND_APPROVE,
    FOOTER_BUTTON_CODE.FOOTER_ACTION_REVERSE,
    FOOTER_BUTTON_CODE.FOOTER_ACTION_UNREVERSE,
    FOOTER_BUTTON_CODE.FOOTER_ACTION_PRINT_DOCUMENT,
    FOOTER_BUTTON_CODE.FOOTER_ACTION_PRINT_FORM,
    FOOTER_BUTTON_CODE.FOOTER_ACTION_APPROVE,
    FOOTER_BUTTON_CODE.FOOTER_ACTION_SAVE,
    FOOTER_BUTTON_CODE.FOOTER_ACTION_REJECT,
  ];
  @Output() onUpdate = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();
  @Output() onSendApprove = new EventEmitter<any>();
  @Output() onApprove = new EventEmitter<any>();
  @Output() onReverse = new EventEmitter<any>();
  @Output() onUnReverse = new EventEmitter<any>();
  @Output() onPrintDocument = new EventEmitter<any>();
  @Output() onPrintForm = new EventEmitter<any>();
  @Output() onSave = new EventEmitter<any>();
  @Output() onReject = new EventEmitter<any>();
  @Input() actions: ActionModel[] = [];
  @Input() hiddenButtons: {
    actionCode: string;
    hiddenType: 'disable' | 'none';
  }[] = [];
  @Input() hiddenBackButton = false;

  constructor(private location: Location, private router: Router) {}

  ngOnInit(): void {
    const actions = JSON.parse(localStorage.getItem('action')).filter(
      (action) => !action.feUrl
    );

    actions.forEach((act) => {
      if (
        act.parentId === this.findActionIdByUrl() &&
        this.actionList.some(e => act.code.includes(e))
      ) {
        this.buttonActions.push({
          icon: act.imagePath,
          actionName: act.name,
          actionCode: act.code,
        });
      }
    });

    this.buttonActions = this.buttonActions.map((e) => {
      return {
        ...e,
        hiddenType: this.hiddenButtons?.find(
          (v) => v.actionCode === e.actionCode
        )?.hiddenType,
      };
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.hiddenButtons && !changes.hiddenButtons.firstChange) {
      this.buttonActions = this.buttonActions.map((e) => {
        return {
          ...e,
          hiddenType: changes.hiddenButtons?.currentValue?.find(
            (v) => v.actionCode === e.actionCode
          )?.hiddenType,
        };
      });
    }
  }

  callAction(actionCode: string): any {
    if (actionCode.includes(FOOTER_BUTTON_CODE.FOOTER_ACTION_EDIT)) {
      return this.update();
    } else if (actionCode.includes(FOOTER_BUTTON_CODE.FOOTER_ACTION_DELETE)) {
      return this.delete();
    } else if (actionCode.includes(FOOTER_BUTTON_CODE.FOOTER_ACTION_SEND_APPROVE)) {
      return this.sendApprove();
    } else if (actionCode.includes(FOOTER_BUTTON_CODE.FOOTER_ACTION_REVERSE)) {
      return this.reverse();
    } else if (actionCode.includes(FOOTER_BUTTON_CODE.FOOTER_ACTION_PRINT_DOCUMENT)) {
      return this.printDocument();
    } else if (actionCode.includes(FOOTER_BUTTON_CODE.FOOTER_ACTION_PRINT_FORM)) {
      return this.printForm();
    } else if (actionCode.includes(FOOTER_BUTTON_CODE.FOOTER_ACTION_APPROVE)) {
      return this.approve();
    } else if (actionCode.includes(FOOTER_BUTTON_CODE.FOOTER_ACTION_SAVE)) {
      return this.save();
    } else if (actionCode.includes(FOOTER_BUTTON_CODE.FOOTER_ACTION_UNREVERSE)) {
      return this.unReverse();
    } else if (actionCode.includes(FOOTER_BUTTON_CODE.FOOTER_ACTION_REJECT)) {
      return this.reject();
    }
  }

  back(): any {
    this.location.back();
  }

  update(): any {
    this.onUpdate.emit();
  }

  delete(): any {
    this.onDelete.emit();
  }

  sendApprove(): any {
    this.onSendApprove.emit();
  }

  approve(): any {
    this.onApprove.emit();
  }

  reverse(): any {
    this.onReverse.emit();
  }

  unReverse(): any {
    this.onUnReverse.emit();
  }

  reject(): any {
    this.onReject.emit();
  }

  printDocument(): any {
    this.onPrintDocument.emit();
  }

  printForm(): any {
    this.onPrintForm.emit();
  }

  save(): any {
    this.onSave.emit();
  }

  findActionIdByUrl(): any {
    const frontendAction = JSON.parse(localStorage.getItem('frontendAction'));
    let actionId = '';
    for (const key in frontendAction) {
      for (const key2 in frontendAction[key]) {
        if (this.router.url.split('?')[0] === frontendAction[key][key2].feUrl) {
          actionId = frontendAction[key][key2].id;
        }
      }
    }
    return actionId;
  }

  callBack(action: ActionModel): any {
    action.actionClick();
  }
}
