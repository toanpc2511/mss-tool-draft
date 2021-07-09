import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { DestroyService } from 'src/app/shared/services/destroy.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  defaultAuth = {
    phoneNumber: '',
    password: ''
  };
  loginForm: FormGroup;
  hasError: boolean = true;
  returnUrl: string;
  isLoading$: Observable<boolean>;
  isShowPasswordStatus = false;

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
    return this.loginForm.controls;
  }

  initForm() {
    this.loginForm = this.fb.group({
      phoneNumber: [
        this.defaultAuth.phoneNumber,
        Validators.compose([Validators.required, Validators.minLength(9), Validators.maxLength(12)])
      ],
      password: [
        this.defaultAuth.password,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100)
        ])
      ]
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

  changeShowPasswordStatus() {
    this.isShowPasswordStatus = !this.isShowPasswordStatus;
  }
}
