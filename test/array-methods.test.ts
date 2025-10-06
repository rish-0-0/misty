import { Lexer } from '../src/lexer';
import { Parser } from '../src/parser';
import { Interpreter } from '../src/interpreter';

console.log('Testing array methods...\n');

// Test 1: Array length
console.log('Test 1: Array length property');
const code1 = `
const arr = [1, 2, 3, 4, 5];
System.out.console(arr.length);
`;

try {
  const lexer = new Lexer(code1);
  const tokens = lexer.tokenize();
  const parser = new Parser(tokens);
  const ast = parser.parse();
  const interpreter = new Interpreter();
  const result = interpreter.interpret(ast);
  const expected = '5';
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

// Test 2: push method
console.log('\nTest 2: push method');
const code2 = `
mut arr = [1, 2, 3];
arr.push(4);
arr.push(5);
System.out.console(arr.length);
System.out.console(arr[3]);
System.out.console(arr[4]);
`;

try {
  const lexer = new Lexer(code2);
  const tokens = lexer.tokenize();
  const parser = new Parser(tokens);
  const ast = parser.parse();
  const interpreter = new Interpreter();
  const result = interpreter.interpret(ast);
  const expected = '5\n4\n5';
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

// Test 3: pop method
console.log('\nTest 3: pop method');
const code3 = `
mut arr = [10, 20, 30];
const last = arr.pop();
System.out.console(last);
System.out.console(arr.length);
System.out.console(arr[0]);
System.out.console(arr[1]);
`;

try {
  const lexer = new Lexer(code3);
  const tokens = lexer.tokenize();
  const parser = new Parser(tokens);
  const ast = parser.parse();
  const interpreter = new Interpreter();
  const result = interpreter.interpret(ast);
  const expected = '30\n2\n10\n20';
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

// Test 4: shift method
console.log('\nTest 4: shift method');
const code4 = `
mut arr = [100, 200, 300];
const first = arr.shift();
System.out.console(first);
System.out.console(arr.length);
System.out.console(arr[0]);
System.out.console(arr[1]);
`;

try {
  const lexer = new Lexer(code4);
  const tokens = lexer.tokenize();
  const parser = new Parser(tokens);
  const ast = parser.parse();
  const interpreter = new Interpreter();
  const result = interpreter.interpret(ast);
  const expected = '100\n2\n200\n300';
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

// Test 5: unshift method
console.log('\nTest 5: unshift method');
const code5 = `
mut arr = [2, 3];
arr.unshift(1);
arr.unshift(0);
System.out.console(arr.length);
System.out.console(arr[0]);
System.out.console(arr[1]);
System.out.console(arr[2]);
System.out.console(arr[3]);
`;

try {
  const lexer = new Lexer(code5);
  const tokens = lexer.tokenize();
  const parser = new Parser(tokens);
  const ast = parser.parse();
  const interpreter = new Interpreter();
  const result = interpreter.interpret(ast);
  const expected = '4\n0\n1\n2\n3';
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

// Test 6: Array methods in loops
console.log('\nTest 6: Array methods in loops');
const code6 = `
mut stack = [];
drift (mut i = 1; i <= 3; i = i + 1) {
  stack.push(i);
}
mut result = 0;
drift (mut i = 0; i < 3; i = i + 1) {
  result = result + stack.pop();
}
System.out.console(result);
`;

try {
  const lexer = new Lexer(code6);
  const tokens = lexer.tokenize();
  const parser = new Parser(tokens);
  const ast = parser.parse();
  const interpreter = new Interpreter();
  const result = interpreter.interpret(ast);
  const expected = '6'; // 3 + 2 + 1 = 6
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

console.log('\n✅ All array method tests completed!');
