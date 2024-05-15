import { Command } from 'commander';
import { IOperation } from './types'

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

function calcTaxSell(currentLoss: number, unit_cost: number, quantity: number, averegeBuyPrice: number): number {
    let newTax = 0;      

    const { operation_cost, operation_buy, operation_status } = getOperationInfo(unit_cost, quantity, averegeBuyPrice)

    if (operation_status === OPERATION_STATUS.Profit) {
        const profit = calcProfit(operation_cost, operation_buy)
        const real_profit = calcRealProfit(profit, currentLoss)

        newTax = calcTax(operation_cost, real_profit)
    } 

    return newTax
}

function getOperationInfo(unit_cost: number, quantity: number, averegeBuyPrice: number): Record<string, number> {
    return {
        operation_cost: calcOperation(unit_cost, quantity),
        operation_buy: calcOperation(averegeBuyPrice, quantity),
        operation_status: checkStatus(unit_cost, averegeBuyPrice) // lucro ou prejuizo
    }
}

function getCurrentLoss(currentLoss: number, unit_cost: number, quantity: number, averegeBuyPrice: number): number {
    let newCurrentLoss = currentLoss;

    const { operation_cost, operation_buy, operation_status } = getOperationInfo(unit_cost, quantity, averegeBuyPrice)

    if (operation_status === OPERATION_STATUS.Profit) {
        
        newCurrentLoss = updateLoss(
                            calcProfit(operation_cost, operation_buy), 
                            currentLoss
                        )
    } else if (operation_status === OPERATION_STATUS.Loss) {

        newCurrentLoss = calcLoss(operation_buy, operation_cost)
    } 

    return newCurrentLoss
}


function updateBalance(currBalance: number, quantity: number, operation: string): number {

    if (operation === "buy")
        return currBalance + quantity // somar saldo de acoes na compra

    else if (operation === "sell")
        return currBalance - quantity // subtrair saldo de acoes na venda

    return 0
}

function getTaxes(operationsArr: []): Record<string, number>[] {
    let taxesArr: Record<string, number>[] = [];

    let averegeBuyPrice = 0; // media ponderada
    let currentLoss = 0; // saldo de prejuizo              
    let balance = 0; // saldo de compra x venda

    // for (const operationObj of operationsArr) {
    for (const [keyObj, operationObj] of operationsArr.entries()) {
        
        const { operation, 'unit-cost': unit_cost, quantity }: IOperation = operationObj

        let tax = 0;                  
        
        
        if (operation === 'sell') {

            tax = calcTaxSell(currentLoss, unit_cost, quantity, averegeBuyPrice)                        
            currentLoss = getCurrentLoss(currentLoss, unit_cost, quantity, averegeBuyPrice)
            balance = updateBalance(balance, quantity, operation)


        } else if(operation === 'buy') {

            averegeBuyPrice = calcNewAverageBuyCost(
                                    getQtdeBuyTransactions(operationsArr, keyObj), 
                                    balance, 
                                    averegeBuyPrice, 
                                    unit_cost, 
                                    quantity
                                )
            balance = updateBalance(balance, quantity, operation)
        }

        taxesArr.push( { tax } );
    }
    return taxesArr
}




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
            
                const operationsArr = JSON.parse(arrayStrings[i]);
                const taxesArr: Record<string, number>[] = getTaxes(operationsArr)

                // --------- STDOUT
                console.dir(taxesArr)
            }
        });
    });

program.parse(process.argv);
