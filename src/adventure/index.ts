import { Adventure } from '../file/load-file';
import { Log } from '../log';
import { Context } from '../scripting/interfaces';
import {
  processExpression,
  processStatements,
} from '../scripting/process-statements';

interface RunnerContext {
  scriptContext: Context;
  adventure: Adventure;
  cursor: number;
}

export class AdventureRunner {
  private readonly _ctx: RunnerContext;
  private argv: Record<string, any>;

  constructor(adventure: Adventure, argv: Record<string, any>) {
    this.argv = argv;
    this._ctx = {
      scriptContext: {
        variables: {},
        cursor: 0,
        content: adventure.content,
      },
      adventure,
      cursor: 0,
    };
  }

  public run(): void {
    const { scriptContext, adventure, cursor } = this._ctx;
    const { content } = adventure;

    function waitForPlayerInput(callback: (...args: any[]) => void): void {
      process.stdin.resume();
      process.stdin.setEncoding('utf8');
      const cb = (text: string) => {
        try {
          processStatements(scriptContext, [`__response = ${text.trim()}`]);
        } catch {}
        callback();
        process.stdin.removeListener('data', cb);
      };
      process.stdin.on('data', cb);
    }

    if (this.argv.verbose) {
      console.log(`cursor: ${cursor}`);
      console.log('variables:', scriptContext.variables);
    }

    if (cursor >= content.length) {
      process.stdin.pause();
      return;
    }

    const { type, content: contentText, condition, script } = content[cursor];

    if (condition) {
      const result = processExpression(scriptContext, condition);
      if (this.argv.verbose) {
        console.log('condition:', condition, 'result:', result);
      }
      if (!result) {
        this._ctx.cursor++;
        this.run();
        return;
      }
    }

    switch (type) {
      case 'text':
        console.log(this.replaceVariables(contentText));
        if (script) {
          scriptContext.cursor = 0;
          processStatements(scriptContext, script);
        }
        waitForPlayerInput(() => {
          this._ctx.cursor++;
          this.run();
        });
        break;
      case 'choice': {
        const text = this.replaceVariables(contentText);
        process.stdout.write(`${text} `);
        waitForPlayerInput(() => {
          if (script) {
            scriptContext.cursor = 0;
            processStatements(scriptContext, script);
          }
          this._ctx.cursor++;
          process.stdout.write('\n');
          this.run();
        });
        break;
      }
      case 'goto': {
        let gotoIndex = content.findIndex((c) => c.label === contentText);
        if (gotoIndex === -1) {
          // just continue
          gotoIndex = cursor + 1;
          if (this.argv.verbose) {
            Log.red('!', `Label "${contentText}" not found. Continuing...`);
          }
        }
        if (script) {
          scriptContext.cursor = 0;
          processStatements(scriptContext, script);
        }
        if (this.argv.verbose) {
          console.log(`goto index: ${gotoIndex}`);
        }
        this._ctx.cursor = gotoIndex;
        this.run();
        break;
      }
      default:
        throw new Error(`Unknown content type: ${type}`);
    }
  }

  private replaceVariables(text?: string): string {
    if (!text) {
      return '';
    }
    return text.replace(/\${(.*?)}/g, (match, variable) => {
      return String(this._ctx.scriptContext.variables[variable]) ?? match;
    });
  }
}
