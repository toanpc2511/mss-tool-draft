import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-card-services',
  templateUrl: './card-services.component.html',
  styleUrls: ['./card-services.component.scss']
})
export class CardServicesComponent implements OnInit {
  serviceName = '';
  cardServiceItems = [];

  constructor(private router: Router) {
  }

  ngOnInit(): void {

    const frontendAction = JSON.parse(localStorage.getItem('frontendAction'));

    for (const key in frontendAction) {
      for (const key2 in frontendAction[key]) {
        //console.log(frontendAction[key][key2].parentFEUrl, this.router.url, frontendAction[key][key2].parentFEUrl === this.router.url);
        if (frontendAction[key][key2].parentFEUrl === this.router.url) {
          this.cardServiceItems.push({
            textItem: frontendAction[key][key2].name,
            pathImage: frontendAction[key][key2].imagePath,
            urlRouter: frontendAction[key][key2].feUrl
          });
        }
        if (this.router.url === frontendAction[key][key2].feUrl) {
          this.serviceName = frontendAction[key][key2].name;
        }

      }

      // Use `key` and `value`
    }
    $('.parentName').html(this.serviceName);
    $('.childName').html('Danh sách dịch vụ');
  }
}
