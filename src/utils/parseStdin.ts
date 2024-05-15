

export function parseStdin(stdin: string | [], idx = 0) {
    const correctedString: string = stdin.toString().replace(/\]\s*\[/g, ']|[');
    const arrayStrings: string[] = correctedString.split('|');
    const operationsArr = JSON.parse(arrayStrings[idx]);

    return operationsArr
}