import { Observable } from 'rxjs';
import { HttpService } from 'src/app/shared/services/http.service';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class CategoryService {
	constructor(private http: HttpService) {}
	getListCategory(): Observable<any> {
		return this.http.get<ICategory[]>('categories');
	}
	createCategory(body) {
		return this.http.post('categories', body);
	}
	editCategory(body, id: string) {
		return this.http.put(`categories/${id}`, body);
	}
	deleteCategory(id: string) {
		return this.http.delete(`categories/${id}`);
	}
}

export interface ICategory {
	id: string;
	code: string;
	name: string;
	createdA: string;
	updatedAt: string;
}
