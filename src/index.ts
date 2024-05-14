import { Command } from 'commander';
import * as readline from 'readline';
import * as fs from 'fs';
const program = new Command();


interface Operation {
    "operation": string;
    "unit-cost": number;
    "quantity": number;
}

function processTransaction(transaction: Operation) {
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

                let averegeBuyPrice = 0; // media ponderada
                let currentLoss = 0; // saldo de prejuizo              
                let balance = 0; // saldo de compra x venda

                // percorre cada objeto da operação ----------------
                // for (const operationObj of operationsArr) {
                for (const [keyObj, operationObj] of operationsArr.entries()) {
                    
                    let tax: number = 0;                  
                    const obj: Operation = operationObj;

                    // identifica cada propriedade (operation, unit-cost, quantity)
                    const operation: string = obj['operation']
                    const unit_cost: number = obj['unit-cost']
                    const quantity: number = obj['quantity']

                    const operation_cost = unit_cost * quantity
                    
                    if (operation === 'sell') {

                        // calcula operacao de venda e compra
                        const operation_buy = averegeBuyPrice * quantity
                        const operation_sell = unit_cost * quantity

                        // calcula lucro ou prejuizo considerando prejuizo anterior                        
                        if (unit_cost > averegeBuyPrice) {
                        // if (operation_buy > operation_sell) {
                            // se lucro
                            
                            // calcula lucro
                            const profit = operation_sell - operation_buy
                            const real_profit = (profit - currentLoss) >= 0 ? profit - currentLoss : 0  // subtrai prejuizo anterior (se houver)

                            // atualiza prejuizo anterior conforme lucro atual
                            if (profit > 0 && currentLoss > 0) {
                                currentLoss = (currentLoss > profit) ? currentLoss - profit : 0
                            }

                            // calcula imposto (20% do lucro)
                            tax = operation_cost > 20000 ? ((real_profit * 20) / 100) : 0

                            console.log('teve lucro real: R$'+real_profit+' lucro: '+profit+ ' prejuizo atual: '+currentLoss+' tax: '+tax)

                        } else if (unit_cost < averegeBuyPrice) {
                            // se prejuizo
                            
                            // calcula prejuizo
                            currentLoss = operation_buy - operation_sell

                            tax = 0 // nao paga imposto por duas razões: teve prejuizo e/ou se for menor que 20K de operação

                            console.log('teve prejuizo: '+currentLoss)

                        } else {
                            // se nao ha lucro e nem prejuizo
                            console.log('nao teve prejuizo e nem lucro')
                        }

                        // saldo de acoes
                        balance -= quantity;


                    } else if(operation === 'buy') {

                        

                        const buyTransactions = operationsArr.filter((t: any, k: number) => {
                            // console.log(t['unit-cost'],keyObj,k, k <= keyObj && t.operation === "buy")
                            return t.operation === "buy" && k <= keyObj
                        });
                        
                        const totalBuyTransactions = Number(buyTransactions.length)

                        if ( totalBuyTransactions > 1 && balance > 0 ) {
                            
                            // Calcular a média ponderada do custo unitário de cada operacao
                            const weightedAverageCost = ( (balance * averegeBuyPrice) + operation_cost ) / (balance + quantity)
                            
                            averegeBuyPrice = parseFloat( weightedAverageCost.toFixed(2) )
                            
                            // console.log( `((${balance} * ${averegeBuyPrice}) + (${quantity} * ${unit_cost})) / (${balance} + ${quantity})` )
                            console.log(`Média ponderada de custo unitário para compras (transacao > 1): ${averegeBuyPrice} - balance: ${balance}`);

                        } else {
                            
                            averegeBuyPrice = unit_cost
                            console.log(`Média ponderada de custo unitário para compras (transacao = 1 ou saldo = 0): ${averegeBuyPrice} - balance: ${balance}`);
                        }

                        
                        balance += quantity;

                        /**
                         * 
                         * nova-media-ponderada = ((quantidade-de-acoes-atual * media-ponderada-atual) + (quantidade-de-acoes * valor-de-compra)) 
                         * / (quantidade-de-acoes-atual + quantidade-de-acoes-compradas)
                         * 
                         */
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
