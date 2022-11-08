import { Context, Statement } from '../interfaces';
import { Operator } from './operator';

export class RelationalEqualsOperator extends Operator {
  static readonly op = '==';

  static execute(ctx: Context, statement: Statement): boolean {
    this.replaceVariablesOnRightSide(ctx, statement);
    const isLeftSideVariable = !!statement.left.match(/\$\{[a-zA-Z0-9_]+\}/g);
    this.replaceVariableOnLeftSide(ctx, statement);
    const { left, right } = statement;
    const { variables } = ctx;

    if (isLeftSideVariable) {
      if (typeof variables[left] === 'undefined') {
        return false;
      }

      if (typeof right === 'number' && !Number.isFinite(right as number)) {
        return false;
      }

      return variables[left] === right;
    } else {
      return left === right;
    }
  }
}
