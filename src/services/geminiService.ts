/**
 * Client service to consult the enchanted diary via server-side Gemini API.
 * Never exposes API keys on the client.
 */
export async function consultDiary(
  entryText: string,
  authorName?: string
): Promise<string> {
  if (!entryText || !entryText.trim()) {
    throw new Error('The pages cannot read empty thoughts.');
  }

  const response = await fetch('/api/diary-response', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      entryText: entryText.trim(),
      authorName: authorName || undefined,
    }),
  });

  if (!response.ok) {
    let errMessage = 'The diary resisted responding.';
    try {
      const data = await response.json();
      if (data?.error) {
        errMessage = data.error;
      }
    } catch {
      errMessage = `Enchanted failure (${response.status}: ${response.statusText})`;
    }
    throw new Error(errMessage);
  }

  const data = await response.json();
  if (!data?.aiResponse) {
    throw new Error('The ink faded without leaving an answer.');
  }

  return data.aiResponse;
}
