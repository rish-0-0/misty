import { Lexer } from '../src/lexer';
import { Parser } from '../src/parser';
import { Interpreter } from '../src/interpreter';

const fibCode = `
# Iterative Fibonacci (safe for large numbers)
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

# Small recursive version (only for small n)
procedure fibRecursive(n) {
  incase (n <= 1) {
    returns n;
  }
  returns fibRecursive(n - 1) + fibRecursive(n - 2);
}

# Test iterative (safe)
System.out.console("Iterative Fibonacci:");
System.out.console("fib(0) = " + fib(0));
System.out.console("fib(1) = " + fib(1));
System.out.console("fib(5) = " + fib(5));
System.out.console("fib(10) = " + fib(10));
System.out.console("fib(20) = " + fib(20));

# Test recursive (only small numbers!)
System.out.console("");
System.out.console("Recursive Fibonacci (small n only):");
System.out.console("fibRecursive(0) = " + fibRecursive(0));
System.out.console("fibRecursive(1) = " + fibRecursive(1));
System.out.console("fibRecursive(5) = " + fibRecursive(5));
System.out.console("fibRecursive(8) = " + fibRecursive(8));
`;

console.log('Testing Fibonacci implementation...\n');

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
