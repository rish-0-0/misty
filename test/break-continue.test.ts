import { Lexer } from '../src/lexer';
import { Parser } from '../src/parser';
import { Interpreter } from '../src/interpreter';

console.log('Testing break/continue statements...\n');

// Test 1: Break in drift loop
console.log('Test 1: Break in drift loop');
const code1 = `
mut sum = 0;
drift (mut i = 0; i < 10; i = i + 1) {
  incase (i == 5) {
    break;
  }
  sum = sum + i;
}
System.out.console(sum);
`;

try {
  const lexer = new Lexer(code1);
  const tokens = lexer.tokenize();
  const parser = new Parser(tokens);
  const ast = parser.parse();
  const interpreter = new Interpreter();
  const result = interpreter.interpret(ast);
  const expected = '10'; // 0+1+2+3+4 = 10
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

// Test 2: Continue in drift loop
console.log('\nTest 2: Continue in drift loop');
const code2 = `
mut sum = 0;
drift (mut i = 0; i < 10; i = i + 1) {
  incase (i == 5) {
    continue;
  }
  sum = sum + i;
}
System.out.console(sum);
`;

try {
  const lexer = new Lexer(code2);
  const tokens = lexer.tokenize();
  const parser = new Parser(tokens);
  const ast = parser.parse();
  const interpreter = new Interpreter();
  const result = interpreter.interpret(ast);
  const expected = '40'; // 0+1+2+3+4+6+7+8+9 = 40
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

// Test 3: Break in drift-through loop
console.log('\nTest 3: Break in drift-through loop');
const code3 = `
const arr = [1, 2, 3, 4, 5, 6];
drift (const x through arr) {
  incase (x == 4) {
    break;
  }
  System.out.console(x);
}
`;

try {
  const lexer = new Lexer(code3);
  const tokens = lexer.tokenize();
  const parser = new Parser(tokens);
  const ast = parser.parse();
  const interpreter = new Interpreter();
  const result = interpreter.interpret(ast);
  const expected = '1\n2\n3';
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

// Test 4: Continue in drift-through loop
console.log('\nTest 4: Continue in drift-through loop');
const code4 = `
const arr = [1, 2, 3, 4, 5];
drift (const x through arr) {
  incase (x == 3) {
    continue;
  }
  System.out.console(x);
}
`;

try {
  const lexer = new Lexer(code4);
  const tokens = lexer.tokenize();
  const parser = new Parser(tokens);
  const ast = parser.parse();
  const interpreter = new Interpreter();
  const result = interpreter.interpret(ast);
  const expected = '1\n2\n4\n5';
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

// Test 5: Multiple breaks with conditions
console.log('\nTest 5: Multiple breaks with elif');
const code5 = `
drift (mut i = 0; i < 100; i = i + 1) {
  incase (i == 3) {
    System.out.console("Found 3");
    break;
  } elif (i == 10) {
    System.out.console("Would find 10");
    break;
  }
}
`;

try {
  const lexer = new Lexer(code5);
  const tokens = lexer.tokenize();
  const parser = new Parser(tokens);
  const ast = parser.parse();
  const interpreter = new Interpreter();
  const result = interpreter.interpret(ast);
  const expected = 'Found 3';
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

// Test 6: Nested loops with break
console.log('\nTest 6: Nested loops with break (only breaks inner)');
const code6 = `
mut count = 0;
drift (mut i = 0; i < 3; i = i + 1) {
  drift (mut j = 0; j < 5; j = j + 1) {
    incase (j == 2) {
      break;
    }
    count = count + 1;
  }
}
System.out.console(count);
`;

try {
  const lexer = new Lexer(code6);
  const tokens = lexer.tokenize();
  const parser = new Parser(tokens);
  const ast = parser.parse();
  const interpreter = new Interpreter();
  const result = interpreter.interpret(ast);
  const expected = '6'; // 3 outer iterations × 2 inner iterations
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

console.log('\n✅ All break/continue tests completed!');
