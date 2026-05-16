/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Use server-side proxy for production.

export async function scanStickerImage(base64Image: string): Promise<string | null> {
  // This function will be moved to server-side or call our server API.
  try {
    const response = await fetch('/api/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: base64Image })
    });
    const data = await response.json();
    return data.stickerId;
  } catch (error) {
    console.error("Scanning error:", error);
    return null;
  }
}
