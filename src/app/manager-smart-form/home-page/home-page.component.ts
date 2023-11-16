import {Component, OnInit} from '@angular/core';
import {UniStorageService} from '../../shared/services/uni-storage.service';

declare var $: any;

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  services = [];

  constructor(private uniStorageService: UniStorageService) {
    const frontendAction = JSON.parse(localStorage.getItem('frontendAction'));
    const userInfo = uniStorageService.getUserInfo();
    for (const key in frontendAction) {
      const serviceName = key;
      const tabOrder = frontendAction[key].tabOrder;
      const serviceList = [];
      for (const key2 in frontendAction[key]) {
        if (frontendAction[key][key2].isMenu) {
          // console.log(frontendAction[key][key2].description, userInfo.branchCode);
          if (frontendAction[key][key2].description === 'ALL' || frontendAction[key][key2].description?.includes(userInfo.branchCode)) {
            serviceList.push({
              textItem: frontendAction[key][key2].name,
              pathImage: frontendAction[key][key2].imagePath,
              urlRouter: frontendAction[key][key2].feUrl,
              isHidden: !frontendAction[key][key2].isMenu,
              tabOrder: !frontendAction[key][key2].tabOrder
            });
          }

        }

      }
      serviceList.sort((obj1, obj2) => {
        if (obj1.textItem > obj2.textItem) {
          return 1;
        }

        if (obj1.textItem < obj2.textItem) {
          return -1;
        }

        return 0;
      });
      this.services.push({
        serviceName,
        serviceList,
        tabOrder
      });
      // Use `key` and `value`
    }
    this.services.sort((obj1, obj2) => {
      if (obj1.serviceName > obj2.serviceName) {
        return 1;
      }

      if (obj1.serviceName < obj2.serviceName) {
        return -1;
      }

      return 0;
    });
    console.log(this.services);
  }

  ngOnInit(): void {
    $('.parentName').html('Trang chủ');
    $('.childName').html('Dashboard');
  }

  // This function converts the string to lowercase, then perform the conversion

}
