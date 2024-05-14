import { Command } from 'commander';
import { Operation } from './types'

const program = new Command();

// function processTransaction(transaction: Operation) {
//     console.log(`Operation: ${transaction.operation}, Unit Cost: ${transaction["unit-cost"]}, Quantity: ${transaction.quantity}`);
// }

// calcula lucro
function calcProfit(operation_sell: number, operation_buy: number) {
    return operation_sell - operation_buy;
}

// calcula lucro real (subtrai o prejuizo anterior se houver)
function calcRealProfit(profit: number, currentLoss: number) {    
    return (profit - currentLoss) >= 0 ? profit - currentLoss : 0 
}

// atualiza prejuizo anterior conforme lucro atual
function updateLoss(profit:number, currentLoss: number) {
    if (profit > 0 && currentLoss > 0) {
        return (currentLoss > profit) ? currentLoss - profit : 0
    }
    return currentLoss
}

// calcula imposto (20% do lucro)
function calcTax(operation_cost: number, real_profit: number) {
    return operation_cost > 20000 ? ((real_profit * 20) / 100) : 0
}


program
    .version('1.0.0')
    .description("Process JSON data from stdin")
    .command('process')
    .action((options) => {

        const debug = false;

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

                        // se lucro                     
                        if (unit_cost > averegeBuyPrice) {
                        // if (operation_buy > operation_sell) {
                            
                            const profit = calcProfit(operation_sell, operation_buy)
                            const real_profit = calcRealProfit(profit, currentLoss)
                            
                            currentLoss = updateLoss(profit, currentLoss)
                            tax = calcTax(operation_cost, real_profit);

                            debug && console.log('teve lucro real: R$'+real_profit+' lucro: '+profit+ ' prejuizo atual: '+currentLoss+' tax: '+tax)

                        // se prejuizo
                        } else if (unit_cost < averegeBuyPrice) {
                            
                            // calcula prejuizo
                            currentLoss = operation_buy - operation_sell

                            tax = 0 // nao paga imposto por duas razões: teve prejuizo e/ou se for menor que 20K de operação

                            debug && console.log('teve prejuizo: '+currentLoss)

                        } else {
                            // se nao ha lucro e nem prejuizo
                            debug && console.log('nao teve prejuizo e nem lucro')
                        }

                        // saldo de acoes
                        balance -= quantity;


                    } else if(operation === 'buy') {

                        

                        const buyTransactions = operationsArr.filter((t: any, k: number) => {
                            return t.operation === "buy" && k <= keyObj
                        });
                        
                        const totalBuyTransactions = Number(buyTransactions.length)

                        if ( totalBuyTransactions > 1 && balance > 0 ) {
                            
                            //
                            // Calcular a média ponderada do custo unitário de cada operacao
                            // nova-media-ponderada = ((quantidade-de-acoes-atual * media-ponderada-atual) + (quantidade-de-acoes * valor-de-compra)) / (quantidade-de-acoes-atual + quantidade-de-acoes-compradas)
                            //
                            const weightedAverageCost = ( (balance * averegeBuyPrice) + operation_cost ) / (balance + quantity)
                            
                            averegeBuyPrice = parseFloat( weightedAverageCost.toFixed(2) )
                            
                            // console.log( `((${balance} * ${averegeBuyPrice}) + (${quantity} * ${unit_cost})) / (${balance} + ${quantity})` )
                            debug && console.log(`Média ponderada de custo unitário para compras (transacao > 1): ${averegeBuyPrice} - balance: ${balance}`);

                        } else {
                            
                            averegeBuyPrice = unit_cost
                            debug && console.log(`Média ponderada de custo unitário para compras (transacao = 1 ou saldo = 0): ${averegeBuyPrice} - balance: ${balance}`);
                        }

                        balance += quantity;
                    }

                    taxesArr.push( { tax } );
                }


                // --------- STDOUT
                console.dir(taxesArr)

            }
        });
    });

program.parse(process.argv);
