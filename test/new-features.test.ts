import { Lexer } from './src/lexer';
import { Parser } from './src/parser';
import { Interpreter } from './src/interpreter';

function runTest(name: string, code: string, expectError: boolean = false): void {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`TEST: ${name}`);
  console.log(`${'='.repeat(60)}`);
  console.log(`Code:\n${code}`);
  console.log('-'.repeat(60));

  try {
    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();
    const interpreter = new Interpreter();
    const result = interpreter.interpret(ast);

    if (expectError) {
      console.log(`❌ FAILED: Expected error but got result: ${result}`);
    } else {
      console.log(`✅ PASSED\nOutput:\n${result || '(No output)'}`);
    }
  } catch (err) {
    if (expectError) {
      console.log(`✅ PASSED (Expected error)\nError: ${err instanceof Error ? err.message : String(err)}`);
    } else {
      console.log(`❌ FAILED\nError: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
}

// Test 1: Object literals
runTest('Object Literal Creation', `
const obj = {name: "Alice", age: 30};
System.out.console(obj.name);
System.out.console(obj.age);
`);

// Test 2: Nested objects
runTest('Nested Objects', `
const person = {
  name: "Bob",
  address: {
    city: "NYC",
    zip: 10001
  }
};
System.out.console(person.name);
System.out.console(person.address.city);
`);

// Test 3: Arrow operator with string
runTest('Arrow Operator with String', `
const obj = {name: "Charlie", age: 25};
System.out.console(obj->"name");
System.out.console(obj->"age");
`);

// Test 4: Arrow operator with variable (dynamic)
runTest('Arrow Operator Dynamic Access', `
const obj = {x: 10, y: 20};
const key = "x";
System.out.console(obj->key);
`);

// Test 5: null and nullptr
runTest('Null and Nullptr', `
const a = null;
const b = nullptr;
System.out.console(a == b);
System.out.console(a == null);
`);

// Test 6: NaN
runTest('NaN Support', `
const x = NaN;
System.out.console(x == NaN);
`);

// Test 7: null comparison with ==
runTest('Null Equality Comparison', `
const x = null;
const y = 5;
System.out.console(x == null);
System.out.console(y == null);
`);

// Test 8: null comparison with < (should error)
runTest('Null with < Operator (Error Expected)', `
const x = null;
const y = 5;
System.out.console(x < y);
`, true);

// Test 9: null comparison with > (should error)
runTest('Null with > Operator (Error Expected)', `
const x = 5;
const y = null;
System.out.console(x > y);
`, true);

// Test 10: Truthiness - 0 is falsy
runTest('Truthiness: 0 is falsy', `
incase (0 == 0) {
  System.out.console("0 == 0 is true");
}
`);

// Test 11: Truthiness - 1 is truthy (but incase needs boolean)
runTest('Incase with non-boolean (Error Expected)', `
incase (1) {
  System.out.console("This should not print");
}
`, true);

// Test 12: Empty string is truthy (but can't use in incase)
runTest('Incase Strict Boolean Check', `
const x = "";
incase (x == "") {
  System.out.console("Empty string comparison works");
}
`);

// Test 13: Array-boolean comparison (should error)
runTest('Array-Boolean Comparison (Error Expected)', `
const arr = [1, 2, 3];
const result = arr && true;
System.out.console(result);
`, true);

// Test 14: incase only accepts boolean
runTest('Incase with Number (Error Expected)', `
const x = 5;
incase (x) {
  System.out.console("Should not work");
}
`, true);

// Test 15: incase with boolean expression
runTest('Incase with Boolean Expression', `
const x = 5;
incase (x > 3) {
  System.out.console("5 is greater than 3");
}
`);

// Test 16: Object with procedures
runTest('Object with Procedures', `
procedure greet(name) {
  returns "Hello, " + name;
}

const obj = {
  greetFunc: greet,
  name: "World"
};

System.out.console(obj.greetFunc(obj.name));
`);

// Test 17: Complex object manipulation
runTest('Complex Object Manipulation', `
const data = {
  numbers: [1, 2, 3],
  config: {
    enabled: true,
    count: 10
  }
};

System.out.console(data.numbers);
System.out.console(data.config.enabled);
System.out.console(data.config.count);
`);

// Test 18: null in expressions
runTest('Null in Expressions', `
const x = null;
const y = null;
System.out.console(x == y);
System.out.console(x != y);
`);

// Test 19: NaN in comparisons
runTest('NaN Comparisons', `
const a = NaN;
const b = NaN;
System.out.console(a == b);
System.out.console(a != b);
`);

// Test 20: Mixed object and array
runTest('Mixed Object and Array', `
const mixed = {
  items: [10, 20, 30],
  metadata: {
    count: 3,
    type: "numbers"
  }
};

drift (const item through mixed.items) {
  System.out.console("Item: " + item);
}
System.out.console("Type: " + mixed.metadata.type);
`);

console.log(`\n${'='.repeat(60)}`);
console.log('ALL TESTS COMPLETED');
console.log(`${'='.repeat(60)}\n`);
