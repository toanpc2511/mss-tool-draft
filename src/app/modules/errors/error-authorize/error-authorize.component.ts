import { Component, isDevMode } from '@angular/core';

@Component({
  selector: 'app-error-authorize',
  templateUrl: './error-authorize.component.html'
})
export class ErrorAuthorizeComponent {
  isDevMode = isDevMode();
}
