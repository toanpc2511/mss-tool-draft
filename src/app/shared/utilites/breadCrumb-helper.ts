declare var $: any;

export class BreadCrumbHelper {
  static setBreadCrumb(names: string[]){
    $('.parentName').html(names[0]);

    let children = names.slice(1);
    let childrenHtmlTxt = children.reduce((acc, crr) => {
      return acc + `<div class='breadcrumb-item active'>${crr}</div>`
    } ,'');
    childrenHtmlTxt = `<div class='d-flex'>${childrenHtmlTxt}</div>`;
    $('.childName').html(childrenHtmlTxt);
  }
}
