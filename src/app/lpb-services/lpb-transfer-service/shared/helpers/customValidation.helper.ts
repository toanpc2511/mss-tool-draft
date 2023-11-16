import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidatorFn,
} from '@angular/forms';

export class MasterSlaveValidator {
  slaveControls: AbstractControl[] = [];
  masterControl: AbstractControl;

  constructor(masterControl: AbstractControl) {
    this.masterControl = masterControl;
  }

  conditionalValidateFn(predicate: () => boolean, validator: ValidatorFn) {
    return (slaveControl) => {
      this.slaveControls.push(slaveControl);

      if (!slaveControl.parent) {
        return null;
      }
      if (predicate()) {
        return validator(slaveControl);
      }
      return null;
    };
  }

  watchChangeMaster() {
    this.masterControl.valueChanges.subscribe(() => {
      this.slaveControls.forEach((control) => {
        control.updateValueAndValidity();
      });
    });
  }
}
