import { Command } from 'commander';
const program = new Command();

program
  .version('0.1.0')
  .command('greet <name>')
  .description('Greet an individual by name')
  .action((name: string) => {
    console.log(`Hello, ${name}!`);
  });

program.parse(process.argv);
