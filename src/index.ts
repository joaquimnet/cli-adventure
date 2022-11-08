import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';

import { Log } from './log';
import { FileType, getSourceType } from './file/get-type';
import { loadFile } from './file/load-file';
import { AdventureRunner } from './adventure';

yargs(hideBin(process.argv))
  .command(
    'start [adventure]',
    'start the adventure',
    (yargs) => {
      return yargs
        .positional('adventure', {
          describe: 'adventure to load',
        })
        .demandOption('adventure');
    },
    async (argv) => {
      const sourceType = getSourceType(argv.adventure as string);
      if (argv.verbose) {
        Log.cyan('?', argv.adventure, 'source type:', sourceType);
      }
      if (sourceType === FileType.Invalid) {
        Log.red('!', `Invalid adventure. "${argv.adventure}"`);
        process.exit(1);
      }

      let adventure;
      let source;
      try {
        const loaded = await loadFile(argv.adventure as string, sourceType);
        adventure = loaded.adventure;
        source = loaded.source;
      } catch (e) {
        if ((e as any).message.includes('JSON')) {
          Log.red('!', 'Invalid adventure. Not valid JSON.');
          process.exit(1);
        } else {
          throw e;
        }
      }

      // Log.green('>>>', 'Welcome to the adventure CLI!');
      if (argv.verbose) {
        Log.cyan('?', 'Adventure loaded:', source);
      }

      Log.cyan('>>>', adventure.title);

      if (adventure.author) {
        Log.cyan('>>>', 'By:', adventure.author);
      }
      if (adventure.date) {
        Log.cyan('>>>', 'Date:', adventure.date);
      }
      if (adventure.tags) {
        Log.cyan('>>>', 'Tags:', [...adventure.tags]);
      }
      if (adventure.version) {
        Log.cyan('>>>', 'Version:', adventure.version);
      }
      if (adventure.description) {
        Log.cyan('>>>', 'Description:', adventure.description);
      }

      Log.cyan('>>>', '-'.repeat(80));

      const adventureRunner = new AdventureRunner(adventure, argv);

      adventureRunner.run();
    },
  )
  .option('verbose', {
    alias: 'v',
    type: 'boolean',
    description: 'Run with verbose logging',
  })
  .check((argv) => {
    if (argv.verbose) {
      console.log('argv: ', argv);
    }
    return true;
  })
  .parse();
