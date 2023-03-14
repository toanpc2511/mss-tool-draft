import { SharedModule } from './../../shared/shared.module';
import { CategoryManagementComponent } from './category-management.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryManagementRoutingModule } from './category-management-routing.module';
import { ModalCategoryComponent } from './modal-category/modal-category.component';

@NgModule({
	declarations: [CategoryManagementComponent, ModalCategoryComponent],
	imports: [CommonModule, CategoryManagementRoutingModule, SharedModule]
})
export class CategoryManagementModule {}
