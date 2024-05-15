import { describe, it, expect } from 'vitest';
import { calcLoss, calcNewAverageBuyCost, calcOperation, calcProfit, calcRealProfit, calcTax, calcTaxSell, checkStatus, getCurrentLoss, getQtdeBuyTransactions, getTaxesStdOut, hasAbleToCalcAverageBuy, updateBalance, updateLoss } from '../services/operationService';
import { IOperation } from '../types';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { parseStdin } from '../utils/parseStdin';



describe('Operation Services', () => {

  it('calcProfit() - calc overall profit for operations sell.', () => {
    expect(calcProfit(750, 500)).toBe(250);
  });

  it('calcRealProfit() - calc real profit for operations sell.', () => {
    expect(calcRealProfit(250,0)).toBe(250);
    expect(calcRealProfit(250,50)).toBe(200);
    expect(calcRealProfit(250,350)).toBe(0);
  });

  it('updateLoss() - calc loss for operations sell.', () => {
    expect(updateLoss(250,350)).toBe(100);
    expect(updateLoss(350,250)).toBe(0);
    expect(updateLoss(0,350)).toBe(350);
    expect(updateLoss(250,0)).toBe(0);
  });

  it('calcTax() - calc tax for operations sell.', () => {
    expect(calcTax(250,200)).toBe(0);
    expect(calcTax(100000,50000)).toBe(10000);
    expect(calcTax(750,250)).toBe(0);
  });

  it('calcLoss() - calc loss for operations sell.', () => {
    expect(calcLoss(50000,25000)).toBe(25000);
    expect(calcLoss(25000, 50000)).toBe(0);
  });

  it('checkStatus() - check operations status in the sell.', () => {
    expect(checkStatus(20,10)).toBe(1);
    expect(checkStatus(10,15)).toBe(-1);
    expect(checkStatus(10,10)).toBe(0);
  });

  it('calcOperation() - calc operations overall.', () => {

    expect(calcOperation(10,10000)).toBe(100000);
    expect(calcOperation(20,5000)).toBe(100000);
    expect(calcOperation(20,0)).toBe(0);
    expect(calcOperation(0,20)).toBe(0);
  });

  it('getQtdeBuyTransactions() - qtde buy operations so far.', () => {

    // use case 7
    const stdin_case_7 = readFileSync(resolve('./src/operations/case7.json'), 'utf8');
    const arr: IOperation[] = parseStdin(stdin_case_7)

    // count 1
    expect(getQtdeBuyTransactions(arr,0)).toBe(1);
    expect(getQtdeBuyTransactions(arr,1)).toBe(1);
    expect(getQtdeBuyTransactions(arr,2)).toBe(1);
    expect(getQtdeBuyTransactions(arr,3)).toBe(1);
    expect(getQtdeBuyTransactions(arr,4)).toBe(1);

    // // count 2
    expect(getQtdeBuyTransactions(arr,5)).toBe(2);
    expect(getQtdeBuyTransactions(arr,6)).toBe(2);
    expect(getQtdeBuyTransactions(arr,7)).toBe(2);
    expect(getQtdeBuyTransactions(arr,8)).toBe(2);
  });


  it('hasAbleToCalcAverageBuy() - check if can calc average in buy.', () => {

    expect(hasAbleToCalcAverageBuy(2,3000)).toBeTruthy();
    expect(hasAbleToCalcAverageBuy(1,3000)).toBeFalsy();
    expect(hasAbleToCalcAverageBuy(3,0)).toBeFalsy();
  });

  it('calcNewAverageBuyCost() - calc average in buy.', () => {

    expect(calcNewAverageBuyCost(2,0,10,20,10000)).toBe(20); // if balance is zero
    expect(calcNewAverageBuyCost(2,10000,10,25,5000)).toBe(15); // if balance > 0
  });

  it('calcTaxSell() - calc tax.', () => {

    expect(calcTaxSell(40000, 2, 5000, 10)).toBe(0); 
    expect(calcTaxSell(0, 20, 5000, 10)).toBe(10000); 
  });

  it('getCurrentLoss() - loss in sell.', () => {

    expect(getCurrentLoss(0, 5, 5000, 10)).toBe(25000); 
  });


  it('updateBalance() - loss in sell.', () => {

    expect(updateBalance(0,10000,'buy')).toBe(10000); 
    expect(updateBalance(10000,5000,'sell')).toBe(5000); 
  });
})






