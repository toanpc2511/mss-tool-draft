import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { DestroyService } from 'src/app/shared/services/destroy.service';

@Component({
  selector: 'app-first-login',
  templateUrl: './first-login.component.html',
  styleUrls: ['./first-login.component.scss']
})
export class FirstLoginComponent implements OnInit {
  firstLoginForm: FormGroup;
  hasError: boolean = true;
  returnUrl: string;
  isLoading$: Observable<boolean>;
  isShowPasswordNew = false;
  isShowPasswordConfirm = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private destroy$: DestroyService
  ) {
    this.isLoading$ = this.authService.isLoading$;
    // redirect to home if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.initForm();
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'.toString()] || '/';
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.firstLoginForm.controls;
  }

  initForm() {
    this.firstLoginForm = this.fb.group({
      passwordNew: [null, Validators.compose([Validators.required])],
      passwordConfirm: [null, Validators.compose([Validators.required])]
    });
  }

  submit() {
    this.hasError = false;
    this.authService
      .login(this.f.phoneNumber.value, this.f.password.value)
      .pipe(first())
      .subscribe((user) => {
        if (user) {
          this.router.navigate([this.returnUrl]);
        } else {
          this.hasError = true;
        }
      });
  }

  changeShowPasswordNewStatus() {
    this.isShowPasswordNew = !this.isShowPasswordNew;
  }

  changeShowPasswordConfirmStatus() {
    this.isShowPasswordConfirm = !this.isShowPasswordConfirm;
  }
}
