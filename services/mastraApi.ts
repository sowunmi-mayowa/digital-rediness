export async function createRun(): Promise<string | null> {
  const url =
    'https://little-few-helicopter.mastra.cloud/api/workflows/digital-readiness-workflow/create-run';
  const options = { method: 'POST' } as const;

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    const runId = (data && (data.runId ?? data.runID ?? data.id)) || null;
    console.log('Mastra create-run response:', data);
    console.log('Mastra runId:', runId);
    return runId;
  } catch (error) {
    console.error('Mastra create-run error:', error);
    return null;
  }
}

export async function startWorkflow(
  runId: string,
  payload: unknown,
): Promise<any> {
  const url = `https://little-few-helicopter.mastra.cloud/api/workflows/digital-readiness-workflow/start-async?runId=${runId}`;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  } as const;

  try {
    const response = await fetch(url, options as any);
    const data = await response.json();
    console.log('Mastra start-async response:', data);
    return data;
  } catch (error) {
    console.error('Mastra start-async error:', error);
    return null;
  }
}

export async function resumeWorkflow(
  runId: string,
  step: string,
  answers: Array<{ answer: string; questionId: string }>,
): Promise<any> {
  const url = `https://little-few-helicopter.mastra.cloud/api/workflows/digital-readiness-workflow/resume-async?runId=${runId}`;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      step,
      resumeData: {
        answers,
      },
    }),
  } as const;

  try {
    const response = await fetch(url, options as any);
    const data = await response.json();
    console.log('Mastra resume-async response:', data);
    return data;
  } catch (error) {
    console.error('Mastra resume-async error:', error);
    return null;
  }
}
