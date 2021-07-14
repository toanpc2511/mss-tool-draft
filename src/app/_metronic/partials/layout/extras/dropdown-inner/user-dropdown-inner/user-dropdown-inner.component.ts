import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService, UserModel } from '../../../../../../modules/auth/services/auth.service';
import { LayoutService } from '../../../../../core';
@Component({
  selector: 'app-user-dropdown-inner',
  templateUrl: './user-dropdown-inner.component.html',
  styleUrls: ['./user-dropdown-inner.component.scss']
})
export class UserDropdownInnerComponent implements OnInit {
  extrasUserDropdownStyle: 'light' | 'dark' = 'light';
  user$: Observable<UserModel>;

  constructor(private layout: LayoutService, private auth: AuthService) {}

  ngOnInit(): void {
    this.extrasUserDropdownStyle = this.layout.getProp('extras.user.dropdown.style');
    this.user$ = this.auth.currentUser$;
  }

  logout() {
    this.auth.logout();
    document.location.reload();
  }
}
