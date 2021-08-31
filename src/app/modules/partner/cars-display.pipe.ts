import { Pipe, PipeTransform } from '@angular/core';
import { ICar } from './partner.service';

@Pipe({
	name: 'carsDisplay'
})
export class CarsDisplayPipe implements PipeTransform {
	transform(cars: ICar[], isToolTip?: boolean): string {
		const carLength = cars.length;
		if (carLength > 2 && !isToolTip) {
			return (
				cars
					.slice(0, 2)
					.map((c) => c.name)
					.join(', ') + ` và ${carLength - 2} xe khác`
			);
		}
		return cars.map((c) => c.name).join(', ');
	}
}
