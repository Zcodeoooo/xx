/**
 * 去除字符串首尾
 * @param str
 * @returns {string}
 */
function removeFirstLastChar(str) {
    return str.substring(1, str.length - 1);
}

/**
 * 字符串中查找ipv6地址生成集合
 * @param text
 * @returns {*}
 */

function extractIPv6(text) {
    const pattern = /\[([^\[\]]+)\]/g;
    return text.match(pattern);
}

module.exports = { removeFirstLastChar,extractIPv6 };
