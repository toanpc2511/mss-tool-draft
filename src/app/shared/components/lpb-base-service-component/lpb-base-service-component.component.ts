import {AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ThemePalette} from '@angular/material/core';
import {Router, RouterLinkActive} from '@angular/router';
import {UniStorageService} from '../../services/uni-storage.service';

@Component({
  selector: 'app-lpb-base-service-component',
  templateUrl: './lpb-base-service-component.component.html',
  styleUrls: ['./lpb-base-service-component.component.scss']
})
export class LpbBaseServiceComponentComponent implements OnInit, AfterViewInit {
  navLinks = [];
  activeLink = '';
  activeLinkIndex = -1;
  functionIndex = -1;
  url = '';

  constructor(private router: Router,
              private changeDetector: ChangeDetectorRef,
              private uniStorageService: UniStorageService) {
    this.url = this.router.url.split('?')[0];
  }

  ngOnInit(): void {
    this.getNavTabLinks();
    this.router.events.subscribe((res) => {
      this.activeLinkIndex = this.navLinks.indexOf(this.navLinks.find(tab => {
        return tab.path === this.url;
      }));
    });

  }


  findParentActionId(parentId): string {
    const frontendAction = JSON.parse(localStorage.getItem('action'));
    let id = '';
    for (const key in frontendAction) {
      if (frontendAction[key].id === parentId) {
        if (!frontendAction[key].parentId) {
          id = frontendAction[key].id;
        } else {
          id = this.findParentActionId(frontendAction[key].parentId);
        }
      }
    }
    return id;
  }

  findParentIdByUrl(): any {
    const frontendAction = JSON.parse(localStorage.getItem('frontendAction'));
    let parentId = '';
    for (const key in frontendAction) {
      for (const key2 in frontendAction[key]) {
        // console.log(this.url, frontendAction[key][key2].feUrl, frontendAction[key][key2], this.url === frontendAction[key][key2].feUrl);
        if (this.url === frontendAction[key][key2].feUrl) {
          parentId = this.findParentActionId(frontendAction[key][key2].parentId);
        }
      }
    }
    return parentId;
  }

  getNavTabLinks(): any {
    let isAddTab = true;
    const parentId = this.findParentIdByUrl();
    const userInfo = this.uniStorageService.getUserInfo();
    const frontendAction = JSON.parse(localStorage.getItem('frontendAction'));
    // console.log(frontendAction)
    for (const key in frontendAction) {
      for (const key2 in frontendAction[key]) {
        if (this.url === frontendAction[key][key2].parentFEUrl && !frontendAction[key][key2].imagePath
        && (frontendAction[key][key2].description === 'ALL' || frontendAction[key][key2].description?.includes(userInfo.branchCode))) {
          this.navLinks.push({
            label: frontendAction[key][key2].name,
            path: frontendAction[key][key2].feUrl,
            tabOrder: frontendAction[key][key2].tabOrder
          });
          isAddTab = false;
        }
      }
    }


    if (isAddTab) {
      for (const key in frontendAction) {
        for (const key2 in frontendAction[key]) {
          if (parentId === frontendAction[key][key2].parentId && !frontendAction[key][key2].imagePath
            && (frontendAction[key][key2].description === 'ALL' || frontendAction[key][key2].description?.includes(userInfo.branchCode))) {
            this.navLinks.push({
              label: frontendAction[key][key2].name,
              path: frontendAction[key][key2].feUrl,
              tabOrder: frontendAction[key][key2].tabOrder
            });
          }
        }
      }
    }

    this.navLinks = this.navLinks.sort((obj1, obj2) => {
      if (obj1.tabOrder > obj2.tabOrder) {
        return 1;
      }

      if (obj1.tabOrder < obj2.tabOrder) {
        return -1;
      }

      return 0;
    });

    if (!isAddTab) {
      if (this.navLinks.length > 0) {
        this.router.navigate([this.navLinks[0].path]);
      }
    }
  }

  ngAfterViewInit(): void {
    this.changeDetector.detectChanges();
  }

}
