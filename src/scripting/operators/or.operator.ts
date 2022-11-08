import { Context, Statement } from '../interfaces';
import { Operator } from './operator';

export class OrOperator extends Operator {
  static readonly op = '||';

  static execute(ctx: Context, statement: Statement): boolean {
    this.replaceVariablesOnRightSide(ctx, statement);
    const isLeftSideVariable = !!statement.left.match(/\$\{[a-zA-Z0-9_]+\}/g);
    this.replaceVariableOnLeftSide(ctx, statement);
    const { left, right } = statement;
    const { variables } = ctx;

    if (isLeftSideVariable) {
      return variables[left] || right ? true : false;
    } else {
      return left || right ? true : false;
    }
  }
}
