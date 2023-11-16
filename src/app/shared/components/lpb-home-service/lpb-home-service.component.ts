import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-lpb-home-service',
  templateUrl: './lpb-home-service.component.html',
  styleUrls: ['./lpb-home-service.component.scss']
})
export class LpbHomeServiceComponent implements OnInit {
  serviceName = '';
  cardServiceItems = [];

  constructor(private router: Router) {
  }

  ngOnInit(): void {

    const frontendAction = JSON.parse(localStorage.getItem('frontendAction'));

    for (const key in frontendAction) {
      for (const key2 in frontendAction[key]) {

        if (frontendAction[key][key2].parentFEUrl === this.router.url) {
          this.cardServiceItems.push({
            textItem: frontendAction[key][key2].name,
            pathImage: frontendAction[key][key2].imagePath,
            urlRouter: frontendAction[key][key2].feUrl,
            tabOrder: frontendAction[key][key2].tabOrder
          });
        }
        if (this.router.url === frontendAction[key][key2].feUrl) {
          this.serviceName = frontendAction[key][key2].name;
        }

      }

      // Use `key` and `value`
    }
    this.cardServiceItems.sort((obj1, obj2) => {
      if (obj1.tabOrder > obj2.tabOrder) {
        return 1;
      }

      if (obj1.tabOrder < obj2.tabOrder) {
        return -1;
      }

      return 0;
    });
    $('.parentName').html(this.serviceName);
    $('.childName').html('Danh sách dịch vụ');
  }

}
