import { Router, RouterLinkActive } from '@angular/router';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-water-service-config',
  templateUrl: './water-service-config.component.html',
  styleUrls: ['./water-service-config.component.scss'],
})
export class WaterServiceConfigComponent implements OnInit {
navLinks = [];
isViewInitialized = false;
activeLink = "";

constructor(private router: Router,
  private changeDetector: ChangeDetectorRef) { }

ngOnInit(): void {
  const frontendAction = JSON.parse(localStorage.getItem('frontendAction'));
  //console.log(frontendAction)
  for (const key in frontendAction) {
    for (const key2 in frontendAction[key]) {
      // console.log(frontendAction[key][key2]);

      if (this.router.url.includes(frontendAction[key][key2].feUrl)) {
        this.navLinks.push({
          label: frontendAction[key][key2].name,
          path: frontendAction[key][key2].feUrl
        });
      }
      // if (this.router.url === frontendAction[key][key2].feUrl) {
      //   this.serviceName = frontendAction[key][key2].name;
      // }

    }

    // Use `key` and `value`
  }
  //console.log(this.navLinks)
  if (this.navLinks.length > 0) {
    this.router.navigate([this.navLinks[0].path])
    this.activeLink = this.navLinks[0].path
  }
}

clickTab(activeLink: string){
  this.activeLink = activeLink
}

ngAfterViewInit(): void {
  this.isViewInitialized = true;
  this.changeDetector.detectChanges();
}

isLinkActive(rla: RouterLinkActive): boolean {
  const routerLink = rla.linksWithHrefs.first;

  return this.router.isActive(routerLink ? routerLink.urlTree : null, false);
}

}
