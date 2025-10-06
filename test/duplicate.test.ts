import { Lexer } from './src/lexer';
import { Parser } from './src/parser';

const code = `procedure add(a, b, a) {
    returns a + b;
}`;

try {
    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();
    console.log('Parsed successfully (should not happen)');
} catch (err) {
    console.log('Error (expected):', err instanceof Error ? err.message : String(err));
}
