const { transform, isEqual, isObject } = require("lodash");
const getRandomValues = require("get-random-values");

const getRandom = () => {
  const randomBuffer = new Uint8Array(1);
  getRandomValues(randomBuffer);
  const random = randomBuffer[0] / (Math.pow(2, 8) - 1);
  return random;
};

module.exports = {
  fixLineBreaks: (input = "") => {
    return input.replace(/(?:\r\n|\r|\n)/g, "<br/>");
  },
  getUserInitials: (name) => {
    if (name){
      const nameParts = name.split(" ");
      return `${nameParts[0][0]}${nameParts[1][0]}`;
    }
  },
  generateRandomId: (size = 4) => {
    const ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZ";
    let rtn = "";
    for (let i = 0; i < size; i += 1) {
      rtn += ALPHABET.charAt(Math.floor(getRandom() * ALPHABET.length));
    }
    return rtn;
  },
  addMinutesToDate: (date, minutes) => {
    return new Date(date.getTime() + minutes * 60000);
  },
  getFileName: (url) => {
    return url.substring(url.lastIndexOf("/") + 1);
  },
  getRandomInt: (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(getRandom() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  },
  chunkArrayInGroups: (arr, size) => {
    const arrayLength = arr.length;
    const returnArray = [];

    for (let index = 0; index < arrayLength; index += size) {
      const chunk = arr.slice(index, index + size);
      returnArray.push(chunk);
    }

    return returnArray;
  },
  compareObjects: (object, base) => {
    function changes(object, base) {
      return transform(object, function (result, value, key) {
        if (!isEqual(value, base[key])) {
          result[key] =
            isObject(value) && isObject(base[key])
              ? changes(value, base[key])
              : value;
        }
      });
    }
    return changes(object, base);
  },
  safelyParseJSON: (json) => {
    var parsed;

    try {
      parsed = JSON.parse(json);
    } catch (e) {
      console.log(e);
    }

    return parsed;
  },
  addScript: (url, cb = () => {}) => {
    const script = document.createElement("script");
    script.src = url;
    script.async = true;
    script.onload = () => {
      cb();
    };
    document.body.appendChild(script);
  },
  isNumber: (value) => {
    return typeof value === "number" && Number.isFinite(value);
  },
  isFieldEmpty: (field, alt) => {
    return field === "Undefined" ||
      field === "null" ||
      field === "undefined" ||
      field === "" ||
      typeof field === "undefined" ||
      !field
      ? alt
      : field;
  },
  stringToBase64: (input) => {
    if (!input) {
      return;
    }
    return Buffer.from(input).toString("base64");
  },
  getShowUrl: (slug) => {
    const siteUrl = process.env.SERVER_URL;
    return `${siteUrl}/shows/${slug}`;
  },
  replaceNewLineWithBreakReturn: (input = "") => {
    return input.replace(/\n/g, "<br />");
  },
  truncateString: (str, num, tail = "") => {
    if (str.length <= num) {
      return str;
    }
    return `${str.slice(0, num)}${tail}`;
  },
  parseUsernameWithUrl: (string, url) => {
    return string.replace(/[@]+[A-Za-z0-9-_]+/g, (u) => {
      return `<a target="_blank" href="${url}">${u}</a>`;
    });
  },
  capitalize: (s) => {
    if (typeof s !== "string") return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
  },
  titleCaseString: (text) => {
    return (text || "")
      .toLowerCase()
      .split(" ")
      .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
      .join(" ");
  },
  numberWithCommas: (x) => {
    if (!x) return 0;
    // TODO look into using Intl.NumberFormat
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  },
  getEncodedForm: (formData) => {
    return Object.keys(formData)
      .map((key) => {
        return `${encodeURIComponent(key)}=${encodeURIComponent(
          formData[key]
        )}`;
      })
      .join("&");
  },
  formatCurrency(price) {
    return parseFloat(price).toFixed(2);
  },
  stripSlash(text) {
    if (!text) {
      return text;
    }
    return text.replace(/\/$/, "");
  },
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  },
  emailIsValid(email) {
    return /^.+@[^.].*.[a-z]{2,}$/.test(email);
    // return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); // needed updated reg ex for new TLD
  },
  isEmpty(value) {
    return !!value || value === "" || value === " ";
  },
  convertHex(hex, opacity) {
    const newHex = hex.replace("#", "");
    const r = parseInt(newHex.substring(0, 2), 16);
    const g = parseInt(newHex.substring(2, 4), 16);
    const b = parseInt(newHex.substring(4, 6), 16);

    const result = `rgba(${r},${g},${b},${opacity / 100})`;
    return result;
  },
  smarten(a) {
    let newA = a;
    newA = newA.replace(/(^|[-\u2014\s(["])'/g, "$1\u2018"); // opening singles
    newA = newA.replace(/'/g, "\u2019"); // closing singles & apostrophes
    newA = newA.replace(/(^|[-\u2014/[(\u2018\s])"/g, "$1\u201c"); // opening doubles
    newA = newA.replace(/"/g, "\u201d"); // closing doubles
    newA = newA.replace(/--/g, "\u2014"); // em-dashes
    return newA;
  },
  smartenObject(obj) {
    if (obj !== null && typeof obj === "object" && typeof obj !== "undefined") {
      return obj.map((span) => {
        if (!span.text) {
          return span;
        }
        let newText = span.text;
        newText = newText.replace(/(^|[-\u2014\s(["])'/g, "$1\u2018"); // opening singles
        newText = newText.replace(/'/g, "\u2019"); // closing singles & apostrophes
        newText = newText.replace(/(^|[-\u2014/[(\u2018\s])"/g, "$1\u201c"); // opening doubles
        newText = newText.replace(/"/g, "\u201d"); // closing doubles
        newText = newText.replace(/--/g, "\u2014"); // em-dashes
        return { ...span, text: newText };
      });
    }
    return obj;
  },
  ordinalSuffix(i) {
    var j = i % 10,
      k = i % 100;
    if (j == 1 && k != 11) {
      return i + "st";
    }
    if (j == 2 && k != 12) {
      return i + "nd";
    }
    if (j == 3 && k != 13) {
      return i + "rd";
    }
    return i + "th";
  },
};
