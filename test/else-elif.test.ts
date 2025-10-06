import { Lexer } from '../src/lexer';
import { Parser } from '../src/parser';
import { Interpreter } from '../src/interpreter';

console.log('Testing else/elif conditionals...\n');

// Test 1: Simple else
console.log('Test 1: Simple else');
const code1 = `
const x = 5;
incase (x > 10) {
  System.out.console("x is greater than 10");
} else {
  System.out.console("x is not greater than 10");
}
`;

try {
  const lexer = new Lexer(code1);
  const tokens = lexer.tokenize();
  const parser = new Parser(tokens);
  const ast = parser.parse();
  const interpreter = new Interpreter();
  const result = interpreter.interpret(ast);
  const expected = 'x is not greater than 10';
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

// Test 2: Single elif
console.log('\nTest 2: Single elif');
const code2 = `
const x = 7;
incase (x > 10) {
  System.out.console("x is greater than 10");
} elif (x > 5) {
  System.out.console("x is greater than 5 but not 10");
} else {
  System.out.console("x is 5 or less");
}
`;

try {
  const lexer = new Lexer(code2);
  const tokens = lexer.tokenize();
  const parser = new Parser(tokens);
  const ast = parser.parse();
  const interpreter = new Interpreter();
  const result = interpreter.interpret(ast);
  const expected = 'x is greater than 5 but not 10';
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

// Test 3: Multiple elif
console.log('\nTest 3: Multiple elif');
const code3 = `
const score = 75;
incase (score >= 90) {
  System.out.console("A");
} elif (score >= 80) {
  System.out.console("B");
} elif (score >= 70) {
  System.out.console("C");
} elif (score >= 60) {
  System.out.console("D");
} else {
  System.out.console("F");
}
`;

try {
  const lexer = new Lexer(code3);
  const tokens = lexer.tokenize();
  const parser = new Parser(tokens);
  const ast = parser.parse();
  const interpreter = new Interpreter();
  const result = interpreter.interpret(ast);
  const expected = 'C';
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

// Test 4: Elif without else
console.log('\nTest 4: Elif without else');
const code4 = `
const x = 8;
incase (x == 5) {
  System.out.console("x is 5");
} elif (x == 8) {
  System.out.console("x is 8");
}
`;

try {
  const lexer = new Lexer(code4);
  const tokens = lexer.tokenize();
  const parser = new Parser(tokens);
  const ast = parser.parse();
  const interpreter = new Interpreter();
  const result = interpreter.interpret(ast);
  const expected = 'x is 8';
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

// Test 5: First condition matches (skip elif/else)
console.log('\nTest 5: First condition matches');
const code5 = `
const x = 15;
incase (x > 10) {
  System.out.console("First");
} elif (x > 5) {
  System.out.console("Second");
} else {
  System.out.console("Third");
}
`;

try {
  const lexer = new Lexer(code5);
  const tokens = lexer.tokenize();
  const parser = new Parser(tokens);
  const ast = parser.parse();
  const interpreter = new Interpreter();
  const result = interpreter.interpret(ast);
  const expected = 'First';
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

// Test 6: Nested incase with elif/else
console.log('\nTest 6: Nested conditionals');
const code6 = `
const x = 10;
const y = 20;
incase (x > 5) {
  incase (y > 15) {
    System.out.console("Both conditions met");
  } else {
    System.out.console("Only first met");
  }
} else {
  System.out.console("First not met");
}
`;

try {
  const lexer = new Lexer(code6);
  const tokens = lexer.tokenize();
  const parser = new Parser(tokens);
  const ast = parser.parse();
  const interpreter = new Interpreter();
  const result = interpreter.interpret(ast);
  const expected = 'Both conditions met';
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

console.log('\n✅ All else/elif tests completed!');
