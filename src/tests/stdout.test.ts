import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { parseStdin } from '../utils/parseStdin';
import { getTaxesStdOut } from '../services/operationService';



describe('Use cases test', () => {

  it('getTaxesStdOut() - overall stdout.', () => {

    // use case 1
    const stdin_case_1 = readFileSync(resolve('./src/operations/case1.json'), 'utf8');
    const operations_arr_case_1 = parseStdin(stdin_case_1)

    expect(getTaxesStdOut(operations_arr_case_1)).toStrictEqual([{"tax": 0},{"tax": 0},{"tax": 0}]); 


    // use case 2
    const stdin_case_2 = readFileSync(resolve('./src/operations/case2.json'), 'utf8');
    const operations_arr_case_2 = parseStdin(stdin_case_2)
    
    expect(getTaxesStdOut(operations_arr_case_2)).toStrictEqual([{"tax": 0.00},{"tax": 10000.00},{"tax": 0.00}]); 


    // use case 3
    const stdin_case_3 = readFileSync(resolve('./src/operations/case3.json'), 'utf8');
    const operations_arr_case_3 = parseStdin(stdin_case_3)
    
    expect(getTaxesStdOut(operations_arr_case_3)).toStrictEqual([{"tax": 0.00},{"tax": 0.00},{"tax": 1000.00}]); 


    // use case 4
    const stdin_case_4 = readFileSync(resolve('./src/operations/case4.json'), 'utf8');
    const operations_arr_case_4 = parseStdin(stdin_case_4)
    
    expect(getTaxesStdOut(operations_arr_case_4)).toStrictEqual([{"tax": 0},{"tax": 0},{"tax": 0}]); 


    // use case 5
    const stdin_case_5 = readFileSync(resolve('./src/operations/case5.json'), 'utf8');
    const operations_arr_case_5 = parseStdin(stdin_case_5)
    
    expect(getTaxesStdOut(operations_arr_case_5)).toStrictEqual([{"tax": 0.00},{"tax": 0.00},{"tax": 0.00},{"tax": 10000.00}]); 


    // use case 6
    const stdin_case_6 = readFileSync(resolve('./src/operations/case6.json'), 'utf8');
    const operations_arr_case_6 = parseStdin(stdin_case_6)
    
    expect(getTaxesStdOut(operations_arr_case_6)).toStrictEqual([{"tax": 0.00},{"tax": 0.00},{"tax": 0.00},{"tax": 0.00},{"tax": 3000.00}]); 


    // use case 7
    const stdin_case_7 = readFileSync(resolve('./src/operations/case7.json'), 'utf8');
    const operations_arr_case_7 = parseStdin(stdin_case_7)
    
    expect(getTaxesStdOut(operations_arr_case_7)).toStrictEqual([{"tax":0.00}, {"tax":0.00}, {"tax":0.00}, {"tax":0.00}, {"tax":3000.00},
    {"tax":0.00}, {"tax":0.00}, {"tax":3700.00}, {"tax":0.00}]); 


    // use case 8
    const stdin_case_8 = readFileSync(resolve('./src/operations/case8.json'), 'utf8');
    const operations_arr_case_8 = parseStdin(stdin_case_8)
    
    expect(getTaxesStdOut(operations_arr_case_8)).toStrictEqual([{"tax":0.00},{"tax":80000.00},{"tax":0.00},{"tax":60000.00}]); 
  });

});


