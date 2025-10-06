import { Lexer } from '../src/lexer';
import { Parser } from '../src/parser';
import { Interpreter } from '../src/interpreter';

console.log('Testing array indexing...\n');

// Test 1: Basic array indexing
console.log('Test 1: Basic array indexing');
const code1 = `
const arr = [10, 20, 30];
System.out.console(arr[0]);
System.out.console(arr[1]);
System.out.console(arr[2]);
`;

try {
  const lexer = new Lexer(code1);
  const tokens = lexer.tokenize();
  const parser = new Parser(tokens);
  const ast = parser.parse();
  const interpreter = new Interpreter();
  const result = interpreter.interpret(ast);
  const expected = '10\n20\n30';
  if (result === expected) {
    console.log('✅ Test 1 passed');
  } else {
    console.log('❌ Test 1 failed');
    console.log('Expected:', expected);
    console.log('Got:', result);
  }
} catch (err) {
  console.log('❌ Test 1 failed:', err instanceof Error ? err.message : String(err));
}

// Test 2: Nested arrays
console.log('\nTest 2: Nested array indexing');
const code2 = `
const matrix = [[1, 2], [3, 4]];
System.out.console(matrix[0][0]);
System.out.console(matrix[0][1]);
System.out.console(matrix[1][0]);
System.out.console(matrix[1][1]);
`;

try {
  const lexer = new Lexer(code2);
  const tokens = lexer.tokenize();
  const parser = new Parser(tokens);
  const ast = parser.parse();
  const interpreter = new Interpreter();
  const result = interpreter.interpret(ast);
  const expected = '1\n2\n3\n4';
  if (result === expected) {
    console.log('✅ Test 2 passed');
  } else {
    console.log('❌ Test 2 failed');
    console.log('Expected:', expected);
    console.log('Got:', result);
  }
} catch (err) {
  console.log('❌ Test 2 failed:', err instanceof Error ? err.message : String(err));
}

// Test 3: Variables as indices
console.log('\nTest 3: Variables as indices');
const code3 = `
const arr = [100, 200, 300];
const i = 1;
System.out.console(arr[i]);
`;

try {
  const lexer = new Lexer(code3);
  const tokens = lexer.tokenize();
  const parser = new Parser(tokens);
  const ast = parser.parse();
  const interpreter = new Interpreter();
  const result = interpreter.interpret(ast);
  const expected = '200';
  if (result === expected) {
    console.log('✅ Test 3 passed');
  } else {
    console.log('❌ Test 3 failed');
    console.log('Expected:', expected);
    console.log('Got:', result);
  }
} catch (err) {
  console.log('❌ Test 3 failed:', err instanceof Error ? err.message : String(err));
}

// Test 4: Expressions as indices
console.log('\nTest 4: Expressions as indices');
const code4 = `
const arr = [5, 10, 15, 20];
System.out.console(arr[1 + 1]);
System.out.console(arr[0 + 3]);
`;

try {
  const lexer = new Lexer(code4);
  const tokens = lexer.tokenize();
  const parser = new Parser(tokens);
  const ast = parser.parse();
  const interpreter = new Interpreter();
  const result = interpreter.interpret(ast);
  const expected = '15\n20';
  if (result === expected) {
    console.log('✅ Test 4 passed');
  } else {
    console.log('❌ Test 4 failed');
    console.log('Expected:', expected);
    console.log('Got:', result);
  }
} catch (err) {
  console.log('❌ Test 4 failed:', err instanceof Error ? err.message : String(err));
}

// Test 5: With procedures
console.log('\nTest 5: Array indexing in procedures');
const code5 = `
procedure getFirst(arr) {
  returns arr[0];
}

const nums = [42, 99, 7];
System.out.console(getFirst(nums));
`;

try {
  const lexer = new Lexer(code5);
  const tokens = lexer.tokenize();
  const parser = new Parser(tokens);
  const ast = parser.parse();
  const interpreter = new Interpreter();
  const result = interpreter.interpret(ast);
  const expected = '42';
  if (result === expected) {
    console.log('✅ Test 5 passed');
  } else {
    console.log('❌ Test 5 failed');
    console.log('Expected:', expected);
    console.log('Got:', result);
  }
} catch (err) {
  console.log('❌ Test 5 failed:', err instanceof Error ? err.message : String(err));
}

// Test 6: Object properties with bracket notation
console.log('\nTest 6: Object bracket notation');
const code6 = `
const obj = {name: "Alice", age: 30};
System.out.console(obj["name"]);
System.out.console(obj["age"]);
`;

try {
  const lexer = new Lexer(code6);
  const tokens = lexer.tokenize();
  const parser = new Parser(tokens);
  const ast = parser.parse();
  const interpreter = new Interpreter();
  const result = interpreter.interpret(ast);
  const expected = 'Alice\n30';
  if (result === expected) {
    console.log('✅ Test 6 passed');
  } else {
    console.log('❌ Test 6 failed');
    console.log('Expected:', expected);
    console.log('Got:', result);
  }
} catch (err) {
  console.log('❌ Test 6 failed:', err instanceof Error ? err.message : String(err));
}

console.log('\n✅ All array indexing tests completed!');
