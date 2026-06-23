export async function fetchTestMessage(): Promise<string> {
  const response = await fetch('/api/test');
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  const data = await response.json();
  return data.message as string;
}
