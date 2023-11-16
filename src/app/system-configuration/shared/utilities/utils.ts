import {Router} from '@angular/router';

const handleParamFilter = (valueForm) => {
  const arr = [];
  let arrOrl = [];
  let valueOrl: string = '';
  let arrOrEq = [];
  let valueOrEq: string = '';

  if (!valueForm) return;

  for (let key in valueForm) {
    if (valueForm[key]) {
      // const indexKey = key.indexOf('_');
      // let keyF: string = (key as string).slice(0, indexKey);
      // const operator: string = (key as string).slice(indexKey + 1);
      // if (operator === 'or') {
      //   arrOr.push(keyF);
      //   arr.push(`${arrOr.toString()}|${operator}|${valueForm[key]}`);
      //   console.log(arr);

      // } else {
      //   arr.push(`${keyF}|${operator}|${valueForm[key]}`);
      //   console.log(arr);

      // }

      const indexKey = key.indexOf('_');
      let keyF: string = (key as string).slice(0, indexKey);
      const operator: string = (key as string).slice(indexKey + 1);
      if (key.includes('ol')) {
        arrOrl.push(keyF);
        valueOrl = valueForm[key];
      } else if (key.includes('oeq')) {
        arrOrEq.push(keyF);
        valueOrEq = valueForm[key];
      } else {
        arr.push(`${keyF}|${operator}|${valueForm[key]}`);
      }
    }
  }
  if (valueOrl) {
    arr.push(`${arrOrl.toString()}|ol|${valueOrl}`);
  }
  if (valueOrEq) {
    arr.push(`${arrOrEq.toString()}|oeq|${valueOrEq}`);
  }
  return arr.join('&');
};

const getPath = (router: Router): any[] => {
  let navLinks = [];
  const frontendAction = JSON.parse(localStorage.getItem('frontendAction'));
  for (const key in frontendAction) {
    for (const key2 in frontendAction[key]) {
      console.log(frontendAction[key][key2].parentFEUrl);

      if (frontendAction[key][key2].parentFEUrl === router.url) {
        navLinks.push({
          label: frontendAction[key][key2].name,
          path: frontendAction[key][key2].feUrl,
        });
      }
    }
  }
  return navLinks;
};

export const utils = {handleParamFilter, getPath};
