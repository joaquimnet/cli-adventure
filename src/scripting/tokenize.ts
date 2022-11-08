import { Token } from './interfaces';
import { Operator } from './operators/operator';

export function tokenize(input: string): Token[] {
  const parts = input.split(' ');
  const left = parts[0];
  const operator = parts[1];
  let right: Token['content'] = input.split(`${left} ${operator} `)[1];
  // check if it's number
  if (
    right &&
    !Number.isNaN(Number(right)) &&
    !Operator.isEdgeCaseFakeNumber(right)
  ) {
    right = Number(right);
  }

  return [
    { type: 'identifier', content: left },
    { type: 'operator', content: operator },
    { type: 'value', content: right ?? '' },
  ];
}
