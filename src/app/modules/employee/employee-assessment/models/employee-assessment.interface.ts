export interface IEmployeeAssessment {
  quantityOneStar: number;
  quantityTwoStar: number;
  quantityThreeStar: number;
  quantityFourStar: number
  quantityFiveStar: number
  quantityMedium: number;
  page: number;
  size: number;
  totalElement: number;
  evaluationResponses: IListEmployeeAssessment[];
}

export interface IListEmployeeAssessment {
  employeeId: number;
  accountId: number;
  code: string;
  name: string;
  oneStar: number;
  twoStar: number;
  threeStar: number;
  fourStar: number;
  fiveStar: number;
  voteMedium: number;
  pointEvaluation: number;
  content: string;
  totalPoint: number;
}

