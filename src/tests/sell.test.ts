import { describe, it, expect } from 'vitest';
import { updateBalance } from '../services/operationService';

describe('sum function', () => {
  it('update current balance', () => {
    expect(updateBalance(1, 2, "buy")).toBe(3);
  });
});

/**
 * 
toBe: Utilizado para comparar valores primitivos ou verificar a identidade de um objeto. Por exemplo, verificar se um valor é exatamente igual ao esperado.

toEqual: Usado para verificar a igualdade de dois objetos, arrays ou classes. Ele faz uma comparação profunda que inclui as propriedades dos objetos.

toBeTruthy e toBeFalsy: Estes métodos são usados para verificar se um valor é verdadeiro ou falso no contexto booleano. Por exemplo, null, undefined, 0, false, e '' são considerados falsos.

toBeNull: Verifica se um valor é null.

toBeUndefined: Verifica se um valor é undefined.

toBeDefined: O oposto de toBeUndefined, verifica se um valor foi definido.

toBeGreaterThan, toBeGreaterThanOrEqual, toBeLessThan, toBeLessThanOrEqual: Utilizados para realizar comparações numéricas, como verificar se um valor é maior, maior ou igual, menor ou menor ou igual a outro.

toMatch: Usado para verificar se um valor corresponde a uma expressão regular.

toContain: Verifica se um item está presente em um array ou se uma substring está presente em uma string.

toThrow: Verifica se a execução de uma função lança um erro.

toHaveBeenCalled e toHaveBeenCalledTimes: Utilizados em conjunto com mocks para verificar se funções foram chamadas e quantas vezes foram chamadas.
 */