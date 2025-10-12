"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeName = normalizeName;
exports.toCamelCase = toCamelCase;
exports.toPascalCase = toPascalCase;
exports.toKebabCase = toKebabCase;
exports.capitalize = capitalize;
exports.pluralizeName = pluralizeName;
const pluralize_1 = __importDefault(require("pluralize"));
function normalizeName(name) {
    return name
        .replace(/[_-]/g, " ")
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .toLowerCase()
        .split(" ")
        .filter(Boolean);
}
function toCamelCase(name) {
    const parts = normalizeName(name);
    return parts[0] + parts.slice(1).map(capitalize).join("");
}
function toPascalCase(name) {
    return normalizeName(name).map(capitalize).join("");
}
function toKebabCase(name) {
    return normalizeName(name).join("-");
}
function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}
function pluralizeName(word, override) {
    return override || (0, pluralize_1.default)(word);
}
