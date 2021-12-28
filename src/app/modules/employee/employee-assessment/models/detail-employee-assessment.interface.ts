export interface IDetailEmployeeAssessment {
  oneStar: number;
  twoStar: number;
  threeStar: number;
  fourStar: number;
  fiveStar: number;
  page: number;
  size: number;
  totalElement: number;
  codeEmployee: string;
  nameEmployee: string;
  evaluationDetails: IEvaluationDetail[];
}

export interface IEvaluationDetail {
  date: string;
  code: string;
  stationName: string;
  vote: number;
  content: string;
  employeeId: number;
  codeEmployee: string;
  nameEmployee: string;
}
