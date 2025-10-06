import { Lexer } from '../src/lexer';
import { Parser } from '../src/parser';
import { Interpreter } from '../src/interpreter';

function testRecursionDepth(depth: number): boolean {
  const code = `
    procedure countdown(n) {
      incase (n <= 0) {
        returns 0;
      }
      returns countdown(n - 1);
    }

    countdown(${depth});
  `;

  try {
    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();
    const interpreter = new Interpreter();
    interpreter.interpret(ast);
    return true;
  } catch (err) {
    if (err instanceof Error && err.message.includes('Maximum call stack')) {
      return false;
    }
    throw err;
  }
}

console.log('Testing recursion depth limits...\n');

// Binary search to find the exact limit
let low = 0;
let high = 100000;
let maxDepth = 0;

while (low <= high) {
  const mid = Math.floor((low + high) / 2);
  console.log(`Testing depth ${mid}...`);

  if (testRecursionDepth(mid)) {
    maxDepth = mid;
    low = mid + 1;
  } else {
    high = mid - 1;
  }
}

console.log(`\n${'='.repeat(60)}`);
console.log(`✅ Maximum safe recursion depth: ${maxDepth}`);
console.log(`❌ Stack overflow at depth: ${maxDepth + 1}`);
console.log(`${'='.repeat(60)}`);

// Test Fibonacci at the limit
console.log('\nTesting Fibonacci recursion:');
for (const n of [5, 10, 15, 20]) {
  const fibCode = `
    procedure fib(n) {
      incase (n <= 1) {
        returns n;
      }
      returns fib(n - 1) + fib(n - 2);
    }

    const result = fib(${n});
    System.out.console("fib(${n}) = " + result);
  `;

  try {
    const lexer = new Lexer(fibCode);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();
    const interpreter = new Interpreter();
    const result = interpreter.interpret(ast);
    console.log(`✅ fib(${n}) succeeded`);
  } catch (err) {
    console.log(`❌ fib(${n}) failed: ${err instanceof Error ? err.message : String(err)}`);
  }
}
