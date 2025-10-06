import { Lexer } from './src/lexer';
import { Parser } from './src/parser';
import { Interpreter } from './src/interpreter';

const defaultCode = `# Misty - Full Feature Demo

# Variables & Procedures
const x = 5;
mut a = 4;

procedure multiply(a, b) {
  returns a * b;
}

# Objects (JSON-like syntax)
const person = {
  name: "Alice",
  age: 30,
  city: "NYC"
};

System.out.console("Name: " + person.name);
System.out.console("Age: " + person.age);

# Dynamic property access with arrow operator
const key = "city";
System.out.console("City: " + person->key);

# Null and NaN
const nullable = null;
const notANumber = NaN;

incase (nullable == null) {
  System.out.console("nullable is null");
}

# Assignment & Conditionals
a = multiply(x, a);
System.out.console("Result: " + a);

incase (a > 10) {
  System.out.console("a is greater than 10");
}

# Drift Loop (Traditional)
mut sum = 0;
drift (mut i = 0; i < 5; i = i + 1) {
  sum = sum + i;
}
System.out.console("Sum 0-4: " + sum);

# Arrays & Drift-Through Loop
const arr = [10, 20, 30];
drift (const num through arr) {
  System.out.console("Number: " + num);
}`;

console.log('Testing default UI code...\n');

try {
  const lexer = new Lexer(defaultCode);
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
