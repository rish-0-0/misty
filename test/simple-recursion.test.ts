import { Lexer } from '../src/lexer';
import { Parser } from '../src/parser';
import { Interpreter } from '../src/interpreter';

// Test 1: Simple base case
console.log('Test 1: Simple recursion with immediate return');
const code1 = `
procedure test(n) {
  incase (n == 0) {
    returns 0;
  }
  returns n;
}

System.out.console("test(0) = " + test(0));
System.out.console("test(5) = " + test(5));
`;

try {
  const lexer = new Lexer(code1);
  const tokens = lexer.tokenize();
  const parser = new Parser(tokens);
  const ast = parser.parse();
  const interpreter = new Interpreter();
  const result = interpreter.interpret(ast);
  console.log('✅ Test 1 passed:');
  console.log(result);
} catch (err) {
  console.log('❌ Test 1 failed:', err instanceof Error ? err.message : String(err));
}

// Test 2: One level of recursion
console.log('\n\nTest 2: One level of recursion');
const code2 = `
procedure countdown(n) {
  System.out.console("countdown(" + n + ")");
  incase (n <= 0) {
    returns 0;
  }
  returns countdown(n - 1);
}

countdown(1);
`;

try {
  const lexer = new Lexer(code2);
  const tokens = lexer.tokenize();
  const parser = new Parser(tokens);
  const ast = parser.parse();
  const interpreter = new Interpreter();
  const result = interpreter.interpret(ast);
  console.log('✅ Test 2 passed:');
  console.log(result);
} catch (err) {
  console.log('❌ Test 2 failed:', err instanceof Error ? err.message : String(err));
}

// Test 3: Three levels of recursion
console.log('\n\nTest 3: Three levels of recursion');
const code3 = `
procedure countdown(n) {
  System.out.console("countdown(" + n + ")");
  incase (n <= 0) {
    returns 0;
  }
  returns countdown(n - 1);
}

countdown(3);
`;

try {
  const lexer = new Lexer(code3);
  const tokens = lexer.tokenize();
  const parser = new Parser(tokens);
  const ast = parser.parse();
  const interpreter = new Interpreter();
  const result = interpreter.interpret(ast);
  console.log('✅ Test 3 passed:');
  console.log(result);
} catch (err) {
  console.log('❌ Test 3 failed:', err instanceof Error ? err.message : String(err));
}
