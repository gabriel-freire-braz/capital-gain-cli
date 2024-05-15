import { Command } from 'commander';
import { Operation } from './types'

const program = new Command();

// function processTransaction(transaction: Operation) {
//     console.log(`Operation: ${transaction.operation}, Unit Cost: ${transaction["unit-cost"]}, Quantity: ${transaction.quantity}`);
// }

enum OPERATION_STATUS {
    Profit = 1,
    Loss = -1,
    noGainNoLoss = 0
}

// calcula lucro
function calcProfit(operation_sell: number, operation_buy: number): number {
    return operation_sell - operation_buy;
}

// calcula lucro real (subtrai o prejuizo anterior se houver)
function calcRealProfit(profit: number, currentLoss: number) {    
    return (profit - currentLoss) >= 0 ? profit - currentLoss : 0 
}

// atualiza prejuizo conforme lucro da operação atual
function updateLoss(profit:number, currentLoss: number): number {
    if (profit > 0 && currentLoss > 0) {
        return (currentLoss > profit) ? currentLoss - profit : 0
    }
    return currentLoss
}

// calcula imposto (20% do lucro)
function calcTax(operation_cost: number, real_profit: number): number {
    return operation_cost > 20000 ? ((real_profit * 20) / 100) : 0
}

// calcula prejuizo
function calcLoss(operation_buy: number, operation_sell: number): number {
    return operation_buy - operation_sell
}

function checkStatus(unit_cost: number, averegeBuyPrice: number): number {
    // if (operation_buy > operation_sell) {

    if (unit_cost > averegeBuyPrice) 
        return OPERATION_STATUS.Profit
    else if (unit_cost < averegeBuyPrice) 
        return OPERATION_STATUS.Loss
    
    return OPERATION_STATUS.noGainNoLoss
}

// calcula qualquer operação (compra/venda atual ou médias gerais)
function calcOperation(unit_cost: number, quantity: number): number {
    return unit_cost * quantity
}

function getQtdeBuyTransactions(operationsArr: [], currKeyOperation: number): number {
    const buyTransactions = operationsArr.filter((t: any, k: number) => {
        return t.operation === "buy" && k <= currKeyOperation
    });

    return Number(buyTransactions.length)
}

function hasAbleToCalcAverageBuy(qtdeBuyTransactions: number, currBalance: number) {
    return  qtdeBuyTransactions > 1 && currBalance > 0
}

function calcNewAverageBuyCost(qtdeBuyTransactions: number, currBalance: number, currAverageBuyCost: number, currUnitCost: number, currQuantity: number): number {
    let averege = currUnitCost

    const hasAbleToCalc = hasAbleToCalcAverageBuy(qtdeBuyTransactions, currBalance)

    if ( hasAbleToCalc ) {
        const operation_overall = calcOperation(currBalance, currAverageBuyCost)
        const operation_cost = calcOperation(currUnitCost, currQuantity)                            

        // nova-media-ponderada = ((quantidade-de-acoes-atual * media-ponderada-atual) + (quantidade-de-acoes * valor-de-compra)) / (quantidade-de-acoes-atual + quantidade-de-acoes-compradas)
        const weightedAverageCost = ( operation_overall + operation_cost ) / (currBalance + currQuantity) 
        
        averege = parseFloat( weightedAverageCost.toFixed(2) )
    }

    return averege
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
                    
                    const { operation, 'unit-cost': unit_cost, quantity }: Operation = operationObj

                    let tax: number = 0;                  
                    
                    
                    if (operation === 'sell') {

                        const operation_cost = calcOperation(unit_cost, quantity)
                        const operation_buy = calcOperation(averegeBuyPrice, quantity)
                        const operation_status = checkStatus(unit_cost, averegeBuyPrice) // lucro ou prejuizo

                        if (operation_status === OPERATION_STATUS.Profit) {
                            const profit = calcProfit(operation_cost, operation_buy)
                            const real_profit = calcRealProfit(profit, currentLoss)

                            currentLoss = updateLoss(profit, currentLoss)
                            tax = calcTax(operation_cost, real_profit)

                            debug && console.log('teve lucro real: R$'+real_profit+' lucro: '+profit+ ' prejuizo atual: '+currentLoss+' tax: '+tax)
                        } 
                        
                        if (operation_status === OPERATION_STATUS.Loss) {
                            currentLoss = calcLoss(operation_buy, operation_cost)
                            debug && console.log('teve prejuizo: '+currentLoss)
                        } 

                        if (operation_status === OPERATION_STATUS.noGainNoLoss) {
                            debug && console.log('nao teve prejuizo e nem lucro')
                        }

                        // saldo de acoes
                        balance -= quantity;


                    } else if(operation === 'buy') {

                        const qtdeBuyTransactions: number = getQtdeBuyTransactions(operationsArr, keyObj)
                        
                        averegeBuyPrice = calcNewAverageBuyCost(qtdeBuyTransactions, balance, averegeBuyPrice, unit_cost, quantity)

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
