export function preventLetter(e: KeyboardEvent): void {
  const key = e.key ? e.key : e.which;
  if (!e.ctrlKey && (key < '0' || key > '9') && key !== 'Backspace' && key !== 'Enter' && key !== '.') {
    e.preventDefault();
  }
}
