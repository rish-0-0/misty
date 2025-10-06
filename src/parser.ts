import { Token, TokenType } from "./lexer";
import type {
  ASTNode,
  ProgramNode,
  VariableDeclarationNode,
  AssignmentExpressionNode,
  MemberAssignmentNode,
  ProcedureDeclarationNode,
  ReturnStatementNode,
  IncaseStatementNode,
  DriftLoopNode,
  DriftThroughLoopNode,
} from "./ast";

export class Parser {
  private tokens: Token[];
  private current: number = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  parse(): ProgramNode {
    const body: ASTNode[] = [];

    while (!this.isAtEnd()) {
      const statement = this.parseStatement();
      if (statement) {
        body.push(statement);
      }
    }

    return {
      type: "Program",
      body,
    };
  }

  private parseStatement(): ASTNode | null {
    if (this.check(TokenType.CONST) || this.check(TokenType.MUT)) {
      return this.parseVariableDeclaration();
    }

    if (this.check(TokenType.PROCEDURE)) {
      return this.parseProcedureDeclaration();
    }

    if (this.check(TokenType.RETURNS)) {
      return this.parseReturnStatement();
    }

    if (this.check(TokenType.BREAK)) {
      return this.parseBreakStatement();
    }

    if (this.check(TokenType.CONTINUE)) {
      return this.parseContinueStatement();
    }

    if (this.check(TokenType.INCASE)) {
      return this.parseIncaseStatement();
    }

    if (this.check(TokenType.DRIFT)) {
      return this.parseDriftLoop();
    }

    // Check for assignment (simple identifier or member access followed by =)
    if (this.check(TokenType.IDENTIFIER)) {
      const startPos = this.current;
      const expr = this.parseExpression();

      // Check if this is an assignment
      if (this.check(TokenType.EQUALS)) {
        this.advance(); // consume =
        const value = this.parseExpression();
        this.consume(TokenType.SEMICOLON, "Expected ';' after assignment");

        // Determine assignment type based on expression
        if (expr.type === "Identifier") {
          // Simple variable assignment
          return {
            type: "AssignmentExpression",
            identifier: expr.name,
            value,
          };
        } else if (expr.type === "MemberExpression") {
          // obj.prop = value
          return {
            type: "MemberAssignment",
            object: expr.object,
            property: expr.property,
            isComputed: false,
            value,
          };
        } else if (expr.type === "ComputedMemberExpression") {
          // obj[key] = value or arr[index] = value
          return {
            type: "MemberAssignment",
            object: expr.object,
            property: expr.property,
            isComputed: true,
            value,
          };
        } else {
          throw new Error(`Invalid assignment target at line ${this.peek().line}`);
        }
      }

      // Not an assignment, reset and treat as expression
      this.current = startPos;
    }

    // Expression statement
    const expr = this.parseExpression();
    this.consume(TokenType.SEMICOLON, "Expected ';' after expression");
    return expr;
  }

  private parseVariableDeclaration(): VariableDeclarationNode {
    const isConstant = this.advance().type === TokenType.CONST;
    const identifier = this.consume(TokenType.IDENTIFIER, "Expected variable name").value;
    this.consume(TokenType.EQUALS, "Expected '=' after variable name");
    const value = this.parseExpression();
    this.consume(TokenType.SEMICOLON, "Expected ';' after variable declaration");

    return {
      type: "VariableDeclaration",
      isConstant,
      identifier,
      value,
    };
  }


  private parseProcedureDeclaration(): ProcedureDeclarationNode {
    this.consume(TokenType.PROCEDURE, "Expected 'procedure' keyword");
    const name = this.consume(TokenType.IDENTIFIER, "Expected procedure name").value;

    this.consume(TokenType.LPAREN, "Expected '(' after procedure name");
    const parameters: string[] = [];

    if (!this.check(TokenType.RPAREN)) {
      do {
        const param = this.consume(TokenType.IDENTIFIER, "Expected parameter name");
        if (parameters.includes(param.value)) {
          throw new Error(`Duplicate parameter name '${param.value}' in procedure '${name}' at line ${param.line}`);
        }
        parameters.push(param.value);
      } while (this.match(TokenType.COMMA));
    }

    this.consume(TokenType.RPAREN, "Expected ')' after parameters");
    this.consume(TokenType.LBRACE, "Expected '{' before procedure body");

    const body: ASTNode[] = [];
    while (!this.check(TokenType.RBRACE) && !this.isAtEnd()) {
      const statement = this.parseStatement();
      if (statement) {
        body.push(statement);
      }
    }

    this.consume(TokenType.RBRACE, "Expected '}' after procedure body");

    return {
      type: "ProcedureDeclaration",
      name,
      parameters,
      body,
    };
  }

  private parseReturnStatement(): ReturnStatementNode {
    this.consume(TokenType.RETURNS, "Expected 'returns' keyword");
    const value = this.parseExpression();
    this.consume(TokenType.SEMICOLON, "Expected ';' after return statement");

    return {
      type: "ReturnStatement",
      value,
    };
  }

  private parseBreakStatement(): { type: "BreakStatement" } {
    this.consume(TokenType.BREAK, "Expected 'break' keyword");
    this.consume(TokenType.SEMICOLON, "Expected ';' after break statement");

    return {
      type: "BreakStatement",
    };
  }

  private parseContinueStatement(): { type: "ContinueStatement" } {
    this.consume(TokenType.CONTINUE, "Expected 'continue' keyword");
    this.consume(TokenType.SEMICOLON, "Expected ';' after continue statement");

    return {
      type: "ContinueStatement",
    };
  }

  private parseIncaseStatement(): IncaseStatementNode {
    this.consume(TokenType.INCASE, "Expected 'incase' keyword");
    this.consume(TokenType.LPAREN, "Expected '(' after 'incase'");
    const condition = this.parseExpression();
    this.consume(TokenType.RPAREN, "Expected ')' after condition");
    this.consume(TokenType.LBRACE, "Expected '{' before incase body");

    const body: ASTNode[] = [];
    while (!this.check(TokenType.RBRACE) && !this.isAtEnd()) {
      const statement = this.parseStatement();
      if (statement) {
        body.push(statement);
      }
    }

    this.consume(TokenType.RBRACE, "Expected '}' after incase body");

    // Parse elif branches
    const elifBranches: { condition: ASTNode; body: ASTNode[] }[] = [];
    while (this.check(TokenType.ELIF)) {
      this.advance(); // consume 'elif'
      this.consume(TokenType.LPAREN, "Expected '(' after 'elif'");
      const elifCondition = this.parseExpression();
      this.consume(TokenType.RPAREN, "Expected ')' after elif condition");
      this.consume(TokenType.LBRACE, "Expected '{' before elif body");

      const elifBody: ASTNode[] = [];
      while (!this.check(TokenType.RBRACE) && !this.isAtEnd()) {
        const statement = this.parseStatement();
        if (statement) {
          elifBody.push(statement);
        }
      }

      this.consume(TokenType.RBRACE, "Expected '}' after elif body");
      elifBranches.push({ condition: elifCondition, body: elifBody });
    }

    // Parse else branch
    let elseBranch: ASTNode[] | undefined;
    if (this.check(TokenType.ELSE)) {
      this.advance(); // consume 'else'
      this.consume(TokenType.LBRACE, "Expected '{' before else body");

      elseBranch = [];
      while (!this.check(TokenType.RBRACE) && !this.isAtEnd()) {
        const statement = this.parseStatement();
        if (statement) {
          elseBranch.push(statement);
        }
      }

      this.consume(TokenType.RBRACE, "Expected '}' after else body");
    }

    return {
      type: "IncaseStatement",
      condition,
      body,
      elifBranches: elifBranches.length > 0 ? elifBranches : undefined,
      elseBranch,
    };
  }

  private parseDriftLoop(): DriftLoopNode | DriftThroughLoopNode {
    this.consume(TokenType.DRIFT, "Expected 'drift' keyword");
    this.consume(TokenType.LPAREN, "Expected '(' after 'drift'");

    // Check if it's a drift-through loop by looking ahead
    const startPos = this.current;
    const isConstOrMut = this.check(TokenType.CONST) || this.check(TokenType.MUT);

    if (isConstOrMut) {
      const constOrMut = this.advance();
      const isConstant = constOrMut.type === TokenType.CONST;

      if (this.check(TokenType.IDENTIFIER)) {
        const varName = this.advance().value;

        if (this.check(TokenType.THROUGH)) {
          // This is a drift-through loop
          this.consume(TokenType.THROUGH, "Expected 'through'");
          const iterable = this.parseExpression();
          this.consume(TokenType.RPAREN, "Expected ')' after iterable");
          this.consume(TokenType.LBRACE, "Expected '{' before loop body");

          const body: ASTNode[] = [];
          while (!this.check(TokenType.RBRACE) && !this.isAtEnd()) {
            const statement = this.parseStatement();
            if (statement) {
              body.push(statement);
            }
          }

          this.consume(TokenType.RBRACE, "Expected '}' after loop body");

          return {
            type: "DriftThroughLoop",
            isConstant,
            variable: varName,
            iterable,
            body,
          };
        } else {
          // Reset and parse as traditional drift loop
          this.current = startPos;
        }
      } else {
        this.current = startPos;
      }
    }

    // Traditional drift loop: drift (mut i = 0; i < 10; i = i + 1)
    // Parse without semicolon for loop header
    this.current = startPos;
    const isConstant = this.advance().type === TokenType.CONST;
    const identifier = this.consume(TokenType.IDENTIFIER, "Expected variable name").value;
    this.consume(TokenType.EQUALS, "Expected '=' after variable name");
    const initValue = this.parseExpression();

    const initNode: VariableDeclarationNode = {
      type: "VariableDeclaration",
      isConstant,
      identifier,
      value: initValue,
    };

    this.consume(TokenType.SEMICOLON, "Expected ';' after loop initialization");

    const condition = this.parseExpression();
    this.consume(TokenType.SEMICOLON, "Expected ';' after loop condition");

    // Parse update (assignment without semicolon)
    const updateIdent = this.consume(TokenType.IDENTIFIER, "Expected variable name in update").value;
    this.consume(TokenType.EQUALS, "Expected '=' in update");
    const updateValue = this.parseExpression();

    const updateNode: AssignmentExpressionNode = {
      type: "AssignmentExpression",
      identifier: updateIdent,
      value: updateValue,
    };

    this.consume(TokenType.RPAREN, "Expected ')' after loop header");
    this.consume(TokenType.LBRACE, "Expected '{' before loop body");

    const body: ASTNode[] = [];
    while (!this.check(TokenType.RBRACE) && !this.isAtEnd()) {
      const statement = this.parseStatement();
      if (statement) {
        body.push(statement);
      }
    }

    this.consume(TokenType.RBRACE, "Expected '}' after loop body");

    return {
      type: "DriftLoop",
      init: initNode,
      condition,
      update: updateNode,
      body,
    };
  }

  private parseExpression(): ASTNode {
    return this.parseLogicalOr();
  }

  private parseLogicalOr(): ASTNode {
    let left = this.parseLogicalAnd();

    while (this.match(TokenType.OR)) {
      const operator = "||" as const;
      const right = this.parseLogicalAnd();
      left = {
        type: "BinaryExpression",
        operator,
        left,
        right,
      };
    }

    return left;
  }

  private parseLogicalAnd(): ASTNode {
    let left = this.parseBitwiseOr();

    while (this.match(TokenType.AND)) {
      const operator = "&&" as const;
      const right = this.parseBitwiseOr();
      left = {
        type: "BinaryExpression",
        operator,
        left,
        right,
      };
    }

    return left;
  }

  private parseBitwiseOr(): ASTNode {
    let left = this.parseBitwiseAnd();

    while (this.match(TokenType.PIPE)) {
      const operator = "|" as const;
      const right = this.parseBitwiseAnd();
      left = {
        type: "BinaryExpression",
        operator,
        left,
        right,
      };
    }

    return left;
  }

  private parseBitwiseAnd(): ASTNode {
    let left = this.parseEquality();

    while (this.match(TokenType.AMPERSAND)) {
      const operator = "&" as const;
      const right = this.parseEquality();
      left = {
        type: "BinaryExpression",
        operator,
        left,
        right,
      };
    }

    return left;
  }

  private parseEquality(): ASTNode {
    let left = this.parseComparison();

    while (this.match(TokenType.EQUAL_EQUAL, TokenType.NOT_EQUAL)) {
      const operator = this.previous().value as "==" | "!=";
      const right = this.parseComparison();
      left = {
        type: "BinaryExpression",
        operator,
        left,
        right,
      };
    }

    return left;
  }

  private parseComparison(): ASTNode {
    let left = this.parseAdditive();

    while (this.match(TokenType.LESS_THAN, TokenType.GREATER_THAN, TokenType.LESS_EQUAL, TokenType.GREATER_EQUAL)) {
      const operator = this.previous().value as "<" | ">" | "<=" | ">=";
      const right = this.parseAdditive();
      left = {
        type: "BinaryExpression",
        operator,
        left,
        right,
      };
    }

    return left;
  }

  private parseAdditive(): ASTNode {
    let left = this.parseMultiplicative();

    while (this.match(TokenType.PLUS, TokenType.MINUS)) {
      const operator = this.previous().value as "+" | "-";
      const right = this.parseMultiplicative();
      left = {
        type: "BinaryExpression",
        operator,
        left,
        right,
      };
    }

    return left;
  }

  private parseMultiplicative(): ASTNode {
    let left = this.parseUnary();

    while (this.match(TokenType.STAR, TokenType.SLASH)) {
      const operator = this.previous().value as "*" | "/";
      const right = this.parseUnary();
      left = {
        type: "BinaryExpression",
        operator,
        left,
        right,
      };
    }

    return left;
  }

  private parseUnary(): ASTNode {
    if (this.match(TokenType.NOT, TokenType.MINUS)) {
      const operator = this.previous().value as "!" | "-";
      const argument = this.parseUnary();
      return {
        type: "UnaryExpression",
        operator,
        argument,
      };
    }

    return this.parseCall();
  }

  private parseCall(): ASTNode {
    let expr = this.parseMember();

    while (this.match(TokenType.LPAREN)) {
      const args: ASTNode[] = [];

      if (!this.check(TokenType.RPAREN)) {
        do {
          args.push(this.parseExpression());
        } while (this.match(TokenType.COMMA));
      }

      this.consume(TokenType.RPAREN, "Expected ')' after arguments");

      expr = {
        type: "CallExpression",
        callee: expr,
        arguments: args,
      };
    }

    return expr;
  }

  private parseMember(): ASTNode {
    let expr = this.parsePrimary();

    while (true) {
      if (this.match(TokenType.DOT)) {
        const property = this.consume(TokenType.IDENTIFIER, "Expected property name after '.'").value;
        expr = {
          type: "MemberExpression",
          object: expr,
          property,
        };
      } else if (this.match(TokenType.ARROW)) {
        // obj->key or obj->"string key"
        const property = this.parseExpression();
        expr = {
          type: "ComputedMemberExpression",
          object: expr,
          property,
        };
      } else if (this.match(TokenType.LBRACKET)) {
        // arr[index] - array/object indexing
        const property = this.parseExpression();
        this.consume(TokenType.RBRACKET, "Expected ']' after index");
        expr = {
          type: "ComputedMemberExpression",
          object: expr,
          property,
        };
      } else {
        break;
      }
    }

    return expr;
  }

  private parsePrimary(): ASTNode {
    if (this.match(TokenType.NUMBER)) {
      return {
        type: "NumberLiteral",
        value: parseFloat(this.previous().value),
      };
    }

    if (this.match(TokenType.STRING)) {
      return {
        type: "StringLiteral",
        value: this.previous().value,
      };
    }

    if (this.match(TokenType.TRUE)) {
      return {
        type: "BooleanLiteral",
        value: true,
      };
    }

    if (this.match(TokenType.FALSE)) {
      return {
        type: "BooleanLiteral",
        value: false,
      };
    }

    if (this.match(TokenType.NULL, TokenType.NULLPTR)) {
      return {
        type: "NullLiteral",
      };
    }

    if (this.match(TokenType.NAN)) {
      return {
        type: "NaNLiteral",
      };
    }

    if (this.match(TokenType.IDENTIFIER)) {
      return {
        type: "Identifier",
        name: this.previous().value,
      };
    }

    if (this.match(TokenType.LBRACKET)) {
      const elements: ASTNode[] = [];

      if (!this.check(TokenType.RBRACKET)) {
        do {
          elements.push(this.parseExpression());
        } while (this.match(TokenType.COMMA));
      }

      this.consume(TokenType.RBRACKET, "Expected ']' after array elements");

      return {
        type: "ArrayLiteral",
        elements,
      };
    }

    if (this.match(TokenType.LBRACE)) {
      const properties: { key: string; value: ASTNode }[] = [];

      if (!this.check(TokenType.RBRACE)) {
        do {
          const key = this.consume(TokenType.IDENTIFIER, "Expected property key").value;
          this.consume(TokenType.COLON, "Expected ':' after property key");
          const value = this.parseExpression();
          properties.push({ key, value });
        } while (this.match(TokenType.COMMA));
      }

      this.consume(TokenType.RBRACE, "Expected '}' after object properties");

      return {
        type: "ObjectLiteral",
        properties,
      };
    }

    if (this.match(TokenType.LPAREN)) {
      const expr = this.parseExpression();
      this.consume(TokenType.RPAREN, "Expected ')' after expression");
      return expr;
    }

    throw new Error(`Unexpected token: ${this.peek().value} at line ${this.peek().line}`);
  }

  private match(...types: TokenType[]): boolean {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  private check(type: TokenType): boolean {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  private advance(): Token {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  private isAtEnd(): boolean {
    return this.peek().type === TokenType.EOF;
  }

  private peek(): Token {
    return this.tokens[this.current];
  }

  private peekNext(): Token | null {
    if (this.current + 1 < this.tokens.length) {
      return this.tokens[this.current + 1];
    }
    return null;
  }

  private previous(): Token {
    return this.tokens[this.current - 1];
  }

  private consume(type: TokenType, message: string): Token {
    if (this.check(type)) return this.advance();
    throw new Error(`${message} at line ${this.peek().line}, got ${this.peek().value}`);
  }
}
