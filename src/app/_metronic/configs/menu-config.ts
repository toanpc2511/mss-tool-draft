export interface IMenuConfigItem {
	title: string;
	root?: boolean;
	icon?: string;
	page?: string;
	translate?: string;
	bullet?: string;
	submenu?: IMenuConfigItem[];
    section? : boolean;
    separator? :boolean;
    permissionKey?: string;
}
