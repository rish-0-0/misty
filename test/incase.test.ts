import { expect } from "chai";
import { Lexer } from "../src/lexer";
import { Parser } from "../src/parser";
import { Interpreter } from "../src/interpreter";

describe("Incase Statement", () => {
  function run(source: string): string {
    const lexer = new Lexer(source);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();
    const interpreter = new Interpreter();
    return interpreter.interpret(ast);
  }

  it("executes block when condition is true", () => {
    const source = `
      const x = 5;
      incase (x < 10) {
        System.out.console("x is less than 10");
      }
    `;
    const result = run(source);
    expect(result).to.equal("x is less than 10");
  });

  it("skips block when condition is false", () => {
    const source = `
      const x = 15;
      incase (x < 10) {
        System.out.console("x is less than 10");
      }
      System.out.console("done");
    `;
    const result = run(source);
    expect(result).to.equal("done");
  });

  it("handles complex conditions with NOT", () => {
    const source = `
      const x = 15;
      incase (!(x < 10)) {
        System.out.console("x is not less than 10");
      }
    `;
    const result = run(source);
    expect(result).to.equal("x is not less than 10");
  });

  it("handles complex conditions with OR", () => {
    const source = `
      const x = 7;
      incase (!(x < 5) || !(x > 10)) {
        System.out.console("complex condition met");
      }
    `;
    const result = run(source);
    expect(result).to.equal("complex condition met");
  });

  it("handles multiple incase statements", () => {
    const source = `
      const x = 5;
      incase (x < 10) {
        System.out.console("first");
      }
      incase (x > 0) {
        System.out.console("second");
      }
    `;
    const result = run(source);
    expect(result).to.equal("first\nsecond");
  });

  it("handles nested incase statements", () => {
    const source = `
      const x = 5;
      incase (x > 0) {
        incase (x < 10) {
          System.out.console("nested condition");
        }
      }
    `;
    const result = run(source);
    expect(result).to.equal("nested condition");
  });
});
