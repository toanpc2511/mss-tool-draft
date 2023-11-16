export function isTimeOutResponse(res) {
  const timeOutErrorCode = ['UNI-02', '001'];
  if (
    res &&
    res.responseStatus.codes?.some((data) =>
      timeOutErrorCode.includes(data.code)
    )
  ) {
    return true;
  }

  return false;
}
