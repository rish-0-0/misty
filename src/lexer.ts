export enum TokenType {
  // Keywords
  CONST = "CONST",
  MUT = "MUT",
  PROCEDURE = "PROCEDURE",
  RETURNS = "RETURNS",
  INCASE = "INCASE",
  ELSE = "ELSE",
  ELIF = "ELIF",
  DRIFT = "DRIFT",
  THROUGH = "THROUGH",
  BREAK = "BREAK",
  CONTINUE = "CONTINUE",
  NULL = "NULL",
  NULLPTR = "NULLPTR",
  NAN = "NAN",

  // Literals
  NUMBER = "NUMBER",
  STRING = "STRING",
  IDENTIFIER = "IDENTIFIER",
  TRUE = "TRUE",
  FALSE = "FALSE",

  // Operators
  PLUS = "PLUS",
  MINUS = "MINUS",
  STAR = "STAR",
  SLASH = "SLASH",
  PIPE_GREATER = "PIPE_GREATER", // |>
  EQUALS = "EQUALS",

  // Comparison
  LESS_THAN = "LESS_THAN",
  GREATER_THAN = "GREATER_THAN",
  LESS_EQUAL = "LESS_EQUAL",
  GREATER_EQUAL = "GREATER_EQUAL",
  EQUAL_EQUAL = "EQUAL_EQUAL",
  NOT_EQUAL = "NOT_EQUAL",

  // Logical
  AND = "AND",
  OR = "OR",
  NOT = "NOT",

  // Bitwise
  AMPERSAND = "AMPERSAND",
  PIPE = "PIPE",

  // Delimiters
  SEMICOLON = "SEMICOLON",
  LPAREN = "LPAREN",
  RPAREN = "RPAREN",
  LBRACE = "LBRACE",
  RBRACE = "RBRACE",
  LBRACKET = "LBRACKET",
  RBRACKET = "RBRACKET",
  COMMA = "COMMA",
  DOT = "DOT",
  COLON = "COLON",
  ARROW = "ARROW",

  // Special
  EOF = "EOF",
}

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;
}

export class Lexer {
  private source: string;
  private position: number = 0;
  private line: number = 1;
  private column: number = 1;

  constructor(source: string) {
    this.source = source;
  }

  tokenize(): Token[] {
    const tokens: Token[] = [];

    while (this.position < this.source.length) {
      this.skipWhitespaceAndComments();

      if (this.position >= this.source.length) {
        break;
      }

      const token = this.nextToken();
      if (token) {
        tokens.push(token);
      }
    }

    tokens.push({
      type: TokenType.EOF,
      value: "",
      line: this.line,
      column: this.column,
    });

    return tokens;
  }

  private nextToken(): Token | null {
    const char = this.source[this.position];
    const startLine = this.line;
    const startColumn = this.column;

    // Strings
    if (char === '"') {
      return this.readString(startLine, startColumn);
    }

    // Numbers
    if (this.isDigit(char)) {
      return this.readNumber(startLine, startColumn);
    }

    // Identifiers and keywords
    if (this.isAlpha(char)) {
      return this.readIdentifierOrKeyword(startLine, startColumn);
    }

    // Two-character operators
    if (char === "-" && this.peek() === ">") {
      this.advance();
      this.advance();
      return { type: TokenType.ARROW, value: "->", line: startLine, column: startColumn };
    }

    if (char === "|") {
      if (this.peek() === ">") {
        this.advance();
        this.advance();
        return { type: TokenType.PIPE_GREATER, value: "|>", line: startLine, column: startColumn };
      } else if (this.peek() === "|") {
        this.advance();
        this.advance();
        return { type: TokenType.OR, value: "||", line: startLine, column: startColumn };
      } else {
        this.advance();
        return { type: TokenType.PIPE, value: "|", line: startLine, column: startColumn };
      }
    }

    if (char === "&" && this.peek() === "&") {
      this.advance();
      this.advance();
      return { type: TokenType.AND, value: "&&", line: startLine, column: startColumn };
    }

    if (char === "=") {
      if (this.peek() === "=") {
        this.advance();
        this.advance();
        return { type: TokenType.EQUAL_EQUAL, value: "==", line: startLine, column: startColumn };
      } else {
        this.advance();
        return { type: TokenType.EQUALS, value: "=", line: startLine, column: startColumn };
      }
    }

    if (char === "!") {
      if (this.peek() === "=") {
        this.advance();
        this.advance();
        return { type: TokenType.NOT_EQUAL, value: "!=", line: startLine, column: startColumn };
      } else {
        this.advance();
        return { type: TokenType.NOT, value: "!", line: startLine, column: startColumn };
      }
    }

    if (char === "<") {
      if (this.peek() === "=") {
        this.advance();
        this.advance();
        return { type: TokenType.LESS_EQUAL, value: "<=", line: startLine, column: startColumn };
      } else {
        this.advance();
        return { type: TokenType.LESS_THAN, value: "<", line: startLine, column: startColumn };
      }
    }

    if (char === ">") {
      if (this.peek() === "=") {
        this.advance();
        this.advance();
        return { type: TokenType.GREATER_EQUAL, value: ">=", line: startLine, column: startColumn };
      } else {
        this.advance();
        return { type: TokenType.GREATER_THAN, value: ">", line: startLine, column: startColumn };
      }
    }

    // Single-character tokens
    this.advance();
    switch (char) {
      case "+": return { type: TokenType.PLUS, value: "+", line: startLine, column: startColumn };
      case "-": return { type: TokenType.MINUS, value: "-", line: startLine, column: startColumn };
      case "*": return { type: TokenType.STAR, value: "*", line: startLine, column: startColumn };
      case "/": return { type: TokenType.SLASH, value: "/", line: startLine, column: startColumn };
      case ";": return { type: TokenType.SEMICOLON, value: ";", line: startLine, column: startColumn };
      case "(": return { type: TokenType.LPAREN, value: "(", line: startLine, column: startColumn };
      case ")": return { type: TokenType.RPAREN, value: ")", line: startLine, column: startColumn };
      case "{": return { type: TokenType.LBRACE, value: "{", line: startLine, column: startColumn };
      case "}": return { type: TokenType.RBRACE, value: "}", line: startLine, column: startColumn };
      case "[": return { type: TokenType.LBRACKET, value: "[", line: startLine, column: startColumn };
      case "]": return { type: TokenType.RBRACKET, value: "]", line: startLine, column: startColumn };
      case ",": return { type: TokenType.COMMA, value: ",", line: startLine, column: startColumn };
      case ":": return { type: TokenType.COLON, value: ":", line: startLine, column: startColumn };
      case ".": return { type: TokenType.DOT, value: ".", line: startLine, column: startColumn };
      case "&": return { type: TokenType.AMPERSAND, value: "&", line: startLine, column: startColumn };
      default:
        throw new Error(`Unexpected character '${char}' at line ${startLine}, column: ${startColumn}`);
    }
  }

  private readString(startLine: number, startColumn: number): Token {
    this.advance(); // Skip opening quote
    let value = "";

    while (this.position < this.source.length && this.source[this.position] !== '"') {
      if (this.source[this.position] === "\\") {
        this.advance();
        if (this.position < this.source.length) {
          const escaped = this.source[this.position];
          switch (escaped) {
            case 'n': value += '\n'; break;
            case 't': value += '\t'; break;
            case 'r': value += '\r'; break;
            case '\\': value += '\\'; break;
            case '"': value += '"'; break;
            default: value += escaped;
          }
          this.advance();
        }
      } else {
        value += this.source[this.position];
        this.advance();
      }
    }

    if (this.position >= this.source.length) {
      throw new Error(`Unterminated string at line ${startLine}, column ${startColumn}`);
    }

    this.advance(); // Skip closing quote
    return { type: TokenType.STRING, value, line: startLine, column: startColumn };
  }

  private readNumber(startLine: number, startColumn: number): Token {
    let value = "";
    let hasDecimal = false;

    while (this.position < this.source.length) {
      const char = this.source[this.position];
      if (this.isDigit(char)) {
        value += char;
        this.advance();
      } else if (char === "." && !hasDecimal && this.position + 1 < this.source.length && this.isDigit(this.source[this.position + 1])) {
        hasDecimal = true;
        value += char;
        this.advance();
      } else {
        break;
      }
    }

    return { type: TokenType.NUMBER, value, line: startLine, column: startColumn };
  }

  private readIdentifierOrKeyword(startLine: number, startColumn: number): Token {
    let value = "";
    while (this.position < this.source.length && this.isAlphaNumeric(this.source[this.position])) {
      value += this.source[this.position];
      this.advance();
    }

    const keywords: Record<string, TokenType> = {
      const: TokenType.CONST,
      mut: TokenType.MUT,
      procedure: TokenType.PROCEDURE,
      returns: TokenType.RETURNS,
      incase: TokenType.INCASE,
      else: TokenType.ELSE,
      elif: TokenType.ELIF,
      drift: TokenType.DRIFT,
      through: TokenType.THROUGH,
      break: TokenType.BREAK,
      continue: TokenType.CONTINUE,
      true: TokenType.TRUE,
      false: TokenType.FALSE,
      null: TokenType.NULL,
      nullptr: TokenType.NULLPTR,
      NaN: TokenType.NAN,
    };

    const type = keywords[value] || TokenType.IDENTIFIER;
    return { type, value, line: startLine, column: startColumn };
  }

  private skipWhitespaceAndComments(): void {
    while (this.position < this.source.length) {
      const char = this.source[this.position];

      if (char === " " || char === "\t" || char === "\r") {
        this.advance();
      } else if (char === "\n") {
        this.advance();
        this.line++;
        this.column = 1;
      } else if (char === "#") {
        // Skip comments until end of line
        while (this.position < this.source.length && this.source[this.position] !== "\n") {
          this.advance();
        }
      } else {
        break;
      }
    }
  }

  private isDigit(char: string): boolean {
    return char >= "0" && char <= "9";
  }

  private isAlpha(char: string): boolean {
    return (char >= "a" && char <= "z") || (char >= "A" && char <= "Z") || char === "_";
  }

  private isAlphaNumeric(char: string): boolean {
    return this.isAlpha(char) || this.isDigit(char);
  }

  private advance(): void {
    this.position++;
    this.column++;
  }

  private peek(): string | null {
    if (this.position + 1 < this.source.length) {
      return this.source[this.position + 1];
    }
    return null;
  }
}
