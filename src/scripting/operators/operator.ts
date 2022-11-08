import { Context, Statement } from '../interfaces';

export abstract class Operator {
  static readonly op: string;

  public static execute(ctx: Context, statement: Statement): void | boolean {
    throw new Error('Not implemented');
  }

  public static replaceVariablesOnRightSide(
    ctx: Context,
    statement: Statement,
  ): void {
    if (typeof statement.right === 'string') {
      const { variables } = ctx;

      if (statement.right.match(/\$\{[a-zA-Z0-9_]+\}/g)) {
        statement.right = statement.right.replace(
          /\$\{[a-zA-Z0-9_]+\}/g,
          (variable) => {
            const variableName = variable.replace(/\$\{|\}/g, '');
            // TODO: move this special case somewhere else
            if (variableName === 'random') {
              return Math.random().toString();
            }
            if (typeof variables[variableName] !== 'undefined') {
              return variables[variableName] as string;
            }
            return variable;
          },
        );
        if (
          !Number.isNaN(Number(statement.right as unknown as number)) &&
          !this.isEdgeCaseFakeNumber(statement.right as string)
        ) {
          statement.right = Number(statement.right);
        }
      }
    }
  }

  public static replaceVariableOnLeftSide(
    ctx: Context,
    statement: Statement,
  ): void {
    // const { variables } = ctx;

    if (statement.left.match(/\$\{[a-zA-Z0-9_]+\}/g)) {
      statement.left = statement.left.replace(
        /\$\{[a-zA-Z0-9_]+\}/g,
        (variable) => {
          const variableName = variable.replace(/\$\{|\}/g, '');
          return variableName;
        },
      );
    }
  }

  public static isEdgeCaseFakeNumber(value: string): boolean {
    return (
      (String(value).endsWith('.') && !Number.isNaN(Number(value))) ||
      value === '' ||
      value === ' '
    );
  }
}
