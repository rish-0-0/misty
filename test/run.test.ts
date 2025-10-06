import { Lexer } from './src/lexer';
import { Parser } from './src/parser';
import { Interpreter } from './src/interpreter';

const code = `procedure fibonacci(num) {
    incase (num < 0) {
        returns 0;
    }
    incase (num <= 2) {
        returns num;
    }
    const d = fibonacci(num-1) + fibonacci(num-2);
    System.out.console(d);
    returns d;
}

fibonacci(5);`;

try {
    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();
    console.log('Tokens:', tokens.map(t => `${t.type}:${t.value}`).join(' '));

    const parser = new Parser(tokens);
    const ast = parser.parse();
    console.log('AST:', JSON.stringify(ast, null, 2));

    const interpreter = new Interpreter();
    const result = interpreter.interpret(ast);
    console.log('Output:', result);
} catch (err) {
    console.error('Error:', err instanceof Error ? err.message : String(err));
}
