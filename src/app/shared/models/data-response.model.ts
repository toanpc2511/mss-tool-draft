/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import camelize from 'camelize';
export class DataResponse<T> {
	meta: {
		code: string;
		errors: [
			{
				description: string;
				field: string;
			}
		];
		message: string;
		page: number;
		size: number;
		total: number;
	};
	data?: T;
	constructor(response: any) {
		this.meta = response.meta;
		this.data = camelize(response.data) as T;
	}
}
