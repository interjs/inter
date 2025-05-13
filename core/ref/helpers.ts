export function hasProp(object: Object): boolean {
  return Object.keys(object).length > 0;
}

export function hasRefs(text: string): boolean {
  return /{\s*.*\s*}/.test(text);
}

export function getRefs(text: string): Array<string> {
  const ref: RegExp = /{\s*(:?[\w-\s]+)\s*}/g;

  const refs: Set<string> = new Set();

  text.replace(ref, (plainRef) => {
    const refName = plainRef.replace("{", "").replace("}", "").trim();

    refs.add(refName);
    return String();
  });

  return Array.from(refs);
}

export function hasRefNamed(text: string, refName: string): boolean {
  const pattern = new RegExp(`{\\s*${refName}\\s*}`);

  return pattern.test(text);
}
