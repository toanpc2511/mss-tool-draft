import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../../../../core';
import { Observable } from 'rxjs';
import { AuthService, UserModel } from '../../../../../../modules/auth/services/auth.service';

@Component({
  selector: 'app-user-offcanvas',
  templateUrl: './user-offcanvas.component.html',
  styleUrls: ['./user-offcanvas.component.scss']
})
export class UserOffcanvasComponent implements OnInit {
  extrasUserOffcanvasDirection = 'offcanvas-right';
  user$: Observable<UserModel>;

  constructor(private layout: LayoutService, private auth: AuthService) {}

  ngOnInit(): void {
    this.extrasUserOffcanvasDirection = `offcanvas-${this.layout.getProp(
      'extras.user.offcanvas.direction'
    )}`;
    this.user$ = this.auth.currentUser$;
  }

  logout() {
    this.auth.logout();
    document.location.reload();
  }
}
