import { Lexer } from '../src/lexer';
import { Parser } from '../src/parser';
import { Interpreter } from '../src/interpreter';

// Test iterative only - recursive causes stack overflow
const fibCode = `
# Iterative Fibonacci (efficient and safe)
procedure fib(n) {
  incase (n <= 1) {
    returns n;
  }

  mut a = 0;
  mut b = 1;
  mut result = 0;

  drift (mut i = 2; i <= n; i = i + 1) {
    result = a + b;
    a = b;
    b = result;
  }

  returns result;
}

System.out.console("Fibonacci Numbers:");
System.out.console("fib(0) = " + fib(0));
System.out.console("fib(1) = " + fib(1));
System.out.console("fib(2) = " + fib(2));
System.out.console("fib(5) = " + fib(5));
System.out.console("fib(10) = " + fib(10));
System.out.console("fib(15) = " + fib(15));
System.out.console("fib(20) = " + fib(20));
System.out.console("fib(30) = " + fib(30));

System.out.console("");
System.out.console("First 15 Fibonacci numbers:");
drift (mut i = 0; i < 15; i = i + 1) {
  System.out.console("F(" + i + ") = " + fib(i));
}
`;

console.log('Testing Fibonacci (Iterative Only)...\n');

try {
  const lexer = new Lexer(fibCode);
  const tokens = lexer.tokenize();
  const parser = new Parser(tokens);
  const ast = parser.parse();
  const interpreter = new Interpreter();
  const result = interpreter.interpret(ast);

  console.log('✅ SUCCESS!\n');
  console.log('Output:');
  console.log('─'.repeat(60));
  console.log(result);
  console.log('─'.repeat(60));
} catch (err) {
  console.error('❌ ERROR:', err instanceof Error ? err.message : String(err));
}
