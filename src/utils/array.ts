import includes from 'lodash.includes';

export const hasDuplicates = <T>(array: T[], key: keyof T): boolean => {
  const elements: any[] = [];
  let foundDuplicate = false;

  for (let i = 0; i < array.length && !foundDuplicate; i++) {
    if (!includes(elements, key)) {
      elements.push(array[i][key]);
    } else {
      foundDuplicate = true;
      break;
    }
  }

  return foundDuplicate;
};
