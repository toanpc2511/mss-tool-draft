import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { LoginComponent } from './login/login.component';
declare var $: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  userActivity;

  userInactive: Subject<any> = new Subject();
  constructor(private router: Router, public dialog: MatDialog) {
    this.setTimeout();

    this.userInactive.subscribe(() => {
      if ($('.mat-dialog-container')) {
        this.dialog.closeAll();
      }
      // call the function to remove currentUserValue in client LocalStorage
      localStorage.removeItem('objBreadcrumb');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('function');
      localStorage.removeItem('userInfo');
      localStorage.removeItem('action');
      localStorage.removeItem('index');
      localStorage.removeItem('role');
      sessionStorage.removeItem('flag');
      this.router.navigateByUrl('/').then();
    });

  }
  setTimeout(): void {
    this.userActivity = setTimeout(() => this.userInactive.next(undefined), 1500000);
  }
  // @HostListener('window:popstate', ['$event'])
  // onPopState(event) {
  //   console.log('Back button pressed');
  // }
  @HostListener('window:mousemove') refreshUserState(): void {
    clearTimeout(this.userActivity);
    this.setTimeout();
  }

  // @HostListener('window:beforeunload', ['$event'])
  // clearLocalStorage(event) {
  //   localStorage.clear();
  // }

}
