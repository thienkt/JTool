const fs = require("fs");

const toBracketNotation = (key) =>
  key
    .split(".")
    .map((k) => `["${k}"]`)
    .join("");

const flattenObj = (obj, parentKey = "") => {
  let result = {};
  Object.keys(obj).forEach((key) => {
    if(!/\w+/.test(key)) debugger;
    if (obj[key] != null && typeof obj[key] === "object") {
      result = {
        ...result,
        ...flattenObj(obj[key], `${parentKey}${parentKey && "."}${key}`),
      };
    } else {
      result[`${parentKey}${parentKey && "."}${key}`] = obj[key];
    }
  });

  return result;
};

function getValueByKey(key) {
  try {
    return new Function("src", `return src${toBracketNotation(key)}`)(this);
  } catch (e) {
    return undefined;
  }
}

function setValueByKey(key, value) {
  let val = null;
  try {
    val = JSON.parse(value);
  } catch {
    val = value;
  }
  try {
    const props = key.split(".");
    if (props.length > 1) {
      let temp = props[0];
      for (let i = 1; i < props.length; i++) {
        new Function("src", "val", `src${toBracketNotation(temp)} ??= val`)(
          this,
          {}
        );
        temp = `${temp}.${props[i]}`;
      }
    }
    new Function("src", "val", `src${toBracketNotation(key)} = val`)(this, val);
  } catch (error) {
    console.log(key, { error });
  }
}

const getLocalesData = (path, files, options = { flatten: false }) => {
  const getLang = (locale) => {
    const data = fs.readFileSync(`${path}/${locale}.json`, {
      encoding: "utf8",
    });
    const lang = JSON.parse(data);
    lang.get = getValueByKey;
    lang.set = setValueByKey;

    return lang;
  };

  const data = {};

  files.forEach((file) => {
    data[file] = !options.flatten ? getLang(file) : flattenObj(getLang(file));
  });

  return data;
};

module.exports = { getLocalesData, flattenObj };
