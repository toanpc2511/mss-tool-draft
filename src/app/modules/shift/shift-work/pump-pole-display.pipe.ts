import { PumpPoleResponse } from './../shift.service';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'pumpPoleDisplay'
})
export class PumpPoleDisplayPipe implements PipeTransform {
	transform(pumpPoles: PumpPoleResponse[]): string {
		return pumpPoles?.map((p) => p.name).join(', ') || '';
	}
}
