import { cyan, green, yellow, red } from 'nanocolors';

export class Log {
  public static green(prefix: string, ...message: any[]): void {
    console.log(green(prefix), ...message);
  }

  public static cyan(prefix: string, ...message: any[]): void {
    console.log(cyan(prefix), ...message);
  }

  public static yellow(prefix: string, ...message: any[]): void {
    console.log(yellow(prefix), ...message);
  }

  public static red(prefix: string, ...message: any[]): void {
    console.log(red(prefix), ...message);
  }
}
