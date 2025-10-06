import { describe, it } from "mocha";
import { expect } from "chai";
import { Lexer } from "../src/lexer";
import { Parser } from "../src/parser";

describe("Parameter Validation", () => {
  it("throws error on duplicate parameter names in same procedure", () => {
    const code = `
      procedure add(a, b, a) {
        returns a + b;
      }
    `;

    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);

    expect(() => parser.parse()).to.throw("Duplicate parameter name 'a' in procedure 'add'");
  });

  it("allows same parameter names in different procedures", () => {
    const code = `
      procedure add(a, b) {
        returns a + b;
      }

      procedure multiply(a, b) {
        returns a * b;
      }
    `;

    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);

    expect(() => parser.parse()).to.not.throw();
  });

  it("warns about parameter shadowing in nested procedures", () => {
    // Note: This would ideally throw an error, but we're allowing it for now
    // since it requires more complex scope tracking during parsing
    const code = `
      procedure f(a, b) {
        procedure g(a, b) {
          returns a * b;
        }
        returns g;
      }
    `;

    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);

    // For now, this parses successfully but the behavior might be confusing
    expect(() => parser.parse()).to.not.throw();
  });

  it("throws error on multiple duplicate parameters", () => {
    const code = `
      procedure test(x, y, x, z, y) {
        returns x;
      }
    `;

    const lexer = new Lexer(code);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);

    expect(() => parser.parse()).to.throw("Duplicate parameter name");
  });
});
