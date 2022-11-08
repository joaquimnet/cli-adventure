import { processExpression, processStatements } from './process-statements';
import { tokenize } from './tokenize';

describe('scripting', () => {
  describe('process-statements', () => {
    describe('tokenize', () => {
      it('should tokenize assignment statements correctly', () => {
        const tokens = tokenize('a = 1');
        expect(tokens).toEqual([
          { type: 'identifier', content: 'a' },
          { type: 'operator', content: '=' },
          { type: 'value', content: 1 },
        ]);
      });

      it('should tokenize addition statements correctly', () => {
        const tokens = tokenize('a += 1');
        expect(tokens).toEqual([
          { type: 'identifier', content: 'a' },
          { type: 'operator', content: '+=' },
          { type: 'value', content: 1 },
        ]);
      });

      it('should tokenize subtraction statements correctly', () => {
        const tokens = tokenize('a -= 1');
        expect(tokens).toEqual([
          { type: 'identifier', content: 'a' },
          { type: 'operator', content: '-=' },
          { type: 'value', content: 1 },
        ]);
      });

      it('should tokenize multiplication statements correctly', () => {
        const tokens = tokenize('a *= 1');
        expect(tokens).toEqual([
          { type: 'identifier', content: 'a' },
          { type: 'operator', content: '*=' },
          { type: 'value', content: 1 },
        ]);
      });

      it('should tokenize division statements correctly', () => {
        const tokens = tokenize('a /= 1');
        expect(tokens).toEqual([
          { type: 'identifier', content: 'a' },
          { type: 'operator', content: '/=' },
          { type: 'value', content: 1 },
        ]);
      });
    });

    describe('processStatements', () => {
      it('should process an assignment operator correctly', () => {
        const ctx = {
          variables: {},
          cursor: 0,
          content: [],
        };

        processStatements(ctx, ['a = 1']);

        expect(ctx.variables).toEqual({ a: 1 });

        processStatements(ctx, ['a = 2']);

        expect(ctx.variables).toEqual({ a: 2 });

        processStatements(ctx, ['a = Hello!']);

        expect(ctx.variables).toEqual({ a: 'Hello!' });

        processStatements(ctx, ['a = Hello World!']);

        expect(ctx.variables).toEqual({ a: 'Hello World!' });
      });

      it('should process an addition operator correctly', () => {
        const ctx = {
          variables: {},
          cursor: 0,
          content: [],
        };

        processStatements(ctx, ['a = 0']);

        expect(ctx.variables).toEqual({ a: 0 });

        processStatements(ctx, ['a += 2']);

        expect(ctx.variables).toEqual({ a: 2 });

        processStatements(ctx, ['a += 3']);

        expect(ctx.variables).toEqual({ a: 5 });
      });

      it('should process a subtraction operator correctly', () => {
        const ctx = {
          variables: {},
          cursor: 0,
          content: [],
        };

        processStatements(ctx, ['a = 10']);

        expect(ctx.variables).toEqual({ a: 10 });

        processStatements(ctx, ['a -= 2']);

        expect(ctx.variables).toEqual({ a: 8 });

        processStatements(ctx, ['a -= 3']);

        expect(ctx.variables).toEqual({ a: 5 });
      });

      it('should process a multiplication operator correctly', () => {
        const ctx = {
          variables: {},
          cursor: 0,
          content: [],
        };

        processStatements(ctx, ['a = 10']);

        expect(ctx.variables).toEqual({ a: 10 });

        processStatements(ctx, ['a *= 2']);

        expect(ctx.variables).toEqual({ a: 20 });

        processStatements(ctx, ['a *= 3']);

        expect(ctx.variables).toEqual({ a: 60 });
      });

      it('should process a division operator correctly', () => {
        const ctx = {
          variables: {},
          cursor: 0,
          content: [],
        };

        processStatements(ctx, ['a = 10']);

        expect(ctx.variables).toEqual({ a: 10 });

        processStatements(ctx, ['a /= 2']);

        expect(ctx.variables).toEqual({ a: 5 });

        processStatements(ctx, ['a /= 2']);

        expect(ctx.variables).toEqual({ a: 2.5 });
      });

      it('should process multiple statements correctly', () => {
        const ctx = {
          variables: {},
          cursor: 0,
          content: [],
        };

        processStatements(ctx, ['a = 10', 'b = 20', 'c = 30']);

        expect(ctx.variables).toEqual({ a: 10, b: 20, c: 30 });
      });

      it('should concatenate strings with strings', () => {
        const ctx = {
          variables: {},
          cursor: 0,
          content: [],
        };

        processStatements(ctx, ['a = Hello', 'a += World']);

        expect(ctx.variables).toEqual({ a: 'HelloWorld' });

        processStatements(ctx, ['a = Hello', 'a +=  World']);

        expect(ctx.variables).toEqual({ a: 'Hello World' });
      });

      it('should concatenate a trailing space', () => {
        const ctx = {
          variables: {},
          cursor: 0,
          content: [],
        };

        processStatements(ctx, ['a = Hello', 'a +=  World ', 'a += !']);

        expect(ctx.variables).toEqual({ a: 'Hello World !' });

        ctx.variables = {};

        processStatements(ctx, ['a = Hello', 'a +=  World', 'a +=  ']);

        expect(ctx.variables).toEqual({ a: 'Hello World ' });
      });

      it('should multiply strings', () => {
        const ctx = {
          variables: {},
          cursor: 0,
          content: [],
        };

        processStatements(ctx, ['a = Hello', 'a *= 3']);

        expect(ctx.variables).toEqual({ a: 'HelloHelloHello' });

        processStatements(ctx, ['a = Hello', 'a *= 4.5']);

        expect(ctx.variables).toEqual({ a: 'HelloHelloHelloHello' });

        processStatements(ctx, ['a = 2', 'a *= Hello']);

        expect(ctx.variables).toEqual({ a: 'HelloHello' });
      });

      it('should return 0 for invalid arithmetical operations', () => {
        const ctx = {
          variables: {},
          cursor: 0,
          content: [],
        };

        processStatements(ctx, ['a = Hello', 'a -= 3']);

        expect(ctx.variables).toEqual({ a: 0 });

        processStatements(ctx, ['a = 3', 'a -= Hello']);

        expect(ctx.variables).toEqual({ a: 0 });

        processStatements(ctx, ['a = Hello', 'a /= 3']);

        expect(ctx.variables).toEqual({ a: 0 });

        processStatements(ctx, ['a = 3', 'a /= Hello']);

        expect(ctx.variables).toEqual({ a: 0 });

        processStatements(ctx, ['a = 10', 'a /= 0']);

        expect(ctx.variables).toEqual({ a: 0 });
      });

      it('should be a noop on operation on non-existent variable', () => {
        const ctx = {
          variables: {},
          cursor: 0,
          content: [],
        };

        processStatements(ctx, ['a += 1']);

        expect(ctx.variables).toEqual({});

        processStatements(ctx, ['a -= 1']);

        expect(ctx.variables).toEqual({});

        processStatements(ctx, ['a *= 1']);

        expect(ctx.variables).toEqual({});

        processStatements(ctx, ['a /= 1']);

        expect(ctx.variables).toEqual({});
      });

      it('should be a noop whenever Infinity is used', () => {
        const ctx = {
          variables: {},
          cursor: 0,
          content: [],
        };

        processStatements(ctx, ['a = Infinity', 'a /= 10']);

        expect(ctx.variables).toEqual({});

        processStatements(ctx, ['a = 10', 'a /= Infinity']);

        expect(ctx.variables).toEqual({ a: 10 });

        processStatements(ctx, ['a = 10', 'a *= Infinity']);

        expect(ctx.variables).toEqual({ a: 10 });

        processStatements(ctx, ['a = 10', 'a -= Infinity']);

        expect(ctx.variables).toEqual({ a: 10 });

        processStatements(ctx, ['a = 10', 'a += Infinity']);

        expect(ctx.variables).toEqual({ a: 10 });
      });

      it('should underscore variables named after protected javascript object keys', () => {
        const ctx = {
          variables: {},
          cursor: 0,
          content: [],
        };

        processStatements(ctx, ['__proto__ = 1']);
        expect((ctx.variables as any).___proto__).toEqual(1);

        processStatements(ctx, ['constructor = 1']);
        expect((ctx.variables as any)._constructor).toEqual(1);

        processStatements(ctx, ['prototype = 1']);
        expect((ctx.variables as any)._prototype).toEqual(1);

        processStatements(ctx, ['__defineGetter__ = 1']);
        expect((ctx.variables as any).___defineGetter__).toEqual(1);

        processStatements(ctx, ['__defineSetter__ = 1']);
        expect((ctx.variables as any).___defineSetter__).toEqual(1);

        processStatements(ctx, ['__lookupGetter__ = 1']);
        expect((ctx.variables as any).___lookupGetter__).toEqual(1);

        processStatements(ctx, ['__lookupSetter__ = 1']);
        expect((ctx.variables as any).___lookupSetter__).toEqual(1);

        processStatements(ctx, ['hasOwnProperty = 1']);
        expect((ctx.variables as any)._hasOwnProperty).toEqual(1);

        processStatements(ctx, ['isPrototypeOf = 1']);
        expect((ctx.variables as any)._isPrototypeOf).toEqual(1);

        processStatements(ctx, ['propertyIsEnumerable = 1']);
        expect((ctx.variables as any)._propertyIsEnumerable).toEqual(1);

        processStatements(ctx, ['toLocaleString = 1']);
        expect((ctx.variables as any)._toLocaleString).toEqual(1);

        processStatements(ctx, ['toString = 1']);
        expect((ctx.variables as any)._toString).toEqual(1);

        processStatements(ctx, ['valueOf = 1']);
        expect((ctx.variables as any)._valueOf).toEqual(1);
      });

      it('should not crash if an empty value is used', () => {
        const ctx = {
          variables: {},
          cursor: 0,
          content: [],
        };

        processStatements(ctx, ['a =']);

        expect(ctx.variables).toEqual({ a: '' });

        processStatements(ctx, ['a += Hello']);

        expect(ctx.variables).toEqual({ a: 'Hello' });
      });

      it('should not crash with an unknown operator', () => {
        const ctx = {
          variables: {},
          cursor: 0,
          content: [],
        };

        processStatements(ctx, ['a = 10', 'a ??= 20']);

        expect(ctx.variables).toEqual({ a: 10 });
      });

      it('should succeed in computing a very long sequence of statements', () => {
        const ctx = {
          variables: {},
          cursor: 0,
          content: [],
        };

        const statements = ['a = 0'];
        for (let i = 0; i < 1000; i++) {
          statements.push(`a = ${i}`);
        }

        processStatements(ctx, statements);

        expect(ctx.variables).toEqual({ a: 999 });

        const statements2 = ['a = 0'];
        for (let i = 0; i < 1000; i++) {
          statements2.push(`a += ${i}`);
        }

        processStatements(ctx, statements2);

        expect(ctx.variables).toEqual({ a: 499500 });

        const statements3 = ['a = 0'];
        for (let i = 0; i < 1000; i++) {
          statements3.push(`a -= ${i}`);
        }

        processStatements(ctx, statements3);

        expect(ctx.variables).toEqual({ a: -499500 });

        const statements4 = ['a = 1'];
        for (let i = 0; i < 1000; i++) {
          statements4.push(`a *= ${i}`);
        }

        processStatements(ctx, statements4);

        expect(ctx.variables).toEqual({ a: 0 });

        const statements5 = ['a = 10'];
        for (let i = 0; i < 1000; i++) {
          statements5.push(`a /= ${i}`);
        }

        processStatements(ctx, statements5);

        expect(ctx.variables).toEqual({ a: 0 });

        const statements6 = [];
        for (let i = 0; i < 1000; i++) {
          statements6.push('a = World' + i);
        }

        processStatements(ctx, statements6);

        expect(ctx.variables).toEqual({ a: 'World999' });
      });

      it('should be a noop on invalid statements', () => {
        const ctx = {
          variables: {},
          cursor: 0,
          content: [],
        };

        processStatements(ctx, [
          'a = 10',
          'a',
          'test',
          '23',
          '',
          undefined as unknown as string,
        ]);

        expect(ctx.variables).toEqual({ a: 10 });
      });
    });

    describe('variables', () => {
      it('should copy a value using a variable replacement', () => {
        const ctx = {
          variables: { a: 10 },
          cursor: 0,
          content: [],
        };

        processStatements(ctx, ['b = ${a}']);

        expect(ctx.variables).toEqual({ a: 10, b: 10 });
      });
    });

    it('should copy a value and both values must be independent from another', () => {
      const ctx = {
        variables: {},
        cursor: 0,
        content: [],
      };

      processStatements(ctx, ['a = 10', 'b = ${a}']);

      expect(ctx.variables).toEqual({ a: 10, b: 10 });

      processStatements(ctx, ['a = 20']);

      expect(ctx.variables).toEqual({ a: 20, b: 10 });
    });

    it('should be able to perform arithmetic using a variable as a value', () => {
      const ctx = {
        variables: {},
        cursor: 0,
        content: [],
      };

      processStatements(ctx, ['a = 10', 'b = 10', 'b += ${a}']);

      expect(ctx.variables).toEqual({ a: 10, b: 20 });
    });

    it('should replace variables in strings', () => {
      const ctx = {
        variables: {},
        cursor: 0,
        content: [],
      };

      processStatements(ctx, ['a = 10', 'b = Hello ${a}', 'b += !']);

      expect(ctx.variables).toEqual({ a: 10, b: 'Hello 10!' });

      processStatements(ctx, ['a = 20']);

      expect(ctx.variables).toEqual({ a: 20, b: 'Hello 10!' });

      ctx.variables = {};

      processStatements(ctx, [
        'a = 10',
        'b = Hello ${a}',
        'b += !',
        'a = 20',
        'b += ${a}',
      ]);

      expect(ctx.variables).toEqual({ a: 20, b: 'Hello 10!20' });
    });

    it('should replace variables in strings without losing spaces', () => {
      const ctx = {
        variables: {},
        cursor: 0,
        content: [],
      };

      processStatements(ctx, [
        'a = 10',
        'b = Hello ${a}',
        'b += !',
        'a = 20',
        'b += ${a}',
        'b +=  ',
      ]);

      expect(ctx.variables).toEqual({ a: 20, b: 'Hello 10!20 ' });

      ctx.variables = {};

      processStatements(ctx, [
        'a = 10',
        'b = Hello ${a}',
        'b += !',
        'a = 20',
        'b +=  ${a}.',
      ]);

      expect(ctx.variables).toEqual({ a: 20, b: 'Hello 10! 20.' });
    });

    describe('logical operators', () => {
      describe('&&', () => {
        it('should return true if both values are true', () => {
          const ctx = {
            variables: { a: 1 },
            cursor: 0,
            content: [],
          };

          const result = processExpression(ctx, '${a} && 1');

          expect(result).toEqual(true);
        });

        it('should return false if one value is false', () => {
          const ctx = {
            variables: { a: 1 },
            cursor: 0,
            content: [],
          };

          const result = processExpression(ctx, '${a} && 0');

          expect(result).toEqual(false);
        });

        it('should return false if both values are false', () => {
          const ctx = {
            variables: { a: 0 },
            cursor: 0,
            content: [],
          };

          const result = processExpression(ctx, '${a} && 0');

          expect(result).toEqual(false);
        });

        it('should work with variables on the right side', () => {
          const ctx = {
            variables: { a: 1, b: 1 },
            cursor: 0,
            content: [],
          };

          const result = processExpression(ctx, '${a} && ${b}');

          expect(result).toEqual(true);
        });
      });
      describe('||', () => {
        it('should return true if both values are true', () => {
          const ctx = {
            variables: { a: 1 },
            cursor: 0,
            content: [],
          };

          const result = processExpression(ctx, '${a} || 1');

          expect(result).toEqual(true);
        });

        it('should return true if one value is true', () => {
          const ctx = {
            variables: { a: 1 },
            cursor: 0,
            content: [],
          };

          const result = processExpression(ctx, '${a} || 0');

          expect(result).toEqual(true);
        });

        it('should return false if both values are false', () => {
          const ctx = {
            variables: { a: 0 },
            cursor: 0,
            content: [],
          };

          const result = processExpression(ctx, '${a} || 0');

          expect(result).toEqual(false);
        });

        it('should work with variables on the right side', () => {
          const ctx = {
            variables: { a: 1, b: 1 },
            cursor: 0,
            content: [],
          };

          const result = processExpression(ctx, '${a} || ${b}');

          expect(result).toEqual(true);
        });
      });
      describe('==', () => {
        it('should return true if both values are equal', () => {
          const ctx = {
            variables: { a: 1 },
            cursor: 0,
            content: [],
          };

          const result = processExpression(ctx, '${a} == 1');

          expect(result).toEqual(true);
        });

        it('should return false if one values are not equal', () => {
          const ctx = {
            variables: { a: 1 },
            cursor: 0,
            content: [],
          };

          const result = processExpression(ctx, '${a} == 0');

          expect(result).toEqual(false);
        });

        it('should work with variables on the right side', () => {
          const ctx = {
            variables: { a: 1, b: 1 },
            cursor: 0,
            content: [],
          };

          const result = processExpression(ctx, '${a} == ${b}');

          expect(result).toEqual(true);
        });

        it('should work with variables on the right side', () => {
          const ctx = {
            variables: { a: 1, b: 0 },
            cursor: 0,
            content: [],
          };

          const result = processExpression(ctx, '${a} == ${b}');

          expect(result).toEqual(false);
        });
      });
      describe('!=', () => {
        it('should return false if both values are equal', () => {
          const ctx = {
            variables: { a: 1 },
            cursor: 0,
            content: [],
          };

          const result = processExpression(ctx, '${a} != 1');

          expect(result).toEqual(false);
        });

        it('should return true if one values are not equal', () => {
          const ctx = {
            variables: { a: 1 },
            cursor: 0,
            content: [],
          };

          const result = processExpression(ctx, '${a} != 0');

          expect(result).toEqual(true);
        });

        it('should work with variables on the right side', () => {
          const ctx = {
            variables: { a: 1, b: 1 },
            cursor: 0,
            content: [],
          };

          const result = processExpression(ctx, '${a} != ${b}');

          expect(result).toEqual(false);
        });

        it('should work with variables on the right side', () => {
          const ctx = {
            variables: { a: 1, b: 0 },
            cursor: 0,
            content: [],
          };

          const result = processExpression(ctx, '${a} != ${b}');

          expect(result).toEqual(true);
        });
      });
      describe('>', () => {
        it('should return true if left value is greater than right value', () => {
          const ctx = {
            variables: { a: 2 },
            cursor: 0,
            content: [],
          };

          const result = processExpression(ctx, '${a} > 1');

          expect(result).toEqual(true);
        });

        it('should return false if left value is not greater than right value', () => {
          const ctx = {
            variables: { a: 1 },
            cursor: 0,
            content: [],
          };

          const result = processExpression(ctx, '${a} > 1');

          expect(result).toEqual(false);
        });

        it('should work with variables on the right side', () => {
          const ctx = {
            variables: { a: 2, b: 1 },
            cursor: 0,
            content: [],
          };

          const result = processExpression(ctx, '${a} > ${b}');

          expect(result).toEqual(true);
        });

        it('should work with variables on the right side', () => {
          const ctx = {
            variables: { a: 1, b: 2 },
            cursor: 0,
            content: [],
          };

          const result = processExpression(ctx, '${a} > ${b}');

          expect(result).toEqual(false);
        });
      });
      describe('>=', () => {
        it('should return true if left value is greater than right value', () => {
          const ctx = {
            variables: { a: 2 },
            cursor: 0,
            content: [],
          };

          const result = processExpression(ctx, '${a} >= 1');

          expect(result).toEqual(true);
        });

        it('should return false if left value is not greater than right value', () => {
          const ctx = {
            variables: { a: 1 },
            cursor: 0,
            content: [],
          };

          const result = processExpression(ctx, '${a} >= 1');

          expect(result).toEqual(true);
        });

        it('should work with variables on the right side', () => {
          const ctx = {
            variables: { a: 2, b: 1 },
            cursor: 0,
            content: [],
          };

          const result = processExpression(ctx, '${a} >= ${b}');

          expect(result).toEqual(true);
        });

        it('should work with variables on the right side', () => {
          const ctx = {
            variables: { a: 1, b: 2 },
            cursor: 0,
            content: [],
          };

          const result = processExpression(ctx, '${a} >= ${b}');

          expect(result).toEqual(false);
        });
      });
      describe('<', () => {
        it('should return true if left side is less than right side', () => {
          const ctx = {
            variables: { a: 1 },
            cursor: 0,
            content: [],
          };

          const result = processExpression(ctx, '${a} < 2');

          expect(result).toEqual(true);
        });

        it('should return false if left side is not less than right side', () => {
          const ctx = {
            variables: { a: 2 },
            cursor: 0,
            content: [],
          };

          const result = processExpression(ctx, '${a} < 2');

          expect(result).toEqual(false);
        });

        it('should work with variables on the right side', () => {
          const ctx = {
            variables: { a: 1, b: 2 },
            cursor: 0,
            content: [],
          };

          const result = processExpression(ctx, '${a} < ${b}');

          expect(result).toEqual(true);
        });

        it('should work with variables on the right side', () => {
          const ctx = {
            variables: { a: 2, b: 1 },
            cursor: 0,
            content: [],
          };

          const result = processExpression(ctx, '${a} < ${b}');

          expect(result).toEqual(false);
        });
      });
      describe('<=', () => {
        it('should return true if left side is less than right side', () => {
          const ctx = {
            variables: { a: 1 },
            cursor: 0,
            content: [],
          };

          const result = processExpression(ctx, '${a} <= 2');

          expect(result).toEqual(true);
        });

        it('should return false if left side is not less than right side', () => {
          const ctx = {
            variables: { a: 2 },
            cursor: 0,
            content: [],
          };

          const result = processExpression(ctx, '${a} <= 2');

          expect(result).toEqual(true);
        });

        it('should work with variables on the right side', () => {
          const ctx = {
            variables: { a: 1, b: 2 },
            cursor: 0,
            content: [],
          };

          const result = processExpression(ctx, '${a} <= ${b}');

          expect(result).toEqual(true);
        });

        it('should work with variables on the right side', () => {
          const ctx = {
            variables: { a: 2, b: 1 },
            cursor: 0,
            content: [],
          };

          const result = processExpression(ctx, '${a} <= ${b}');

          expect(result).toEqual(false);
        });
      });
      describe('all', () => {
        it('&& - should work with raw values on both sides', () => {
          const ctx = {
            variables: {},
            cursor: 0,
            content: [],
          };

          const result = processExpression(ctx, '1 && 2');

          expect(result).toEqual(true);
        });
        it('|| - should work with raw values on both sides', () => {
          const ctx = {
            variables: {},
            cursor: 0,
            content: [],
          };

          const result = processExpression(ctx, '1 || 2');

          expect(result).toEqual(true);
        });
        it('== - should work with raw values on both sides', () => {
          const ctx = {
            variables: {},
            cursor: 0,
            content: [],
          };

          const result = processExpression(ctx, '1 == 2');

          expect(result).toEqual(false);
        });
        it('!= - should work with raw values on both sides', () => {
          const ctx = {
            variables: {},
            cursor: 0,
            content: [],
          };

          const result = processExpression(ctx, '1 != 2');

          expect(result).toEqual(true);
        });
        it('> - should work with raw values on both sides', () => {
          const ctx = {
            variables: {},
            cursor: 0,
            content: [],
          };

          const result = processExpression(ctx, '1 > 2');

          expect(result).toEqual(false);
        });
        it('>= - should work with raw values on both sides', () => {
          const ctx = {
            variables: {},
            cursor: 0,
            content: [],
          };

          const result = processExpression(ctx, '1 >= 2');

          expect(result).toEqual(false);
        });
        it('< - should work with raw values on both sides', () => {
          const ctx = {
            variables: {},
            cursor: 0,
            content: [],
          };

          const result = processExpression(ctx, '1 < 2');

          expect(result).toEqual(true);
        });
        it('<= - should work with raw values on both sides', () => {
          const ctx = {
            variables: {},
            cursor: 0,
            content: [],
          };

          const result = processExpression(ctx, '1 <= 2');

          expect(result).toEqual(true);
        });

        it('&& - should work with raw values on the right side', () => {
          const ctx = {
            variables: { b: 2 },
            cursor: 0,
            content: [],
          };

          const result = processExpression(ctx, '1 && ${b}');

          expect(result).toEqual(true);
        });
        it('|| - should work with raw values on the right side', () => {
          const ctx = {
            variables: { b: 2 },
            cursor: 0,
            content: [],
          };

          const result = processExpression(ctx, '1 || ${b}');

          expect(result).toEqual(true);
        });
        it('== - should work with raw values on the right side', () => {
          const ctx = {
            variables: { b: 2 },
            cursor: 0,
            content: [],
          };

          const result = processExpression(ctx, '1 == ${b}');

          expect(result).toEqual(false);
        });
        it('!= - should work with raw values on the right side', () => {
          const ctx = {
            variables: { b: 2 },
            cursor: 0,
            content: [],
          };

          const result = processExpression(ctx, '1 != ${b}');

          expect(result).toEqual(true);
        });
        it('> - should work with raw values on the right side', () => {
          const ctx = {
            variables: { b: 2 },
            cursor: 0,
            content: [],
          };

          const result = processExpression(ctx, '1 > ${b}');

          expect(result).toEqual(false);
        });
        it('>= - should work with raw values on the right side', () => {
          const ctx = {
            variables: { b: 2 },
            cursor: 0,
            content: [],
          };

          const result = processExpression(ctx, '1 >= ${b}');

          expect(result).toEqual(false);
        });
        it('< - should work with raw values on the right side', () => {
          const ctx = {
            variables: { b: 2 },
            cursor: 0,
            content: [],
          };

          const result = processExpression(ctx, '1 < ${b}');

          expect(result).toEqual(true);
        });
        it('<= - should work with raw values on the right side', () => {
          const ctx = {
            variables: { b: 2 },
            cursor: 0,
            content: [],
          };

          const result = processExpression(ctx, '1 <= ${b}');

          expect(result).toEqual(true);
        });
      });
    });
  });
});
