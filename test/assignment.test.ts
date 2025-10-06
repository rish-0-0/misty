import { expect } from "chai";
import { Lexer } from "../src/lexer";
import { Parser } from "../src/parser";
import { Interpreter } from "../src/interpreter";

describe("Assignment Expressions", () => {
  function run(source: string): string {
    const lexer = new Lexer(source);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();
    const interpreter = new Interpreter();
    return interpreter.interpret(ast);
  }

  it("allows assignment to mutable variables", () => {
    const source = `
      mut x = 5;
      x = 10;
      System.out.console(x);
    `;
    const result = run(source);
    expect(result).to.equal("10");
  });

  it("allows assignment from function calls", () => {
    const source = `
      procedure sum(a, b) {
        returns a + b;
      }

      mut x = 0;
      x = sum(5, 3);
      System.out.console(x);
    `;
    const result = run(source);
    expect(result).to.equal("8");
  });

  it("throws error when assigning to const", () => {
    const source = `
      const x = 5;
      x = 10;
    `;
    expect(() => run(source)).to.throw("Cannot assign to constant variable");
  });

  it("throws error when assigning to undefined variable", () => {
    const source = `
      y = 10;
    `;
    expect(() => run(source)).to.throw("Undefined variable");
  });

  it("allows multiple sequential assignments", () => {
    const source = `
      mut x = 5;
      mut y = 0;
      x = 10;
      y = 10;
      System.out.console(x);
      System.out.console(y);
    `;
    const result = run(source);
    expect(result).to.equal("10\n10");
  });
});
