export class DistrictRequest {
  cityName: string;
  page = 1;
  size = 1000;
  constructor(cityCode: string) {
    this.cityName = cityCode;
  }
}

export class WardRequest {
  districtName: string;
  page = 1;
  size = 1000;
  constructor(districtCode: string) {
    this.districtName = districtCode;
  }
}
