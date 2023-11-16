import {Component, OnInit} from '@angular/core';
import {Role} from '../../../_models/role';
import {PopupConfirmComponent} from '../../../_popup/popup-confirm.component';
import {DialogConfig} from '../../../_utils/_dialogConfig';
import {MatDialog} from '@angular/material/dialog';
import {MainFunction} from '../../../_models/mainFunction';
import {Action} from '../../../_models/action';
import {RoleService} from '../../../_services/role.service';
import {NotificationService} from '../../../_toast/notification_service';
import {FunctionService} from '../../../_services/function.service';
import {ActionService} from '../../../_services/action.service';
import {SelectionModel} from '@angular/cdk/collections';
import {FlatTreeControl} from '@angular/cdk/tree';
import {Injectable} from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {BehaviorSubject} from 'rxjs';

/**
 * Node for to-do item
 */
export class TodoItemNode {
  children: TodoItemNode[];
  item: string;
  id: string;
  code: string;
}

/** Flat to-do item node with expandable and level information */
export class TodoItemFlatNode {
  item: string;
  id: string;
  code: string;
  level: number;
  expandable: boolean;
}

/**
 * The Json object for to-do list data.
 */
const TREE_DATA = {
  // Groceries: {
  //   a: null,
  //   b: null,
  //   3: null,
  //   Fruits: {
  //     Apple: null,
  //     Berries: ['Blueberry', 'Raspberry'],
  //     Orange: null,
  //   },
  // },
  // Reminders: [
  //   {id: '1', code: 'ACTION_BCD', item: 'Action 1'},
  //   {id: '2', code: 'ACTION_BCD2', item: 'Action 2'}
  // ],
};

/**
 * Checklist database, it can build a tree structured Json object.
 * Each node in Json object represents a to-do item or a category.
 * If a node is a category, it has children items and new items can be added under the category.
 */
@Injectable()
export class ChecklistDatabase {
  dataChange = new BehaviorSubject<TodoItemNode[]>([]);

  get data(): TodoItemNode[] {
    return this.dataChange.value;
  }

  constructor() {
    this.initialize();
  }

  initialize(): void {
    // Build the tree nodes from Json object. The result is a list of `TodoItemNode` with nested
    //     file node as children.
    const data = this.buildFileTree(TREE_DATA, 0);
    console.log(data);
    // Notify the change.
    this.dataChange.next(data);
  }

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `TodoItemNode`.
   */
  buildFileTree(obj: { [key: string]: any }, level: number): TodoItemNode[] {

    return Object.keys(obj).reduce<TodoItemNode[]>((accumulator, key) => {
      // console.log(obj, key);
      const value = obj[key];
      const node = new TodoItemNode();
      node.item = key;
      node.id = key;
      if (value != null) {
        if (typeof value === 'object') {
          node.children = this.buildFileTree(value, level + 1);
        } else {
          node.item = value;
        }
      }

      accumulator.push(node);
      return accumulator;
    }, []);
  }

  buildTree(treeData): void {
    const data = this.buildFileTree(treeData, 0);
    // Notify the change.
    this.dataChange.next(data);
  }

  /** Add an item to to-do list */
  insertItem(parent: TodoItemNode, name: string): any {
    if (parent.children) {
      parent.children.push({item: name} as TodoItemNode);
      this.dataChange.next(this.data);
    }
  }

  updateItem(node: TodoItemNode, name: string): any {
    node.item = name;
    this.dataChange.next(this.data);
  }
}

@Component({
  selector: 'app-mapping',
  templateUrl: './mapping.component.html',
  styleUrls: ['./mapping.component.scss'],
  providers: [ChecklistDatabase]
})
export class MappingComponent implements OnInit {

  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<TodoItemFlatNode, TodoItemNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<TodoItemNode, TodoItemFlatNode>();

  /** A selected parent node to be inserted */
  selectedParent: TodoItemFlatNode | null = null;

  /** The new item's name */
  newItemName = '';

  treeControl: FlatTreeControl<TodoItemFlatNode>;

  treeFlattener: MatTreeFlattener<TodoItemNode, TodoItemFlatNode>;

  dataSource: MatTreeFlatDataSource<TodoItemNode, TodoItemFlatNode>;

  /** The selection for checklist */
  checklistSelection = new SelectionModel<TodoItemFlatNode>(true /* multiple */);


  lstRoles: Role[] = [];
  objRole: Role = new Role();
  addLstOldLstCheckAction = [];
  arrayBoth = false;
  lstAllFunction: MainFunction[] = [];
  lstAllAction: Action[] = [];
  objFun: any = {};
  newLstAction = [];
  lstTabActionInFuntion = [];
  numberCheck = 0;
  disabled = false;
  actionIds = [];
  functionId = '';

  constructor(private dialog: MatDialog,
              private roleService: RoleService,
              private notificationService: NotificationService,
              private functionService: FunctionService,
              private actionService: ActionService,
              private checklistDatabase: ChecklistDatabase) {
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren,
    );
    this.treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    checklistDatabase.dataChange.subscribe(data => {
      this.dataSource.data = data;
      // console.log(this.checklistSelection);
    });
  }

  ngOnInit(): void {
    this.getLstAllRole();
    this.getListAllFunction(1);

  }

  selectRoleInTab(item: any, index: any): void {
    this.objRole = item;
    this.addLstOldLstCheckAction = [];
    const data = {};
    // tslint:disable-next-line:no-string-literal
    data['number'] = 1;
    if (this.arrayBoth) {
      this.dialog.open(PopupConfirmComponent, DialogConfig.configDialogConfirm(data));
    }
    if (!this.arrayBoth) {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.lstRoles.length; i++) {
        if (this.lstRoles[i].id === item.id) {
          // tslint:disable-next-line:no-string-literal
          this.lstRoles[i]['onFocus'] = true;
          continue;
        } else {
          // tslint:disable-next-line:no-string-literal
          this.lstRoles[i]['onFocus'] = false;
        }
      }
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.lstAllFunction.length; i++) {
        const char = this.lstAllFunction[i].roles !== null ? this.lstAllFunction[i].roles : '';
        if (char.search(item.code) >= 0) {
          // tslint:disable-next-line:no-string-literal
          this.lstAllFunction[i]['checked'] = true;
        }
      }
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.lstAllAction.length; i++) {
        this.lstAllAction[i].checked = undefined;
        // tslint:disable-next-line:no-string-literal
        this.lstAllAction[i]['checkedFunctionId'] = undefined;
      }
      this.forcusFunction();
    }
  }

  forcusFunction(): void {
    for (let index = 0; index < this.lstAllFunction.length; index++) {
      const char = this.lstAllFunction[index].roles !== null ? this.lstAllFunction[index].roles : '';
      if (char.search(this.objRole.code) >= 0) {
        // tslint:disable-next-line:no-string-literal
        this.lstAllFunction[index]['checked'] = true;
      } else {
        // tslint:disable-next-line:no-string-literal
        this.lstAllFunction[index]['checked'] = false;
      }
      if (index === 0) {
        this.objFun = this.lstAllFunction[index];
        // tslint:disable-next-line:no-string-literal
        this.lstAllFunction[index]['onFocus'] = true;
        // tslint:disable-next-line:no-string-literal
        this.lstAllFunction[index]['color'] = true;
        // tslint:disable-next-line:no-string-literal
        this.lstAllFunction[index]['returnColor'] = false;
        this.showAction(this.objRole, this.lstAllFunction[index]);
      } else {
        // tslint:disable-next-line:no-string-literal
        this.lstAllFunction[index]['onFocus'] = false;
        // tslint:disable-next-line:no-string-literal
        this.lstAllFunction[index]['color'] = false;
        // tslint:disable-next-line:no-string-literal
        this.lstAllFunction[index]['returnColor'] = true;
      }
    }

  }

  showAction(objRole: any, objFuntion: any): void {
    // console.log('objFuntion', objFuntion);
    this.functionId = objFuntion.id;
    this.newLstAction = [];
    // this.oldLstCheckAction = []
    this.addLstOldLstCheckAction = [];
    this.lstTabActionInFuntion = [];
    // tslint:disable-next-line:prefer-for-of
    for (let index = 0; index < this.lstAllAction.length; index++) {

      const char = this.lstAllAction[index].roles !== null ? this.lstAllAction[index].roles : '';
      if (char.search(objRole.code) >= 0 && objFuntion.code === this.lstAllAction[index].functionCode) {
        // tslint:disable-next-line:no-string-literal
        this.lstAllAction[index]['checkedFunctionId'] = this.lstAllAction[index].functionId;
        if (this.lstAllAction[index].checked !== undefined) {
          // tslint:disable-next-line:no-string-literal
          this.lstAllAction[index]['checked'] = this.lstAllAction[index].checked ? true : false;
        } else {
          // tslint:disable-next-line:no-string-literal
          this.lstAllAction[index]['checked'] = true;
        }
        this.addLstOldLstCheckAction.push(this.lstAllAction[index]);
        this.numberCheck = this.addLstOldLstCheckAction.length;

      }
      if (this.lstAllAction[index].functionCode === objFuntion.code) {
        this.newLstAction.push(this.lstAllAction[index]);

      }

    }
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.newLstAction.length; i++) {
      const char = this.newLstAction[i].roles !== null ? this.newLstAction[i].roles : '';
      this.newLstAction[i].parentName = this.findParentName(this.newLstAction[i].parentId);
      if (char.search(objRole.code) >= 0) {
        // tslint:disable-next-line:no-string-literal
        this.newLstAction[i]['checked'] = this.newLstAction[i].checked ? true : false;
        this.lstTabActionInFuntion.push(this.newLstAction[i]);
      }
    }
    // console.log('this.newLstAction', this.newLstAction);
    this.buildTree(this.newLstAction);
    this.checklistSelection.clear();
    // this.treeControl.expandAll();
    this.newLstAction.forEach((item, index) => {
      if (item.checked) {
        this.treeControl.dataNodes.forEach((node) => {
          if (item.id + '_' + item.name === node.item) {
            this.checklistSelection.select(node);
            return;
          }
        });
        // this.checklistSelection.select(nodeSelected[0]);
      }
    });
    // this.checklistSelection.select(this.treeControl.dataNodes[1]);

  }

  findParentName(parentId): string {
    const frontendAction = this.newLstAction;
    let parentName = '';
    for (const key in frontendAction) {
      if (frontendAction[key].id === parentId) {
        if (!frontendAction[key].parentId) {
          parentName = frontendAction[key].name;
        } else {
          parentName = this.findParentName(frontendAction[key].parentId) + ' - ' + frontendAction[key].name;
        }
      }
      // this.streets.push({
      //   textItem: frontendAction[key].name,
      //   pathImage: frontendAction[key].imagePath,
      //   urlRouter: frontendAction[key].feUrl
      // });
    }
    return parentName;
  }

  viewDetail(item: any): void {
    this.objFun = {};
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.lstAllFunction.length; i++) {
      if (this.lstAllFunction[i].id === item.id) {
        this.objFun = item;
        // tslint:disable-next-line:no-string-literal
        this.lstAllFunction[i]['onFocus'] = true;
        // tslint:disable-next-line:no-string-literal
        this.lstAllFunction[i]['color'] = true;
        // tslint:disable-next-line:no-string-literal
        this.lstAllFunction[i]['returnColor'] = false;
        continue;
      } else {
        // tslint:disable-next-line:no-string-literal
        this.lstAllFunction[i]['onFocus'] = false;
        // tslint:disable-next-line:no-string-literal
        this.lstAllFunction[i]['returnColor'] = true;
        // tslint:disable-next-line:no-string-literal
        this.lstAllFunction[i]['color'] = false;
      }
    }
    this.showAction(this.objRole, item);

  }

  selectAction(item: any, e): void {
    if (e.target.checked) {
      // tslint:disable-next-line:no-shadowed-variable
      this.lstAllAction.forEach(e => {
        if (item.id === e.id) {
          e.checked = true;
        }

      });
      // tslint:disable-next-line:prefer-for-of
      for (let index = 0; index < this.lstAllFunction.length; index++) {
        if (item.functionId === this.lstAllFunction[index].id) {
          // tslint:disable-next-line:no-string-literal
          this.lstAllFunction[index]['checked'] = true;
        }
      }
    } else {
      // tslint:disable-next-line:no-shadowed-variable
      this.lstAllAction.forEach(e => {
        if (e.id === item.id) {
          e.checked = false;
        }
      });
      if (this.lstTabActionInFuntion.length > 0) {
        // tslint:disable-next-line:no-shadowed-variable
        const arr = this.lstTabActionInFuntion.filter(e => e.checked);
        if (arr.length === 0) {
          // tslint:disable-next-line:no-shadowed-variable
          this.lstAllFunction.forEach(e => {
            if (item.functionId === e.id) {
              // tslint:disable-next-line:no-string-literal
              e['checked'] = false;
            }
          });
        }
      } else {
        // tslint:disable-next-line:no-shadowed-variable
        const lst = this.lstAllAction.filter(e => e.checked && e.functionId === item.functionId);
        if (lst.length === 0) {
          // tslint:disable-next-line:no-shadowed-variable
          this.lstAllFunction.forEach(e => {
            if (item.functionId === e.id) {
              // tslint:disable-next-line:no-string-literal
              e['checked'] = false;
            }
          });
        }
      }

    }
    this.openOrCloseButton(item, e);
    this.disabled = this.arrayBoth ? true : false;

  }

  saveDefineRole(): void {
    this.actionIds = [];
    const obj = {};
    const roles = {
      roles: []
    };
    let lstActionChecked = this.lstAllAction.filter(e => e.checked);
    // tslint:disable-next-line:prefer-for-of
    for (let index = 0; index < this.lstAllAction.length; index++) {
      const char = this.lstAllAction[index].roles !== null ? this.lstAllAction[index].roles : '';
      if (char.search(this.objRole.code) >= 0) {
        // tslint:disable-next-line:no-string-literal
        if (this.lstAllAction[index]['checked'] !== undefined) {
          // tslint:disable-next-line:no-string-literal
          if (this.lstAllAction[index]['checked']) {
            lstActionChecked.push(this.lstAllAction[index]);
          }
        } else {
          lstActionChecked.push(this.lstAllAction[index]);
        }
      }
    }
    lstActionChecked = lstActionChecked.filter((element, i) => i === lstActionChecked.indexOf(element));
    lstActionChecked.forEach(e => {
      this.actionIds.push(e.id);
    });
    // tslint:disable-next-line:no-string-literal
    obj['roleId'] = this.objRole.id;
    // tslint:disable-next-line:no-string-literal
    obj['actionIds'] = this.actionIds.length > 0 ? this.actionIds : [];
    roles.roles.push(obj);

    this.roleService.mapAction(roles).subscribe(rs => {
      setTimeout(() => {
        // tslint:disable-next-line:prefer-for-of
        for (let index = 0; index < rs.responseStatus.codes.length; index++) {
          if (rs.responseStatus.codes[index].code === '200') {
            this.notificationService.showSuccess('Map quyền thành công', '');
            this.arrayBoth = false;
            this.disabled = false;
            // this.forcusFirtRow()
            this.getListAllFunction(5);
          } else {
            this.notificationService.showError('Map quyền thất bại', '');
          }

        }
      }, 1000);

    }, error => {

    });
  }

  onSave(): void {
    console.log('this.objRole.id', this.objRole.id);
    const obj: { roleId: string, functionId: string, actionIds: any} = {
      roleId: '',
      functionId: '',
      actionIds: []
    };
    const roles = {
      roles: []
    };
    const listActionSelected = new Set();
    // this.treeControl.dataNodes.forEach((node) => {
    //
    // });
    // let index = 1;
    // this.newLstAction.forEach((action) => {
    //   const actionSelected = this.checklistSelection.selected.find((nodeSelected) => {
    //     // console.log('nodeSelected.name', nodeSelected.item);
    //     return action.id + '_' + action.name === nodeSelected.id;
    //     // if (action.id + '_' + action.name   === nodeSelected.id) {
    //     //   listActionSelected.add(action.id);
    //     //   if (action.parentId)
    //     //   {
    //     //     listActionSelected.add(action.parentId);
    //     //   }
    //     //   // console.log(index++, nodeSelected.item);
    //     //   return;
    //     // }
    //     // console.log(index);
    //   });
    //   if (actionSelected && action.id + '_' + action.name   === actionSelected.id) {
    //
    //     listActionSelected.add(action.id);
    //     if (action.parentId)
    //     {
    //       listActionSelected.add(action.parentId);
    //     }
    //     // console.log(index++, nodeSelected.item);
    //     return;
    //   }
    // });
    this.checklistSelection.selected.forEach((nodeSelected) => {
      const action = this.lstAllAction.find(act => act.id + '_' + act.name  === nodeSelected.id);
      listActionSelected.add(action.id);
      if (action.parentId)
      {
        listActionSelected.add(action.parentId);
      }
    });
    // tslint:disable-next-line:no-string-literal
    obj.roleId = this.objRole.id;
    obj.functionId = this.functionId;
    // tslint:disable-next-line:no-string-literal
    obj.actionIds = [...listActionSelected];
    // roles.roles.push(obj);

    console.log('action selected', [...listActionSelected]);
    // console.log(this.checklistSelection.selected, this.treeControl.dataNodes);
    this.roleService.mapActionNew(obj).subscribe(rs => {
      setTimeout(() => {
        // tslint:disable-next-line:prefer-for-of
        for (let index = 0; index < rs.responseStatus.codes.length; index++) {
          if (rs.responseStatus.codes[index].code === '200') {
            this.notificationService.showSuccess('Map quyền thành công', '');
            this.arrayBoth = false;
            this.disabled = false;
            // this.forcusFirtRow()
            this.getListAllFunction(5);
          } else {
            this.notificationService.showError('Map quyền thất bại', '');
          }

        }
      }, 1000);

    }, error => {
      this.notificationService.showError('Lỗi backend', '');
    });
  }

  openOrCloseButton(item, e): void {
    let ar = [];
    let arrCheck = [];
    if (this.lstTabActionInFuntion.length > 0) {
      // tslint:disable-next-line:no-shadowed-variable
      const arr = this.lstTabActionInFuntion.filter(e => !e.checked);
      // tslint:disable-next-line:no-shadowed-variable
      ar = this.lstAllAction.filter(e => e.checked);
      // tslint:disable-next-line:no-shadowed-variable
      arrCheck = this.lstTabActionInFuntion.filter(e => e.checked);
      if (arr.length > 0) {
        this.arrayBoth = true;
      } else {
        if (this.arrayBoth && ar.length === arrCheck.length) {
          this.arrayBoth = false;
        } else {
          this.arrayBoth = true;
        }
      }
    } else {
      // tslint:disable-next-line:no-shadowed-variable
      ar = this.lstAllAction.filter(e => e.checked && e.functionId !== item.functionId);
      if (e.target.checked) {
        if (!this.arrayBoth && this.lstTabActionInFuntion.length === 0) {
          this.arrayBoth = true;
        }
        return;
      } else {
        // tslint:disable-next-line:no-shadowed-variable
        const lst = this.lstAllAction.filter(e => e.checked && e.functionId === item.functionId);
        if (ar.length === this.numberCheck && lst.length === 0) {
          this.arrayBoth = false;
        }
      }
    }
  }

  getListAllFunction(index: any): void {
    this.functionService.getAll().subscribe(rs => {
      this.lstAllFunction = rs.items;
      this.lstAllFunction = this.lstAllFunction.sort((obj1, obj2) => {
        if (obj1.name > obj2.name) {
          return 1;
        }

        if (obj1.name < obj2.name) {
          return -1;
        }

        return 0;
      });

      this.getListAllAction(index);
    });
  }

  getListAllAction(index: any): void {
    this.actionService.getAllAction().subscribe(rs => {
      this.lstAllAction = rs.items;
      if (index === 5) {
        this.forcusFunction();
      }
    });
  }

  getLstAllRole(): void {
    this.roleService.getLstAllRoles().subscribe(rs => {
      this.lstRoles = rs.items.sort((obj1, obj2) => {
        if (obj1.name > obj2.name) {
          return 1;
        }

        if (obj1.name < obj2.name) {
          return -1;
        }

        return 0;
      });
      if (this.lstRoles !== null && this.lstRoles.length > 0) {
        // this.lstAllRoles = this.lstRoles;
      }
    }, err => {
    });
  }

  getLevel = (node: TodoItemFlatNode) => node.level;

  isExpandable = (node: TodoItemFlatNode) => node.expandable;

  getChildren = (node: TodoItemNode): TodoItemNode[] => node.children;

  hasChild = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.expandable;

  hasNoContent = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.item === '';

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: TodoItemNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode =
      existingNode && existingNode.item === node.item ? existingNode : new TodoItemFlatNode();
    flatNode.item = node.item;
    flatNode.id = node.id;
    flatNode.level = level;
    flatNode.expandable = !!node.children?.length;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  };

  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    // const descAllSelected =
    //   descendants.length > 0 &&
    //   descendants.every(child => {
    //     return this.checklistSelection.isSelected(child);
    //   });
    const descAllSelected =
      descendants.length > 0 &&
      descendants.every(child => {
        return this.checklistSelection.isSelected(child);
      });
    // console.log('descAllSelected', descAllSelected);
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: TodoItemFlatNode): void {
    console.log(node);
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    console.log('descendants', descendants);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    // Force update for the parent
    descendants.forEach(child => this.checklistSelection.isSelected(child));
    this.checkAllParentsSelection(node);
  }

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  todoLeafItemSelectionToggle(node: TodoItemFlatNode): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: TodoItemFlatNode): void {
    let parent: TodoItemFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: TodoItemFlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected =
      descendants.length > 0 &&
      descendants.every(child => {
        return this.checklistSelection.isSelected(child);
      });
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  /* Get the parent node of a node */
  getParentNode(node: TodoItemFlatNode): TodoItemFlatNode | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  /** Select the category so we can insert the new item. */
  addNewItem(node: TodoItemFlatNode): void {
    const parentNode = this.flatNodeMap.get(node);
    this.checklistDatabase.insertItem(parentNode!, '');
    this.treeControl.expand(node);
  }

  buildTree(treeData): void {
    // const parentNode = this.flatNodeMap.get(node);
    const treeDataSource = {};
    treeData.forEach((item) => {
      if (!item.parentId) {
        let value = '';
        let key = item.name;
        const children = this.getChildrenNode(item.id, treeData);
        // console.log('children', children);
        if (Object.keys(children).length > 0) {
          value = children;
        } else {
          value = item.id + '_' + item.name;
          // treeDataSource[item.name] = ;
        }
        key = item.id + '_' + item.name;
        treeDataSource[key] = value;
        // treeDataSource.child
      }

    });
    // console.log(treeDataSource);
    this.checklistDatabase.buildTree(treeDataSource);
    // const todoItemFlatNode = new TodoItemFlatNode();
    // todoItemFlatNode.item = 'Duyệt';
    // todoItemFlatNode.level = 1;
    // todoItemFlatNode.expandable = false;
    // this.checklistSelection.select(todoItemFlatNode);
    // this.treeControl.expand(node);
  }

  getChildrenNode(parentId, listActions): any {
    const nodeChild = {};
    listActions.forEach(item => {
      if (item.parentId === parentId) {
        let value = '';
        let key = item.name;
        const child = this.getChildrenNode(item.id, listActions);
        if (Object.keys(child).length > 0) {
          value = child;
        } else {
          value = item.id + '_' + item.name;
        }
        key = item.id + '_' + item.name;
        nodeChild[key] = value;
      }
    });
    // console.log('children', nodeChild);
    return nodeChild;
  }

  /** Save the node to database */
  saveNode(node: TodoItemFlatNode, itemValue: string): void {
    const nestedNode = this.flatNodeMap.get(node);
    this.checklistDatabase.updateItem(nestedNode!, itemValue);
  }
}
