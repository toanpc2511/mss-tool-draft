import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'transformList'
})
export class TransformValueListPipe implements PipeTransform {
	transform(value: string[]): string {
		let result = '';
		if (value.length < 3) {
			result = value.join(', ');
			return result;
		}
		result = `${value.slice(0, 2).join(', ')}, và  ${value.slice(2).length} danh mục khác`;
		return result;
	}
}
