import pluralize from "pluralize";

export function normalizeName(name: string): string[] {
  return name
    .replace(/[_-]/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .toLowerCase()
    .split(" ")
    .filter(Boolean);
}

export function toCamelCase(name: string): string {
  const parts = normalizeName(name);
  return parts[0] + parts.slice(1).map(capitalize).join("");
}

export function toPascalCase(name: string): string {
  return normalizeName(name).map(capitalize).join("");
}

export function toKebabCase(name: string): string {
  return normalizeName(name).join("-");
}

export function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function pluralizeName(word: string, override?: string): string {
  return override || pluralize(word);
}
