export const removeObjectWithId = (arr: any, id: string) => {
    // Making a copy with the Array from() method
    const arrCopy = Array.from(arr);
  
    const objWithIdIndex = arrCopy.findIndex((obj: any) => obj.id === id);
    arrCopy.splice(objWithIdIndex, 1);
    return arrCopy;
  }