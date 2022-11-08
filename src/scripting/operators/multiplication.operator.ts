import { Context, Statement } from '../interfaces';
import { Operator } from './operator';

export class MultiplicationOperator extends Operator {
  static readonly op = '*=';

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

    if (typeof variables[left] === 'number' && typeof right === 'number') {
      variables[left] = (variables[left] as number) * (right as number);
    } else {
      // simulate python's string multiplication
      if (typeof variables[left] === 'string' && typeof right === 'number') {
        variables[left] = (variables[left] as string).repeat(right);
      } else if (
        typeof variables[left] === 'number' &&
        typeof right === 'string'
      ) {
        variables[left] = right.repeat(variables[left] as number);
      } else {
        // variables[left] = ''; // do nothing
      }
    }
  }
}
