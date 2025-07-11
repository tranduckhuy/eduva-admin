import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { ThemeService } from './theme.service'; // Adjust path as necessary

describe('ThemeService', () => {
  let service: ThemeService;
  let localStorageMock: Storage;
  let documentElementClassListSpy: {
    add: ReturnType<typeof vi.fn>;
    remove: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    // Mock localStorage
    localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      length: 0, // Not used in this service, but part of Storage interface
      key: vi.fn(), // Not used in this service, but part of Storage interface
    };

    // Mock document.documentElement.classList
    documentElementClassListSpy = {
      add: vi.fn(),
      remove: vi.fn(),
    };

    // Spy on the actual document.documentElement.classList to use our mock
    Object.defineProperty(document, 'documentElement', {
      value: {
        classList: documentElementClassListSpy,
      },
      writable: true,
    });

    // Configure TestBed to provide the ThemeService
    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        // Provide the mocked localStorage. While we're spying on window.localStorage,
        // this can be a fallback or useful if Angular's DI was involved differently.
        { provide: 'localStorage', useValue: localStorageMock },
      ],
    });

    // Spy on window.localStorage globally to ensure the service uses our mock
    vi.spyOn(window, 'localStorage', 'get').mockReturnValue(localStorageMock);

    // IMPORTANT: Do NOT inject the service here. Inject it within each test
    // after setting up specific localStorage mocks for that test's constructor behavior.
  });

  // Clean up global mocks after each test
  afterEach(() => {
    vi.restoreAllMocks(); // Restore all spies and mocks
  });

  // Test case for constructor - dark mode saved
  it('should initialize to dark mode if "darkMode" is true in localStorage', () => {
    // Set the localStorage mock BEFORE injecting the service for this test
    (localStorageMock.getItem as ReturnType<typeof vi.fn>).mockReturnValue(
      'true'
    );

    // Inject the service here so its constructor runs with the mocked localStorage
    service = TestBed.inject(ThemeService);

    expect(service.isDarkMode()).toBe(true);
    expect(localStorageMock.getItem).toHaveBeenCalledWith('darkMode');
    expect(documentElementClassListSpy.add).toHaveBeenCalledWith('dark');
    expect(documentElementClassListSpy.remove).not.toHaveBeenCalled();
  });

  // Test case for constructor - light mode saved
  it('should initialize to light mode if "darkMode" is false or null in localStorage', () => {
    // Set the localStorage mock BEFORE injecting the service for this test
    (localStorageMock.getItem as ReturnType<typeof vi.fn>).mockReturnValue(
      'false'
    ); // Or null for no item

    // Inject the service here so its constructor runs with the mocked localStorage
    service = TestBed.inject(ThemeService);

    expect(service.isDarkMode()).toBe(false);
    expect(localStorageMock.getItem).toHaveBeenCalledWith('darkMode');
    expect(documentElementClassListSpy.remove).not.toHaveBeenCalled(); // Should not remove 'dark' if it wasn't there
    expect(documentElementClassListSpy.add).not.toHaveBeenCalled();
  });

  // Test case for setDarkMode method
  it('should set dark mode to true', () => {
    // Inject service for methods that don't rely on constructor init state
    service = TestBed.inject(ThemeService);
    service.setDarkMode(true);
    expect(service.isDarkMode()).toBe(true);
  });

  // Test case for setDarkMode method
  it('should set dark mode to false', () => {
    // Inject service for methods that don't rely on constructor init state
    service = TestBed.inject(ThemeService);
    // First set to true to ensure it can be changed
    service.setDarkMode(true);
    expect(service.isDarkMode()).toBe(true);

    service.setDarkMode(false);
    expect(service.isDarkMode()).toBe(false);
  });

  // Test case for toggleDarkMode method - from light to dark
  it('should toggle from light mode to dark mode', () => {
    // Inject service for methods that don't rely on constructor init state
    service = TestBed.inject(ThemeService);
    // Ensure initial state is light mode
    service.setDarkMode(false);
    expect(service.isDarkMode()).toBe(false);

    service.toggleDarkMode();

    expect(service.isDarkMode()).toBe(true);
    expect(documentElementClassListSpy.add).toHaveBeenCalledWith('dark');
    expect(documentElementClassListSpy.remove).not.toHaveBeenCalled();
    expect(localStorageMock.setItem).toHaveBeenCalledWith('darkMode', 'true');
  });

  // Test case for toggleDarkMode method - from dark to light
  it('should toggle from dark mode to light mode', () => {
    // Inject service for methods that don't rely on constructor init state
    service = TestBed.inject(ThemeService);
    // Ensure initial state is dark mode
    service.setDarkMode(true);
    expect(service.isDarkMode()).toBe(true);

    service.toggleDarkMode();

    expect(service.isDarkMode()).toBe(false);
    expect(documentElementClassListSpy.remove).toHaveBeenCalledWith('dark');
    expect(documentElementClassListSpy.add).not.toHaveBeenCalled();
    expect(localStorageMock.setItem).toHaveBeenCalledWith('darkMode', 'false');
  });
});
