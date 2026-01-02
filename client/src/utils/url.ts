import { APP_URL } from '@shared/constants';

/**
 * Copies text to clipboard
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch {
      document.body.removeChild(textArea);
      return false;
    }
  }
};

/**
 * Opens URL in a new tab
 */
export const openInNewTab = (url: string): void => {
  window.open(url, '_blank', 'noopener,noreferrer');
};

/**
 * Shares profile using Web Share API (fallback to copy)
 */
export const shareAirtimeTrxSuccess = async (username: string, title?: string): Promise<boolean> => {
  const shareData = {
    title: title || `Airtime Transaction Success`,
    text: `Just topped up my airtime with BitcoinCash`,
  };

  // Try Web Share API first (mobile browsers)
  if (navigator.share) {
    try {
      await navigator.share(shareData);
      return true;
    } catch (error) {
      // User cancelled or error occurred
      if ((error as Error).name === 'AbortError') {
        return false;
      }
    }
  }

  // Fallback to clipboard
  return copyToClipboard(`Just topped up my airtime with BitcoinCash`);
};

/**
 * Downloads a file from a URL
 */
export const downloadFile = (url: string, filename: string): void => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Constructs a URL with query parameters
 */
export const buildUrl = (base: string, params: Record<string, string | number>): string => {
  const url = new URL(base);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, String(value));
  });
  return url.toString();
};