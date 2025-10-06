import { StreamLanguage } from "@codemirror/language";
import { LanguageSupport } from "@codemirror/language";

// Keywords for Misty language
const mistyKeywords = [
  "const",
  "mut",
  "procedure",
  "returns",
  "incase",
  "drift",
  "through",
  "true",
  "false",
];

const mistyBuiltins = ["System"];

// Simple syntax highlighting using StreamLanguage
const mistyStreamLanguage = StreamLanguage.define({
  token(stream, state) {
    // Skip whitespace
    if (stream.eatSpace()) return null;

    // Comments
    if (stream.match("#")) {
      stream.skipToEnd();
      return "comment";
    }

    // Strings
    if (stream.match('"')) {
      while (!stream.eol()) {
        if (stream.next() === '"') {
          return "string";
        }
      }
      return "string";
    }

    // Numbers
    if (stream.match(/^[0-9]+(\.[0-9]+)?/)) {
      return "number";
    }

    // Keywords and identifiers
    if (stream.match(/^[a-zA-Z_][a-zA-Z0-9_]*/)) {
      const word = stream.current();
      if (mistyKeywords.includes(word)) {
        return "keyword";
      }
      if (mistyBuiltins.includes(word)) {
        return "builtin";
      }
      if (word === "true" || word === "false") {
        return "atom";
      }
      return "variable";
    }

    // Operators
    if (stream.match(/^(&&|\|\||==|!=|<=|>=|[+\-*\/<>=!&|])/)) {
      return "operator";
    }

    // Punctuation
    if (stream.match(/^[(){}\[\];,.]/)) {
      return "punctuation";
    }

    stream.next();
    return null;
  },

  startState() {
    return {};
  },
});

export function misty(): LanguageSupport {
  return new LanguageSupport(mistyStreamLanguage);
}
