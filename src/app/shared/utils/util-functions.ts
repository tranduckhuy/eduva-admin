import { effect, EffectRef, Signal } from '@angular/core';
import { FormGroup } from '@angular/forms';

/**
 * Triggers the download of a file from a base64-encoded string.
 *
 * @param fileName - The desired name of the downloaded file, including extension (e.g., "report.xlsx").
 * @param base64Content - The base64-encoded content of the file to be downloaded.
 *
 * This function:
 * 1. Decodes the base64 content into binary data.
 * 2. Converts the binary data into a Blob object.
 * 3. Creates a temporary download link and triggers a click to start the download.
 * 4. Cleans up the created object URL.
 */
export const triggerDownload = (fileName: string, base64Content: string) => {
  const byteCharacters = atob(base64Content);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray]);
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
};

/**
 * Triggers the download of a file from a Blob object.
 *
 * @param fileName - The desired name of the downloaded file, including extension (e.g., "export.xlsx").
 * @param blob - The Blob object containing the file data to download.
 *
 * This function:
 * 1. Creates a temporary object URL from the Blob.
 * 2. Creates and triggers a temporary anchor element to download the file.
 * 3. Cleans up the object URL after the download is triggered.
 */
export const triggerBlobDownload = (fileName: string, blob: Blob): void => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
};

/**
 * Checks whether the value and confirm value fields in a FormGroup do not match.
 *
 * @param form - The FormGroup containing the fields that need to check matching.
 * @param valueField - The name of the value field (default: 'newPassword').
 * @param confirmValueField - The name of the confirm value field (default: 'confirmPassword').
 * @returns `true` if the values do not match, otherwise `false`.
 */
export function isFormFieldMismatch(
  form: FormGroup,
  valueField: string = 'newPassword',
  confirmValueField: string = 'confirmPassword'
): boolean {
  const value: string | null | undefined = form.get(valueField)?.value;
  const confirmValue: string | null | undefined =
    form.get(confirmValueField)?.value;
  return value !== confirmValue;
}

/**
 * Subscribes to a signal and invokes a callback after a debounce delay when the signal's value changes.
 * Useful for search input, filtering, or any scenario where you want to reduce frequent signal emissions.
 *
 * @template T - The type of the signal's value.
 * @param signal - The signal to observe.
 * @param callback - The function to invoke after the debounce period with the latest value.
 * @param delay - The debounce delay in milliseconds (default is 300ms).
 * @returns A cleanup function that stops the effect and cancels the timer.
 */
export function debounceSignal<T>(
  signal: Signal<T>,
  callback: (value: T) => void,
  delay: number = 300
): () => void {
  let timer: any = null;
  let previousValue: T;

  const ref: EffectRef = effect(() => {
    const currentValue = signal();

    // ? Skip initial run
    if (currentValue === previousValue) return;
    previousValue = currentValue;

    if (timer) clearTimeout(timer);
    timer = setTimeout(() => callback(currentValue), delay);
  });

  return () => {
    clearTimeout(timer);
    ref.destroy();
  };
}
