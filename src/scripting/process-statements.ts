import { Context, Statement } from './interfaces';
import { isUnsafeJavascriptObjectKeyName } from './isUnsafeJavascriptObjectKeyName';
import { tokenize } from './tokenize';
import { Operator } from './operators/operator';

// operators
import { AdditionOperator } from './operators/addition.operator';
import { DivisionOperator } from './operators/division.operator';
import { MultiplicationOperator } from './operators/multiplication.operator';
import { SubtractionOperator } from './operators/subtraction.operator';
import { AssignmentOperator } from './operators/assignment.operator';
import { LessThanOperator } from './operators/less-than.operator';
import { LessThanOrEqualOperator } from './operators/less-than-or-equal.operator';
import { GreaterThanOperator } from './operators/greater-than.operator';
import { GreaterThanOrEqualOperator } from './operators/greater-than-or-equal.operator';
import { RelationalEqualsOperator } from './operators/relational-equals.operator';
import { RelationalNotEqualsOperator } from './operators/relational-not-equals.operator';
import { AndOperator } from './operators/and.operator';
import { OrOperator } from './operators/or.operator';

const operators = [
  AdditionOperator,
  DivisionOperator,
  MultiplicationOperator,
  SubtractionOperator,
  AssignmentOperator,
  LessThanOperator,
  GreaterThanOperator,
  LessThanOrEqualOperator,
  GreaterThanOrEqualOperator,
  RelationalEqualsOperator,
  RelationalNotEqualsOperator,
  AndOperator,
  OrOperator,
];

const operatorHashmap = operators.reduce((acc, operator) => {
  acc[operator.op] = operator;
  return acc;
}, {} as { [key: string]: typeof Operator });

export function processStatements(ctx: Context, statements: string[]): void {
  const operations: Statement[] = statements
    .filter(Boolean)
    .map((statement) => {
      const tokens = tokenize(statement);
      let left = tokens[0].content as string;
      if (isUnsafeJavascriptObjectKeyName(left)) {
        left = `_${left}`;
      }
      const operator = tokens[1].content as string;
      const right = tokens[2].content as string | number;
      return { left, right, operator };
    });

  for (const operation of operations) {
    const op = operatorHashmap[operation.operator];
    if (op) {
      op.execute(ctx, {
        left: operation.left,
        right: operation.right,
        operator: operation.operator,
      });
    }
  }
}

export function processExpression(ctx: Context, expression: string): any {
  const tokens = tokenize(expression);
  const left = tokens[0].content as string;
  const operator = tokens[1].content as string;
  const right = tokens[2].content as string | number;
  const op = operatorHashmap[operator];
  if (op) {
    return op.execute(ctx, {
      left,
      right,
      operator,
    });
  }
}

export function isExpression(right: string): boolean {
  return right.trim().startsWith('{') && right.trim().endsWith('}');
}
