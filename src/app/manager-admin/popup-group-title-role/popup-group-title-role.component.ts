import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Role } from 'src/app/_models/role';
import { Title } from 'src/app/_models/title';
import { RoleService } from 'src/app/_services/role.service';
import { TitleService } from 'src/app/_services/title.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/_toast/notification_service';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
@Component({
    selector: 'app-popup-group-title-role',
    templateUrl: './popup-group-title-role.component.html',
    styleUrls: ['./popup-group-title-role.component.scss']
})
export class PopupGroupTitleRoleComponent implements OnInit {
    @ViewChild('select') select: MatSelect;
    lstTitles: Title[] = []
    lstRoles: Role[] = []
    role: Role = new Role()
    dropdownSettings: any = {}
    selectedItems: any[]
    myForm: FormGroup
    ShowFilter = false
    submitted = false
    title: any
    name: any
    id: any
    checkTitle = false
    roleIds = []
    selectAllTitle: boolean
    formValidator: {}
    allSelected = false
    
    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
        private dialogRef: MatDialogRef<PopupGroupTitleRoleComponent>,
        private titleService: TitleService,
        private roleService: RoleService, private fb: FormBuilder,
        private notificationService: NotificationService) { }
    ngOnInit() {
        this.getAllRole()
        this.getLstTitle()
        this.dropdownSettings = {
            singleSelection: false,
            idField: 'id',
            textField: 'name',
            selectAllText: 'Chọn tất cả',
            unSelectAllText: 'Hủy chọn tất cả',
            itemsShowLimit: 2,
            allowSearchFilter: this.ShowFilter
        }
        this.myForm = new FormGroup({
            role: new FormControl({ value: '', disabled: false }, Validators.required),
            title: new FormControl('', Validators.required)
        })

    }
    
    toggleAllSelection() {
        if (this.allSelected) {
            this.select.options.forEach((item: MatOption) => item.select())
            this.lstRoles.forEach(e => {
                this.roleIds.push(e.id)
            })
        } else {
            this.select.options.forEach((item: MatOption) => item.deselect())
            this.roleIds = []
        }
    }
    optionClick() {
        let newStatus = true;
        this.select.options.forEach((item: MatOption) => {
            if (!item.selected) {
                newStatus = false
                this.roleIds = this.roleIds.filter(e => e !== item.value && !item.selected)
            }else{
                this.roleIds.push(item.value)
            }
        })
        this.allSelected = newStatus
    }
    getLstTitle() {
        this.titleService.getAllTitle().subscribe(rs => {
            this.lstTitles = rs.items
        }, err => { })
    }
    getAllRole() {
        this.roleService.getLstAllRoles().subscribe(rs => {
            this.lstRoles = rs.items
        })
    }
    get f() {
        return this.myForm.controls;
    }
    selectTitle(item: any) {
        if (item == "0") {
            this.checkTitle = true
            return
        } else {
            this.checkTitle = false
            this.lstTitles.forEach(e => {
                if (e.name == item.name) {
                    this.title = e.code
                    this.name = e.name
                    this.id = e.id
                }
            });
        }
    }
    // onDeSelect(items: any) {
    //     if (this.roleIds.length > 0) {
    //         this.roleIds = this.roleIds.filter(e => e.id !== items.id)
    //     }
    // }
    // onSelectAll(items: any) {
    //     items.forEach(e => {
    //         this.roleIds.push(e)
    //     });
    // }
    // onItemSelect(item: any) {
    //     this.roleIds.push(item)

    // }
    // onDeSelectAll(items: any) {
    //     this.roleIds = items.length == 0 ? [] : []
    // }
    save(id: any) {
        let rolIds = []
        this.submitted = true
        if (this.myForm.invalid || this.checkTitle) {
            return;
        }
        rolIds = this.roleIds.filter((element, i) => i === this.roleIds.indexOf(element))
        let obj = {}
        obj['id'] = this.id
        obj['name'] = this.name
        obj['code'] = this.title
        obj['roleIds'] = rolIds
        this.titleService.updateTitle(obj).subscribe(rs => {
            for (let index = 0; index < rs.responseStatus.codes.length; index++) {
                if (rs.responseStatus.codes[index].code === "200") {
                    this.notificationService.showSuccess("Map role vào chức danh thành công", "")
                    this.dialogRef.close(id);
                } else {
                    this.notificationService.showError("Map role vào chức danh thất bại", "")
                }
            }
        }, err => {

        })
    }
    closeDialog(index: any) {
        this.dialogRef.close(index);
    }
}
