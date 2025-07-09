import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';

import { LoggingService } from './logging.service';
import { LogLevel } from '../../../models/enum/log-level.enum';

describe('LoggingService', () => {
  let service: LoggingService;
  let consoleSpy: any;

  beforeEach(() => {
    // Mock console methods
    consoleSpy = {
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    };

    // Replace console methods with spies
    vi.spyOn(console, 'debug').mockImplementation(consoleSpy.debug);
    vi.spyOn(console, 'info').mockImplementation(consoleSpy.info);
    vi.spyOn(console, 'warn').mockImplementation(consoleSpy.warn);
    vi.spyOn(console, 'error').mockImplementation(consoleSpy.error);

    TestBed.configureTestingModule({
      providers: [LoggingService],
    });

    service = TestBed.inject(LoggingService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('debug', () => {
    it('should log debug message with context and data in development mode', () => {
      const context = 'TestComponent';
      const data = { key: 'value' };

      service.debug(context, data);

      expect(consoleSpy.debug).toHaveBeenCalledWith('[DEBUG] [TestComponent]', {
        key: 'value',
      });
    });

    it('should log debug message with context only in development mode', () => {
      const context = 'TestComponent';

      service.debug(context);

      expect(consoleSpy.debug).toHaveBeenCalledWith(
        '[DEBUG] [TestComponent]',
        ''
      );
    });

    it('should log debug message with null data in development mode', () => {
      const context = 'TestComponent';

      service.debug(context, null);

      expect(consoleSpy.debug).toHaveBeenCalledWith(
        '[DEBUG] [TestComponent]',
        ''
      );
    });

    it('should log debug message with undefined data in development mode', () => {
      const context = 'TestComponent';

      service.debug(context, undefined);

      expect(consoleSpy.debug).toHaveBeenCalledWith(
        '[DEBUG] [TestComponent]',
        ''
      );
    });
  });

  describe('info', () => {
    it('should log info message with context and data in development mode', () => {
      const context = 'TestComponent';
      const data = { key: 'value' };

      service.info(context, data);

      expect(consoleSpy.info).toHaveBeenCalledWith('[INFO] [TestComponent]', {
        key: 'value',
      });
    });

    it('should log info message with context only in development mode', () => {
      const context = 'TestComponent';

      service.info(context);

      expect(consoleSpy.info).toHaveBeenCalledWith(
        '[INFO] [TestComponent]',
        ''
      );
    });

    it('should log info message with complex data in development mode', () => {
      const context = 'TestComponent';
      const data = {
        user: { id: 1, name: 'John' },
        timestamp: new Date(),
        array: [1, 2, 3],
      };

      service.info(context, data);

      expect(consoleSpy.info).toHaveBeenCalledWith(
        '[INFO] [TestComponent]',
        data
      );
    });
  });

  describe('warn', () => {
    it('should log warn message with context and data in development mode', () => {
      const context = 'TestComponent';
      const data = { warning: 'Something went wrong' };

      service.warn(context, data);

      expect(consoleSpy.warn).toHaveBeenCalledWith('[WARN] [TestComponent]', {
        warning: 'Something went wrong',
      });
    });

    it('should log warn message with context only in development mode', () => {
      const context = 'TestComponent';

      service.warn(context);

      expect(consoleSpy.warn).toHaveBeenCalledWith(
        '[WARN] [TestComponent]',
        ''
      );
    });

    it('should log warn message with error object in development mode', () => {
      const context = 'TestComponent';
      const error = new Error('Test error');

      service.warn(context, error);

      expect(consoleSpy.warn).toHaveBeenCalledWith(
        '[WARN] [TestComponent]',
        error
      );
    });
  });

  describe('error', () => {
    it('should log error message with context and data in development mode', () => {
      const context = 'TestComponent';
      const data = { error: 'Critical error occurred' };

      service.error(context, data);

      expect(consoleSpy.error).toHaveBeenCalledWith('[ERROR] [TestComponent]', {
        error: 'Critical error occurred',
      });
    });

    it('should log error message with context only in development mode', () => {
      const context = 'TestComponent';

      service.error(context);

      expect(consoleSpy.error).toHaveBeenCalledWith(
        '[ERROR] [TestComponent]',
        ''
      );
    });

    it('should log error message with HttpErrorResponse in development mode', () => {
      const context = 'TestComponent';
      const httpError = {
        status: 500,
        message: 'Internal Server Error',
        error: 'Server error details',
      };

      service.error(context, httpError);

      expect(consoleSpy.error).toHaveBeenCalledWith(
        '[ERROR] [TestComponent]',
        httpError
      );
    });
  });

  describe('fatal', () => {
    it('should log fatal message with context and data in development mode', () => {
      const context = 'TestComponent';
      const data = { fatal: 'Application crash' };

      service.fatal(context, data);

      expect(consoleSpy.error).toHaveBeenCalledWith('[FATAL] [TestComponent]', {
        fatal: 'Application crash',
      });
    });

    it('should log fatal message with context only in development mode', () => {
      const context = 'TestComponent';

      service.fatal(context);

      expect(consoleSpy.error).toHaveBeenCalledWith(
        '[FATAL] [TestComponent]',
        ''
      );
    });

    it('should log fatal message with stack trace in development mode', () => {
      const context = 'TestComponent';
      const stackTrace = new Error('Fatal error').stack;

      service.fatal(context, stackTrace);

      expect(consoleSpy.error).toHaveBeenCalledWith(
        '[FATAL] [TestComponent]',
        stackTrace
      );
    });
  });

  describe('log level filtering', () => {
    it('should call all log methods in development mode (DEBUG level)', () => {
      const context = 'TestComponent';
      const data = { test: 'data' };

      service.debug(context, data);
      service.info(context, data);
      service.warn(context, data);
      service.error(context, data);
      service.fatal(context, data);

      expect(consoleSpy.debug).toHaveBeenCalledTimes(1);
      expect(consoleSpy.info).toHaveBeenCalledTimes(1);
      expect(consoleSpy.warn).toHaveBeenCalledTimes(1);
      expect(consoleSpy.error).toHaveBeenCalledTimes(2); // error + fatal
    });

    it('should format log messages correctly', () => {
      const context = 'AuthService';
      const data = { userId: 123, action: 'login' };

      service.info(context, data);

      expect(consoleSpy.info).toHaveBeenCalledWith('[INFO] [AuthService]', {
        userId: 123,
        action: 'login',
      });
    });

    it('should handle empty context', () => {
      const context = '';
      const data = { test: 'data' };

      service.info(context, data);

      expect(consoleSpy.info).toHaveBeenCalledWith('[INFO] []', {
        test: 'data',
      });
    });

    it('should handle special characters in context', () => {
      const context = 'Test-Component_123';
      const data = { test: 'data' };

      service.info(context, data);

      expect(consoleSpy.info).toHaveBeenCalledWith(
        '[INFO] [Test-Component_123]',
        { test: 'data' }
      );
    });
  });

  describe('multiple calls', () => {
    it('should handle multiple debug calls', () => {
      const context = 'TestComponent';

      service.debug(context, 'first call');
      service.debug(context, 'second call');
      service.debug(context, 'third call');

      expect(consoleSpy.debug).toHaveBeenCalledTimes(3);
      expect(consoleSpy.debug).toHaveBeenNthCalledWith(
        1,
        '[DEBUG] [TestComponent]',
        'first call'
      );
      expect(consoleSpy.debug).toHaveBeenNthCalledWith(
        2,
        '[DEBUG] [TestComponent]',
        'second call'
      );
      expect(consoleSpy.debug).toHaveBeenNthCalledWith(
        3,
        '[DEBUG] [TestComponent]',
        'third call'
      );
    });

    it('should handle mixed log level calls', () => {
      const context = 'TestComponent';

      service.debug(context, 'debug message');
      service.info(context, 'info message');
      service.warn(context, 'warning message');
      service.error(context, 'error message');

      expect(consoleSpy.debug).toHaveBeenCalledTimes(1);
      expect(consoleSpy.info).toHaveBeenCalledTimes(1);
      expect(consoleSpy.warn).toHaveBeenCalledTimes(1);
      expect(consoleSpy.error).toHaveBeenCalledTimes(1);
    });
  });

  describe('data handling', () => {
    it('should handle primitive data types', () => {
      const context = 'TestComponent';

      service.info(context, 'string data');
      service.info(context, 123);
      service.info(context, true);
      service.info(context, null);
      service.info(context, undefined);

      expect(consoleSpy.info).toHaveBeenCalledTimes(5);
      expect(consoleSpy.info).toHaveBeenNthCalledWith(
        1,
        '[INFO] [TestComponent]',
        'string data'
      );
      expect(consoleSpy.info).toHaveBeenNthCalledWith(
        2,
        '[INFO] [TestComponent]',
        123
      );
      expect(consoleSpy.info).toHaveBeenNthCalledWith(
        3,
        '[INFO] [TestComponent]',
        true
      );
      expect(consoleSpy.info).toHaveBeenNthCalledWith(
        4,
        '[INFO] [TestComponent]',
        ''
      );
      expect(consoleSpy.info).toHaveBeenNthCalledWith(
        5,
        '[INFO] [TestComponent]',
        ''
      );
    });

    it('should handle array data', () => {
      const context = 'TestComponent';
      const arrayData = [1, 2, 3, 'test', { key: 'value' }];

      service.info(context, arrayData);

      expect(consoleSpy.info).toHaveBeenCalledWith(
        '[INFO] [TestComponent]',
        arrayData
      );
    });

    it('should handle function data', () => {
      const context = 'TestComponent';
      const functionData = () => 'test function';

      service.info(context, functionData);

      expect(consoleSpy.info).toHaveBeenCalledWith(
        '[INFO] [TestComponent]',
        functionData
      );
    });
  });
});
