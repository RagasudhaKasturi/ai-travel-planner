/**
 * Thin wrapper around the Google Gemini API.
 *
 * Two responsibilities live here on purpose, separate from the controller:
 *  1. Resilience — transient failures (rate limits, network blips) are
 *     retried with exponential backoff instead of failing the user's request.
 *  2. Contract enforcement — every call forces JSON-mode output and parses
 *     the result, so controllers never deal with raw text.
 */

const GEMINI_URL_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

async function callGeminiJSON(prompt, { retries = 5, delayMs = 1000 } = {}) {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

  if (!apiKey) {
    const err = new Error('Server misconfiguration: GEMINI_API_KEY is not set.');
    err.statusCode = 500;
    throw err;
  }

  const url = `${GEMINI_URL_BASE}/${model}:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.8
    }
  };

  const data = await fetchWithRetry(url, payload, retries, delayMs);

  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    const err = new Error('The AI agent returned an empty response. Please try again.');
    err.statusCode = 502;
    throw err;
  }

  try {
    return JSON.parse(text);
  } catch (parseError) {
    const err = new Error('The AI agent returned malformed data. Please try again.');
    err.statusCode = 502;
    throw err;
  }
}

async function fetchWithRetry(url, payload, retries, delayMs) {
  let attempt = 0;
  let currentDelay = delayMs;

  while (true) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        return await response.json();
      }

      // Retry on rate limiting or transient server errors
      const retryable = response.status === 429 || response.status >= 500;
      if (retryable && attempt < retries) {
        await sleep(currentDelay);
        attempt += 1;
        currentDelay *= 2;
        continue;
      }

      const body = await response.text().catch(() => '');
      const err = new Error(`Gemini API error (${response.status}): ${body.slice(0, 200)}`);
      err.statusCode = response.status === 429 ? 429 : 502;
      throw err;
    } catch (networkError) {
      if (networkError.statusCode) throw networkError; // already-classified error above

      if (attempt < retries) {
        await sleep(currentDelay);
        attempt += 1;
        currentDelay *= 2;
        continue;
      }
      const err = new Error('Could not reach the AI agent after multiple retries.');
      err.statusCode = 503;
      throw err;
    }
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = { callGeminiJSON };
