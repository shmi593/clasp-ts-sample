import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getCellValue, hello } from '../src/lib';

describe('hello()', () => {
  it('should return a greeting message', () => {
    expect(hello('太郎')).toBe('Hello, 太郎!');
  });
});

describe('getCellValue()', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    const mockCell = { getValue: () => 'TestValue123' };
    const mockSheet = { getRange: vi.fn().mockReturnValue(mockCell) };
    const mockSpreadsheet = {
      getSheetByName: vi.fn().mockReturnValue(mockSheet),
    };

    const mockPropertiesService = {
      getScriptProperties: vi.fn().mockReturnValue({
        getProperty: vi.fn().mockReturnValue('spreadsheet-id-123'),
      }),
    };

    const mockSpreadsheetApp = {
      openById: vi.fn().mockReturnValue(mockSpreadsheet),
    };

    vi.stubGlobal('PropertiesService', mockPropertiesService);
    vi.stubGlobal('SpreadsheetApp', mockSpreadsheetApp);
  });

  it('should get cell value from spreadsheet', () => {
    const result = getCellValue('Sheet1', 'A1');
    expect(result).toBe('TestValue123');
  });
});
