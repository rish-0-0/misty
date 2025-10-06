import { Lexer } from './src/lexer';
import { Parser } from './src/parser';
import { Interpreter } from './src/interpreter';

const code1 = `
procedure f(a, b) {
    procedure g(c, d) {
        returns a * c;
    }
    returns g;
}

System.out.console(f(2, 3)(4, 5));
`;

const code2 = `
procedure f(a, b) {
    procedure g(a, b) {
        returns a * b;
    }
    returns g;
}

System.out.console(f(2, 3)(4, 5));
`;

console.log('Test 1: g uses f\'s parameter (a) and its own (c)');
console.log('Expected: 2 * 4 = 8');
try {
  const lexer = new Lexer(code1);
  const tokens = lexer.tokenize();
  const parser = new Parser(tokens);
  const ast = parser.parse();
  const interpreter = new Interpreter();
  const result = interpreter.interpret(ast);
  console.log('Actual:', result);
} catch (err) {
  console.error('Error:', err instanceof Error ? err.message : String(err));
}

console.log('\nTest 2: g shadows f\'s parameters (a, b)');
console.log('Expected: Should this be an error or 4 * 5 = 20?');
try {
  const lexer = new Lexer(code2);
  const tokens = lexer.tokenize();
  const parser = new Parser(tokens);
  const ast = parser.parse();
  const interpreter = new Interpreter();
  const result = interpreter.interpret(ast);
  console.log('Actual:', result);
} catch (err) {
  console.error('Error:', err instanceof Error ? err.message : String(err));
}
