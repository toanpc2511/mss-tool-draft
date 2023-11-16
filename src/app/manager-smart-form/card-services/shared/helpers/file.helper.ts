export class FileHelper {
  static downloadFileFromBase64(base64String, fileName, fileType): void {
    let a = document.createElement('a');
    a.href = `data:${fileType};base64,${base64String}`;
    a.download = fileName;
    a.click();
  }

  static isValidFile(file: File): boolean {
    const validFileTypes = [
      'image/png',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
    ];
    const isValidFile = validFileTypes.includes(file?.type);
    return isValidFile;
  }
}
