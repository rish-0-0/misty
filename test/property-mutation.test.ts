import { Lexer } from '../src/lexer';
import { Parser } from '../src/parser';
import { Interpreter } from '../src/interpreter';

console.log('Testing property mutation...\n');

// Test 1: Array index mutation
console.log('Test 1: Array index mutation');
const code1 = `
mut arr = [10, 20, 30];
arr[0] = 99;
arr[2] = 77;
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
  const expected = '99\n20\n77';
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

// Test 2: Object property mutation (dot notation)
console.log('\nTest 2: Object property mutation (dot notation)');
const code2 = `
mut obj = {name: "Alice", age: 30};
obj.age = 31;
obj.name = "Bob";
System.out.console(obj.name);
System.out.console(obj.age);
`;

try {
  const lexer = new Lexer(code2);
  const tokens = lexer.tokenize();
  const parser = new Parser(tokens);
  const ast = parser.parse();
  const interpreter = new Interpreter();
  const result = interpreter.interpret(ast);
  const expected = 'Bob\n31';
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

// Test 3: Object property mutation (bracket notation)
console.log('\nTest 3: Object property mutation (bracket notation)');
const code3 = `
mut obj = {x: 10, y: 20};
obj["x"] = 100;
const key = "y";
obj[key] = 200;
System.out.console(obj.x);
System.out.console(obj.y);
`;

try {
  const lexer = new Lexer(code3);
  const tokens = lexer.tokenize();
  const parser = new Parser(tokens);
  const ast = parser.parse();
  const interpreter = new Interpreter();
  const result = interpreter.interpret(ast);
  const expected = '100\n200';
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

// Test 4: Nested array mutation
console.log('\nTest 4: Nested array mutation');
const code4 = `
mut matrix = [[1, 2], [3, 4]];
matrix[0][0] = 99;
matrix[1][1] = 88;
System.out.console(matrix[0][0]);
System.out.console(matrix[0][1]);
System.out.console(matrix[1][0]);
System.out.console(matrix[1][1]);
`;

try {
  const lexer = new Lexer(code4);
  const tokens = lexer.tokenize();
  const parser = new Parser(tokens);
  const ast = parser.parse();
  const interpreter = new Interpreter();
  const result = interpreter.interpret(ast);
  const expected = '99\n2\n3\n88';
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

// Test 5: Mutation in procedures
console.log('\nTest 5: Mutation in procedures');
const code5 = `
procedure increment(arr, index) {
  arr[index] = arr[index] + 1;
  returns arr[index];
}

mut nums = [5, 10, 15];
System.out.console(increment(nums, 0));
System.out.console(increment(nums, 1));
System.out.console(nums[0]);
System.out.console(nums[1]);
`;

try {
  const lexer = new Lexer(code5);
  const tokens = lexer.tokenize();
  const parser = new Parser(tokens);
  const ast = parser.parse();
  const interpreter = new Interpreter();
  const result = interpreter.interpret(ast);
  const expected = '6\n11\n6\n11';
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

console.log('\n✅ All property mutation tests completed!');
