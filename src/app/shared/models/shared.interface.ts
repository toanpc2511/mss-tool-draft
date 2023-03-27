export interface IImage {
	id: number;
	type: 'img';
	url: string;
	name: string;
	face: EFace;
}

export enum EFace {
	FRONT = 'FRONT',
	BACK = 'BACK'
}

export interface ICategory {
	id: string;
	name: string;
	createdA: string;
	updatedAt: string;
}

export interface IProduct {
	createdAt: string;
	id: string;
	images: string;
	model: string;
	name: string;
	price: number;
	quantity: number;
	updatedAt: string;
	category: any;
	description: string;
	sales: number;
}

export interface IBrand {
	id: string;
	name: string;
	categoryBrands: ICategoryBrand[];
	catagories?: ICategory[];
	categoryNames: string[];
	categoryIds: string[];
}

export interface ICategoryBrand {
	id: string;
	category: ICategory;
}
