import { Context, Statement } from '../interfaces';
import { Operator } from './operator';

export class AssignmentOperator extends Operator {
  static readonly op = '=';

  static execute(ctx: Context, statement: Statement): void {
    this.replaceVariablesOnRightSide(ctx, statement);
    const { left, right } = statement;

    if (typeof right === 'number' && !Number.isFinite(right as number)) {
      return;
    }

    ctx.variables[left] = right;
  }
}
