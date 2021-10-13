import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'isChecked'
})
export class IsCheckedPipe implements PipeTransform {
	transform(selectedValue: { name: string; type: string }[], type: string): boolean {
		return selectedValue.some((s) => s.type === type);
	}
}
