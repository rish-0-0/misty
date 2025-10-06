import { expect } from "chai";
import { Lexer, TokenType } from "../src/lexer";

describe("Lexer", () => {
  it("tokenizes a simple constant declaration", () => {
    const source = "const x = 5;";
    const lexer = new Lexer(source);
    const tokens = lexer.tokenize();

    expect(tokens.length).to.equal(6); // Including EOF token
    expect(tokens[0].type).to.equal(TokenType.CONST);
    expect(tokens[1].type).to.equal(TokenType.IDENTIFIER);
    expect(tokens[1].value).to.equal("x");
    expect(tokens[2].type).to.equal(TokenType.EQUALS);
    expect(tokens[3].type).to.equal(TokenType.NUMBER);
    expect(tokens[3].value).to.equal("5");
    expect(tokens[4].type).to.equal(TokenType.SEMICOLON);
    expect(tokens[5].type).to.equal(TokenType.EOF);
  });

  it("tokenizes a mutable variable declaration", () => {
    const source = "mut z = 10;";
    const lexer = new Lexer(source);
    const tokens = lexer.tokenize();

    expect(tokens[0].type).to.equal(TokenType.MUT);
    expect(tokens[1].value).to.equal("z");
    expect(tokens[3].value).to.equal("10");
  });

  it("tokenizes a procedure definition", () => {
    const source = "procedure multiply(a, b) { returns a * b; }";
    const lexer = new Lexer(source);
    const tokens = lexer.tokenize();

    expect(tokens[0].type).to.equal(TokenType.PROCEDURE);
    expect(tokens[1].value).to.equal("multiply");
    expect(tokens[2].type).to.equal(TokenType.LPAREN);
    expect(tokens[3].value).to.equal("a");
    expect(tokens[4].type).to.equal(TokenType.COMMA);
    expect(tokens[5].value).to.equal("b");
    expect(tokens[6].type).to.equal(TokenType.RPAREN);
  });

  it("tokenizes strings", () => {
    const source = 'const msg = "Hello, World!";';
    const lexer = new Lexer(source);
    const tokens = lexer.tokenize();

    expect(tokens[3].type).to.equal(TokenType.STRING);
    expect(tokens[3].value).to.equal("Hello, World!");
  });

  it("tokenizes strings with escape sequences", () => {
    const source = 'const msg = "Line 1\\nLine 2\\tTabbed";';
    const lexer = new Lexer(source);
    const tokens = lexer.tokenize();

    expect(tokens[3].type).to.equal(TokenType.STRING);
    expect(tokens[3].value).to.equal("Line 1\nLine 2\tTabbed");
  });

  it("tokenizes decimal numbers", () => {
    const source = "const pi = 3.14;";
    const lexer = new Lexer(source);
    const tokens = lexer.tokenize();

    expect(tokens[3].type).to.equal(TokenType.NUMBER);
    expect(tokens[3].value).to.equal("3.14");
  });

  it("tokenizes string concatenation", () => {
    const source = '"Hello" + " " + "World"';
    const lexer = new Lexer(source);
    const tokens = lexer.tokenize();

    expect(tokens[0].type).to.equal(TokenType.STRING);
    expect(tokens[1].type).to.equal(TokenType.PLUS);
    expect(tokens[2].type).to.equal(TokenType.STRING);
    expect(tokens[3].type).to.equal(TokenType.PLUS);
    expect(tokens[4].type).to.equal(TokenType.STRING);
  });

  it("tokenizes member access", () => {
    const source = "System.out.console";
    const lexer = new Lexer(source);
    const tokens = lexer.tokenize();

    expect(tokens[0].value).to.equal("System");
    expect(tokens[1].type).to.equal(TokenType.DOT);
    expect(tokens[2].value).to.equal("out");
    expect(tokens[3].type).to.equal(TokenType.DOT);
    expect(tokens[4].value).to.equal("console");
  });

  it("skips comments", () => {
    const source = "const x = 5; # this is a comment\nconst y = 10;";
    const lexer = new Lexer(source);
    const tokens = lexer.tokenize();

    // Should not include comment in tokens
    const values = tokens.map(t => t.value);
    expect(values).to.not.include("#");
    expect(tokens.filter(t => t.value === "const").length).to.equal(2);
  });

  it("handles arithmetic operators", () => {
    const source = "a + b - c * d / e;";
    const lexer = new Lexer(source);
    const tokens = lexer.tokenize();

    expect(tokens[1].type).to.equal(TokenType.PLUS);
    expect(tokens[3].type).to.equal(TokenType.MINUS);
    expect(tokens[5].type).to.equal(TokenType.STAR);
    expect(tokens[7].type).to.equal(TokenType.SLASH);
  });
});
