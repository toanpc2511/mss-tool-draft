export const findParentName = (parentId: string, listAllAction) => {
  // const frontendAction = JSON.parse(localStorage.getItem("action")).filter(action => action.feUrl);
  const frontendAction = listAllAction.filter(action => action.feUrl);

  let parentName = '';
  for (const key in frontendAction) {

    if (frontendAction[key].id === parentId) {
      if (!frontendAction[key].parentId) {
        parentName = frontendAction[key].name;
      } else {
        parentName = findParentName(frontendAction[key].parentId, listAllAction) + ' - ' + frontendAction[key].name ;
      }
    }
  }
  return parentName;
};
