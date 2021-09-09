import { Pipe, PipeTransform } from '@angular/core';
import { IVehicle } from './partner.service';

@Pipe({
	name: 'carsDisplay'
})
export class CarsDisplayPipe implements PipeTransform {
	transform(vehicles: string[], isToolTip?: boolean): string {
		const carLength = vehicles?.length;
		if (carLength > 2 && !isToolTip) {
			return vehicles.slice(0, 2).join(', ') + ` và ${carLength - 2} xe khác`;
		}
		if (!carLength) {
			return null;
		}
		return vehicles.join(', ');
	}
}
