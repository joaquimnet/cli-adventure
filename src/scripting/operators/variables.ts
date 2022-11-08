const variableRegex = /(\$\w+)/g;

export function replaceVariables(
  input: string,
  variables: { [key: string]: any },
): string {
  return input.replace(variableRegex, (match) => {
    const variable = variables[match];
    return variable !== undefined ? variable : match;
  });
}
