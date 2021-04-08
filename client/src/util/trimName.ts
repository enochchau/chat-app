
// remove the current users name from the group name if the group name is not special
export const trimGroupName = (groupName: string, currentName: string): string => {
  const split = groupName.split(', ');
  const out = split.reduce((acc, name, i) => {
    if(name !== currentName) {
      acc += name + ', ';
    }
    return acc;
  }, '');
  return out.slice(0,-2);
}