import { Command } from 'commander';
import * as readline from 'readline';
import * as fs from 'fs';
const program = new Command();


interface Transaction {
    "operation": string;
    "unit-cost": number;
    "quantity": number;
}

function processTransaction(transaction: Transaction) {
    console.log(`Operation: ${transaction.operation}, Unit Cost: ${transaction["unit-cost"]}, Quantity: ${transaction.quantity}`);
}

program
    .version('1.0.0')
    .description("Process JSON data from stdin")
    // .option('-f, --file <type>', 'Specify the file path for JSON input')
    .action((options) => {

        let data_stdout: string[] = [];
        process.stdin.on('data', (data_stdin) => {

            // Primeiro, adicionamos um delimitador confiável para dividir os arrays
            const correctedString: string = data_stdin.toString().replace(/\]\s*\[/g, ']|[');

            // Agora, divida a string corrigida no delimitador para obter cada array JSON como uma string separada
            const arrayStrings: string[] = correctedString.split('|');


            // percorre cada lista/linha de operação (cada iteração tem lógica independente) ----------------
            for (let i = 0; i < arrayStrings.length; i++) {
            
                // Converter cada string de array JSON em um array de objetos JavaScript
                const operationsArr = JSON.parse(arrayStrings[i]);
                let taxesArr: Record<string, number>[] = [];

                let currentBuy = 0;
                let averegeBuy = 0;

                // let preventLoss = 0; // x >= 0
                let currentLoss = 0; // x <= 0
                let currentProfit = 0; // x >= 0


                // percorre cada objeto da operação ----------------
                for (const operationObj of operationsArr) {
                    
                    let tax: number = 0;

                    // identifica cada propriedade (operation, unit-cost, quantity)
                    const operation: string = operationObj['operation']
                    const unit_cost: number = operationObj['unit-cost']
                    const quantity: number = operationObj['quantity']

                    const operation_cost = unit_cost * quantity
                    
                    if (operation === 'sell' && operation_cost > 20000) {
                        

                        // calcula lucro ou prejuizo considerando prejuizo anterior                        
                        if (unit_cost > averegeBuy) {
                            // se lucro
                            
                            // calcula lucro
                            const operation_buy = averegeBuy * quantity
                            const operation_sell = unit_cost * quantity

                            const profit = operation_sell - operation_buy
                            const real_profit = profit - currentLoss  // subtrai prejuizo anterior (se houver)

                            // calcula imposto (20% do lucro)
                            tax = (real_profit * 20) / 100

                            console.log('teve lucro: R$'+real_profit)

                        } else if (unit_cost < averegeBuy) {
                            // se prejuizo
                            
                            const operation_buy = averegeBuy * quantity
                            const operation_sell = unit_cost * quantity
                            
                            currentLoss = operation_buy - operation_sell

                            tax = 0 // nao paga imposto

                            console.log('teve prejuizo: '+currentLoss)

                        } else {
                            // se nao ha lucro e nem prejuizo
                            console.log('nao teve prejuizo e nem lucro')
                        }



                    } else if(operation === 'buy') {
                        currentBuy++;
                        
                        
                        if (currentBuy > 1) {
                            // faz calculo de media ponderada
                            // for (let j = 1; j <= currentBuy; j++) {

                            //     const a = operationsArr[j-1];

                            //     console.dir(a)

                            //     // averegeBuy = a
                            // }
                            averegeBuy = unit_cost; // temp*

                        } else {
                            averegeBuy = unit_cost; // se teve 1 compra, considerar esta como base para calculo
                        }

                    }


                    taxesArr.push( { tax } );
                    // console.log(operation,unit_cost,quantity)
                }


                // --------- PRINT STDOUT
                console.dir(taxesArr)



                // executar funcao aqui para todos os casos de uso
                // data_stdout = operationsArr
            }
        });

        process.stdin.on('end', () => {
            // console.dir(data_stdout)
            // processJsonData(data);
        });


        // via streams
        // const rl = readline.createInterface({
        //     input: process.stdin,
        //     output: process.stdout,
        //     terminal: false
        // });

        // rl.on('line', (line) => {
        //     // console.log('line: '+line);

        //     // Corrigindo a entrada para tornar múltiplos arrays JSON válidos
        //     const correctedLine = line.replace(/\]/g, '],');

        //     try {
        //         // Processa como um único grande array
        //         const transactions: Transaction[] = JSON.parse(`[${correctedLine}]`);
        //         transactions.forEach(processTransaction);
        //     } catch (e) {
        //         console.error('Error parsing JSON:', e);
        //     }
        // });
    });

program.parse(process.argv);
