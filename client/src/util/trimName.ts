
// remove the current users name from the group name if the group name is not special
export const trimGroupName = (groupName: string, currentName: string): string => {
  const split = groupName.split(', ');
  return split.reduce((acc, name, i) => {
    if(name !== currentName) {
      acc += name;
      if(i !== split.length-1) acc += ', ';
    }
    return acc;
  }, '');
}