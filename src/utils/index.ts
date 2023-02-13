import fs from "fs";

export const getAllData = (pathFile: string) => {
  const result = fs.readFileSync(pathFile, "utf8");
  return JSON.parse(result);
};

export const createData = (pathFile: string, data: any) => {
  const stringifyData = JSON.stringify(data, null, 2);
  fs.writeFileSync(pathFile, stringifyData)
}
