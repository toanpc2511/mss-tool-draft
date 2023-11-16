import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputAutocompleteComponent } from './components/input-autocomplete/input-autocomplete.component';
import { InputAutocompleteCustomComponent } from './components/input-autocomplete-custom/input-autocomplete-custom.component';

const components = [ InputAutocompleteComponent, InputAutocompleteCustomComponent];

@NgModule({
  imports: [CommonModule],
  declarations: [...components],
  exports: [...components],
})
export class SystemConfigSharedModule {}
