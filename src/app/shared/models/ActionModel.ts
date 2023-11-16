export class ActionModel {
  actionName: string;
  actionIcon: string;
  hiddenType?: 'disable' | 'none';
  actionClick: () => any;
}
