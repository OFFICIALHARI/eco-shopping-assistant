export default function stringToJSON(data: string): any {
  const lines = (data ?? "").split("\n");
  const jsonObj: any = {};

  lines.forEach((line) => {
    const [keyWithHyphen, value] = line.split(":").map((str) => str.trim());
    const key = keyWithHyphen.replace("-", "").trim();
    jsonObj[key] = isNaN(Number(value)) ? value : parseFloat(value);
  });

  return jsonObj;
}
