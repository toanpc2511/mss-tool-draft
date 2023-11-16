// import { Component, OnInit, Inject } from '@angular/core';
// import { NestedTreeControl } from '@angular/cdk/tree';
// import { MatTreeNestedDataSource } from '@angular/material/tree';
// import {Router} from '@angular/router';
// // import * as $ from 'jquery';
// declare var $: any;
// @Component({
//   selector: 'app-menu-tree',
//   templateUrl: './menu-tree.component.html',
//   styleUrls: ['./menu-tree.component.scss'],
// })
// export class MenuTreeComponent implements OnInit {
//   treeControl = new NestedTreeControl<FoodNode>((node) => node.children);
//   dataSource = new MatTreeNestedDataSource<FoodNode>();
//   mocl:boolean
//   hasChild = (_: number, node: FoodNode) =>
//     !!node.children && node.children.length > 0;
//   constructor(private router:Router) {
//     this.dataSource.data = TREE_DATA;
//   }
//   click(){
//     $('.trigger').click(function(e){
//       e.preventDefault();
//       var x = document.getElementById("trigger");
//       x.classList.toggle("fa-angle-down");
//       var childUl = $(this).siblings("ul.tree-parent");
//       if( childUl.hasClass('open') ){
//         childUl.removeClass('open');
//         // x.classList.toggle("fa-angle-right");
//       } else {
        
//         childUl.addClass('open');
//       }
//     });
//     $('.view').click(function(e){
//       e.preventDefault();
//       var child = $(this).siblings("ul.tree-parent");
//       if( child.hasClass('child') ){
//         child.removeClass('child');
//       } else {
//         child.addClass('child');
//       }
//     })
//   }
//   ngOnInit() {
//     this.mocl = true
//     var childUl = $('ul.tree-parent');
//     if(childUl.hasClass('open')){
//       childUl.removeClass('open')
//     }
//     if(childUl.hasClass('child')){
//       childUl.removeClass('child')
//     }
//     this.click()
//   }
// }
// interface FoodNode {
//   name: string;
//   children?: FoodNode[];
// }

// const TREE_DATA: FoodNode[] = [
//   {
//     name: 'Thông tin chung',
//     children: [],
//   },
//   {
//     name: 'Khách hàng',
//     children: [],
//   },
//   {
//     name: 'Gói dịch vụ',
//     children: [],
//   },
//   {
//     name: 'Tài khoản',
//     children: [
//       {
//         name: 'Tài khoản - XXX',
//         children: [
//           { name: 'Chủ tài khoản chung' },
//           { name: 'Ủy quyền' },
//           { name: 'Đồng sở hữu' },
//         ],
//       },
//     ],
//   },
//   {
//     name: 'eBanking',
//     children: [],
//   },
//   {
//     name: 'SMS Banking',
//     children: [],
//   },
//   {
//     name: 'Thẻ',
//     children: [
//       {
//         name: 'Thẻ 1',
//         children: [{ name: 'Thẻ 1', children: [] }],
//       },
//       {
//         name: 'Thẻ 2',
//         children: [],
//       },
//     ],
//   },
//   {
//     name: 'Biểu mẫu',
//     children: [
//       {
//         name: 'Biểu mẫu 1',
//         children: [],
//       },
//       {
//         name: 'Biểu mẫu 2',
//         children: [],
//       },
//     ],
//   },
//   {
//     name: 'Tài liệu đính kèm',
//     children: [],
//   },
//   {
//     name: 'Gửi duyệt',
//     children: [],
//   },
// ];
