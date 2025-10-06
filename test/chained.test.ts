import { Lexer } from './src/lexer';
import { Parser } from './src/parser';
import { Interpreter } from './src/interpreter';

const code = `procedure f(c, d) {
    procedure g(a, b) {
        returns a + b + c + d;
    }
    returns g;
}

System.out.console(f(2, 3)(4, 5));`;

try {
    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();
    const interpreter = new Interpreter();
    const result = interpreter.interpret(ast);
    console.log('Output:', result);
} catch (err) {
    console.error('Error:', err instanceof Error ? err.message : String(err));
}
