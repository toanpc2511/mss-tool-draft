import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { DestroyService } from 'src/app/shared/services/destroy.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  defaultAuth = {
    username: '',
    password: ''
  };
  loginForm: FormGroup;
  hasError: boolean = false;
  returnUrl: string;
  isLoading$: Observable<boolean>;
  isShowPasswordStatus = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private destroy$: DestroyService,
    private http: HttpClient
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

  initForm() {
    this.loginForm = this.fb.group({
      username: [this.defaultAuth.username, Validators.compose([Validators.required])],
      password: [this.defaultAuth.password, Validators.compose([Validators.required])]
    });
  }

  submit() {
    this.hasError = false;
    this.authService
      .login(this.loginForm.controls.username.value, this.loginForm.controls.password.value)
      .subscribe((user) => {
        console.log(user);

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
