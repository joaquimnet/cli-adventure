import { Context, Statement } from '../interfaces';
import { Operator } from './operator';

export class SubtractionOperator extends Operator {
  static readonly op = '-=';

  static execute(ctx: Context, statement: Statement): void {
    this.replaceVariablesOnRightSide(ctx, statement);
    const { left, right } = statement;
    const { variables } = ctx;

    if (typeof variables[left] === 'undefined') {
      return;
    }

    if (typeof right === 'number' && !Number.isFinite(right as number)) {
      return;
    }

    variables[left] = (variables[left] as number) - (right as number);
    if (Number.isNaN(variables[left] as number)) {
      variables[left] = 0;
    }
  }
}
