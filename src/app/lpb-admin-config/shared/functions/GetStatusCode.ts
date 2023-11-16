export const getStatusCode = (statusCode: string) => {
  if (statusCode === 'A') {
    return 'Hoạt động';
  } else if (statusCode === 'I') {
    return 'Không hoạt động';
  } else if (statusCode === 'C') {
    return 'Đóng';
  } else {
    return '';
  }
};
