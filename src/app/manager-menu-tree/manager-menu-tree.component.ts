import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MissionService } from '../services/mission.service';
import { AccountService } from '../_services/account.service';
import { AccountModel } from '../_models/account';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { MenuTree, TreeNode } from '../_models/menu.tree';
import { Card } from '../_models/card/Card';
import { CardService } from '../_services/card/card.service';
import { HelpsService } from '../shared/services/helps.service';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../_services/authentication.service';
import { HTTPMethod } from '../shared/constants/http-method';
import { docStatus } from '../shared/models/documents';

declare var $: any;

@Component({
  selector: 'app-manager-menu-tree',
  templateUrl: './manager-menu-tree.component.html',
  styleUrls: ['./manager-menu-tree.component.scss'],
  providers: [MissionService]
})
export class ManagerMenuTreeComponent implements OnInit, OnDestroy {
  menuTree: MenuTree = new MenuTree();
  mocl: boolean;
  accounts: AccountModel[] = [];
  cards: Card[] = [];
  navigationSubscription;
  roleLogin: any = [];
  processId: string;
  cardId: string;
  isKSV: boolean;
  isGDV: boolean;
  message: string;
  param: any;
  mode = 'indeterminate';
  value = 50;
  color = 'primary';
  displayProgressSpinnerInBlock: boolean;
  countRole: boolean;
  isShowMessage = false;
  recursive = true;
  levels = new Map<TreeNode, number>();
  treeControl: NestedTreeControl<TreeNode>;
  dataSource: MatTreeNestedDataSource<TreeNode>;
  aRouter: any = ['customer', { processId: '123' }];
  isShowLoadingCallApi = false;
  subLoadingCallApi: Subscription;
  objStatusProfile: any = {};

  constructor(private router: Router,
    // tslint:disable-next-line:align
    private accountService: AccountService,
    // tslint:disable-next-line:align
    private cardService: CardService,
    // tslint:disable-next-line:align
    private changeDetectionRef: ChangeDetectorRef,
    // tslint:disable-next-line:align
    private missionService: MissionService,
    // tslint:disable-next-line:align
    private helpService: HelpsService,
    // tslint:disable-next-line:align
    public authenticationService: AuthenticationService) {
    this.treeControl = new NestedTreeControl<TreeNode>(this.getChildren);

    this.dataSource = new MatTreeNestedDataSource();

    this.dataSource.data = this.menuTree.getTree(authenticationService);
    // tslint:disable-next-line:typedef
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  getChildren = (node: TreeNode) => {
    return node.children;
  }

  hasChildren = (index: number, node: TreeNode) => {
    return node.children.value.length > 0;
  }

  getMission(): void {
    this.missionService.missionAnnounced$.subscribe(message => this.message = message);
    this.missionService.processId$.subscribe(id => {
      this.param = { processId: id };
      this.menuTree.setProcessId(id);
      this.getAccountList(id);
      this.getListCard(id);
      this.getPrintOut(id);
    });

    this.missionService.showLoading$.subscribe(loading => {
      this.displayProgressSpinnerInBlock = loading;
      this.changeDetectionRef.detectChanges();
    });

  }

  // tslint:disable-next-line:use-lifecycle-interface
  ngOnDestroy(): void {
    // Destroy navigationSubscription to avoid memory leaks
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
    if (this.subLoadingCallApi) {
      this.subLoadingCallApi.unsubscribe();
    }
  }

  click(): void {
    // tslint:disable-next-line:space-before-function-paren
    $('.trigger').click(function (e): void {
      e.preventDefault();
      const x = document.getElementById('triggerAccount');
      // x.classList.toggle("fa-angle-down");

      const childUl = $(this).siblings('ul.tree-parent');
      if (childUl.hasClass('open')) {
        childUl.removeClass('open');
        x.innerText = 'add';
      } else {
        childUl.addClass('open');
        x.innerText = 'remove';
      }
    });
    // tslint:disable-next-line:space-before-function-paren
    $('.view').click(function (e): void {
      e.preventDefault();
      const child = $(this).siblings('ul.tree-parent');
      if (child.hasClass('child')) {
        child.removeClass('child');
      } else {
        child.addClass('child');
      }
    });
  }

  fun_reload(): void {
    this.navigationSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Trick the Router into believing it's last link wasn't previously loaded
        this.router.navigated = false;
        location.reload();
        window.scrollTo(0, 0);
      }
    });
  }

  ngOnInit(): void {
    this.roleLogin = JSON.parse(localStorage.getItem('role'));
    this.displayProgressSpinnerInBlock = false;
    $('.parentName').html('Hồ sơ');
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.roleLogin.length; i++) {
      const length = this.dataSource.data.length;
      // console.log('aaaa')
      if (this.roleLogin[i] === 'UNIFORM.BANK.GDV') {
        this.isGDV = true;

      } else if (this.roleLogin[i] === 'UNIFORM.BANK.KSV') {
        this.isKSV = true;
      }
      // console.log(i);

    }

    this.mocl = true;
    const childUl = $('ul.tree-parent');
    if (childUl.hasClass('open')) {
      childUl.removeClass('open');
    }
    if (childUl.hasClass('child')) {
      childUl.removeClass('child');
    }
    this.click();
    this.getMission();
    this.subLoadingCallApi = this.helpService.progressEvent.subscribe((isShowProgress) => {
      this.isShowLoadingCallApi = isShowProgress;
      this.changeDetectionRef.detectChanges();
    });
  }

  getAccountList(id: string): void {
    this.accountService.getAccountList({ processId: id }).subscribe(rs => {
      if (rs.items !== undefined && rs.items.length > 0) {
        this.accounts = rs.items;
        this.menuTree.setAccountList(this.accounts);
        this.refreshTree();
      } else {
        this.accounts = null;
      }
    });

  }
  getPrintOut(id: string): void {
    this.accountService.getAccountList({ processId: id }).subscribe(rs => {
      if (rs.items !== undefined && rs.items.length > 0) {
        this.accounts = rs.items;
        this.menuTree.setPrintOut(this.accounts);
        this.refreshTree();
      } else {
        this.accounts = null;
      }
    });
  }

  getListCard(id: string): void {
    this.cardService.getListCard({ processId: id }).subscribe(rs => {
      if (rs.items !== undefined && rs.items.length > 0) {
        this.cards = rs.items;
        this.menuTree.setCard(this.cards);
        this.refreshTree();
      } else {
        this.cards = null;
      }
    });
  }
  refreshTree(): void {
    this.dataSource.data = [];
    this.dataSource.data = this.menuTree.getTree(this.authenticationService);
    // console.log(this.dataSource.data);

  }

  // ngAfterViewInit(){
  //   // $( ".custom-height" ).attr("style", `height: ${window.innerHeight -138}px`);
  //   // $( ".custom-card" ).attr("style", `height: ${window.innerHeight -137}px`);
  // }
  getOutHeight(): number {
    return window.innerHeight - 138;
  }

  getInHeight(): number {
    return window.innerHeight - 137;
  }
}
