import { Command } from 'commander';
import { getTaxesStdOut } from './services/operationService';
import { IOperation } from './types';


const program = new Command();

program
    .version('1.0.0')
    .description("Process JSON data from stdin")
    .command('process')
    .action((options) => {

        process.stdin.on('data', (data_stdin) => {

            // Primeiro, adicionamos um delimitador confiável para dividir os arrays
            const correctedString: string = data_stdin.toString().replace(/\]\s*\[/g, ']|[');

            // Agora, divida a string corrigida no delimitador para obter cada array JSON como uma string separada
            const arrayStrings: string[] = correctedString.split('|');

            // percorre cada lista/linha de operação (cada iteração tem lógica independente)
            for (let i = 0; i < arrayStrings.length; i++) {
            
                const operationsArr: IOperation[] = JSON.parse(arrayStrings[i]);
                
                const taxesStdOut: Record<string, number | string>[] = getTaxesStdOut(operationsArr)

                // --------- STDOUT
                console.dir(taxesStdOut)
            }
        });
    });

program.parse(process.argv);
