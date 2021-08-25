export interface IConfirmModalData {
  title: string;
  message: string;
  button: {
    class: 'btn-primary' | 'btn-danger' | 'btn-secondary';
    title: string;
  };
}
