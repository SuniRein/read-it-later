export interface GoogleDriveFile {
  id: string;
  name: string;
  size: number;
}

export async function listFiles(accessToken: string, nextPageToken?: string): Promise<GoogleDriveFile[]> {
  const params = {
    spaces: 'appDataFolder',
    fields: [
      'files(id,name,size)',
      'nextPageToken',
    ].join(','),
    pageSize: '1000',
    pageToken: nextPageToken ?? '',
  };
  const url = `https://www.googleapis.com/drive/v3/files?${new URLSearchParams(params)}`;
  const headers = { Authorization: `Bearer ${accessToken}` };

  const response = await fetch(url, { headers });
  const result = await response.json();

  let files = result.files as any[];
  if (result.nextPageToken !== undefined)
    files = files.concat(await listFiles(accessToken, result.nextPageToken));

  return files.map(file => ({
    id: file.id,
    name: file.name,
    size: Number(file.size),
  }));
}

export async function uploadFile(accessToken: string, { filename, data }: { filename: string; data: string }) {
  const metadata = {
    name: filename,
    mimeType: 'application/json',
    parents: ['appDataFolder'],
  };
  const file = new Blob([data], { type: 'application/json' });
  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('file', file);

  const request = {
    method: 'POST',
    headers: new Headers({ Authorization: `Bearer ${accessToken}` }),
    body: form,
  };
  const url = `https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart`;

  const result = await fetch(url, request);
  const resultJson = await result.json();
  if (resultJson.error !== undefined)
    console.error('Upload file error:', resultJson.error);
}

export async function downloadFile(accessToken: string, fileId: string) {
  const params = { alt: 'media' };
  const url = `https://www.googleapis.com/drive/v3/files/${fileId}?${new URLSearchParams(params)}`;
  const headers = { Authorization: `Bearer ${accessToken}` };

  const response = await fetch(url, { headers });
  return response.text();
}

export async function deleteFile(accessToken: string, fileId: string) {
  const url = `https://www.googleapis.com/drive/v3/files/${fileId}`;
  const headers = { Authorization: `Bearer ${accessToken}` };
  await fetch(url, { method: 'DELETE', headers });
}

export async function validateToken(accessToken: string) {
  const url = `https://oauth2.googleapis.com/tokeninfo?access_token=${accessToken}`;
  const response = await fetch(url);
  const result = await response.json();

  if (result.error !== undefined) {
    throw new Error(result.error);
  }
}
