import { Lexer } from '../src/lexer';
import { Parser } from '../src/parser';
import { Interpreter } from '../src/interpreter';

const code = `
# Recursive Fibonacci
procedure fibRecursive(n) {
  incase (n <= 1) {
    returns n;
  }
  returns fibRecursive(n - 1) + fibRecursive(n - 2);
}

# Iterative Fibonacci
procedure fibIterative(n) {
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

System.out.console("Recursive Fibonacci:");
System.out.console("fib(0) = " + fibRecursive(0));
System.out.console("fib(1) = " + fibRecursive(1));
System.out.console("fib(5) = " + fibRecursive(5));
System.out.console("fib(10) = " + fibRecursive(10));
System.out.console("fib(15) = " + fibRecursive(15));

System.out.console("");
System.out.console("Iterative Fibonacci:");
System.out.console("fib(0) = " + fibIterative(0));
System.out.console("fib(1) = " + fibIterative(1));
System.out.console("fib(5) = " + fibIterative(5));
System.out.console("fib(10) = " + fibIterative(10));
System.out.console("fib(20) = " + fibIterative(20));
System.out.console("fib(30) = " + fibIterative(30));
`;

console.log('Testing Fibonacci (Recursive and Iterative)...\n');

try {
  const lexer = new Lexer(code);
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
