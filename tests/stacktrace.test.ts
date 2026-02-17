import { parseStackTrace } from '../src/capture/stacktrace';

describe('Stack Trace Parser', () => {
  describe('Node.js Stack Traces', () => {
    it('should parse a typical Node.js error', () => {
      const stackTrace = `Error: Something went wrong
    at handleError (/home/user/project/src/handler.js:10:15)
    at processRequest (/home/user/project/src/server.js:25:5)
    at Server.<anonymous> (/home/user/project/src/index.js:50:10)`;

      const result = parseStackTrace(stackTrace);

      expect(result.language).toBe('javascript');
      expect(result.errorType).toBe('Error');
      expect(result.errorMessage).toBe('Something went wrong');
      expect(result.lines.length).toBe(3);
      expect(result.lines[0]).toMatchObject({
        function: 'handleError',
        file: '/home/user/project/src/handler.js',
        line: 10,
        column: 15,
      });
    });

    it('should parse TypeScript stack traces', () => {
      const stackTrace = `TypeError: Cannot read property 'length' of undefined
    at validateInput (/app/src/validator.ts:42:20)`;

      const result = parseStackTrace(stackTrace);

      expect(result.language).toBe('typescript');
      expect(result.errorType).toBe('TypeError');
    });
  });

  describe('Python Stack Traces', () => {
    it('should parse a typical Python error', () => {
      const stackTrace = `Traceback (most recent call last):
  File "/home/user/script.py", line 10, in <module>
    result = divide(a, b)
  File "/home/user/script.py", line 5, in divide
    return x / y
ZeroDivisionError: division by zero`;

      const result = parseStackTrace(stackTrace);

      expect(result.language).toBe('python');
      expect(result.errorType).toBe('ZeroDivisionError');
      expect(result.errorMessage).toBe('division by zero');
      expect(result.lines.length).toBe(2);
    });
  });

  describe('Empty or invalid input', () => {
    it('should handle empty stack traces', () => {
      const result = parseStackTrace('');

      expect(result.language).toBe('unknown');
      expect(result.lines.length).toBe(0);
    });

    it('should handle unrecognized stack traces', () => {
      const result = parseStackTrace('Some random error message without a stack trace');

      expect(result.language).toBe('unknown');
    });
  });
});
