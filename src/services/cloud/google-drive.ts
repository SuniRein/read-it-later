import type { GoogleDriveConfig } from '@/common/types';
import { SYNC_FILE_FOLDER, SYNC_FILE_NAME } from '@/services/cloud/constants';
import { deleteFile, downloadFile, listFiles, updateFile, uploadFile, validateToken } from '@/services/google-drive-api';
import { getAuthCode, getEmail, getTokenExpiration, getTokens, refreshAccessToken, revokeToken } from '@/services/google-drive-auth';

export const GOOGLE_DRIVE_TOKEN_REFRESH_THRESHOLD_MS = 60_000; // 1 minute
export const GOOGLE_DRIVE_SYNC_FILE_NAME = `${SYNC_FILE_FOLDER}/${SYNC_FILE_NAME}`;

export function useGoogleDriveService(config: Ref<GoogleDriveConfig | null>) {
  async function signIn() {
    const authCode = await getAuthCode();
    const { accessToken, expiresIn, refreshToken } = await getTokens(authCode);
    const email = await getEmail(accessToken);

    config.value = {
      email,
      accessToken,
      refreshToken,
      expiresIn: getTokenExpiration(expiresIn),
    };
  }

  function signOut() {
    if (config.value) {
      void revokeToken(config.value.accessToken);
      void revokeToken(config.value.refreshToken);
      config.value = null;
    }
  }

  async function getOrRefreshAccessToken() {
    if (!config.value)
      throw new Error('Not signed in');

    const currentAccessToken = config.value.accessToken;
    const expirationTime = config.value.expiresIn;
    if (Date.now() < expirationTime - GOOGLE_DRIVE_TOKEN_REFRESH_THRESHOLD_MS) {
      return currentAccessToken;
    }

    const refreshToken = config.value.refreshToken;
    const { accessToken, expiresIn } = await refreshAccessToken(refreshToken);
    config.value = {
      ...config.value,
      accessToken,
      expiresIn: getTokenExpiration(expiresIn),
    };
    return accessToken;
  }

  async function list() {
    const accessToken = await getOrRefreshAccessToken();
    return (await listFiles(accessToken))
      .filter(file => !file.name.startsWith(`${SYNC_FILE_FOLDER}/`))
      .map(file => ({
        id: file.id,
        name: file.name,
        size: Number(file.size) ?? -1,
      }));
  }

  async function save(filename: string, data: string) {
    const accessToken = await getOrRefreshAccessToken();
    return uploadFile(accessToken, { filename, data });
  }

  async function get(id: string) {
    const accessToken = await getOrRefreshAccessToken();
    return downloadFile(accessToken, id);
  }

  async function remove(id: string) {
    const accessToken = await getOrRefreshAccessToken();
    return deleteFile(accessToken, id);
  }

  async function validate() {
    const accessToken = await getOrRefreshAccessToken();
    return validateToken(accessToken);
  }

  async function findSyncFile() {
    const accessToken = await getOrRefreshAccessToken();
    const files = await listFiles(
      accessToken,
      { q: `name = '${GOOGLE_DRIVE_SYNC_FILE_NAME}' and trashed = false` },
    );
    return files[0] ?? null;
  }

  async function saveSyncFile(data: string) {
    const accessToken = await getOrRefreshAccessToken();
    const existing = await findSyncFile();
    if (existing != null)
      await updateFile(accessToken, existing.id, data);
    else
      await uploadFile(accessToken, { filename: GOOGLE_DRIVE_SYNC_FILE_NAME, data });
  }

  return {
    signIn,
    signOut,

    list,
    save,
    get,
    remove,
    validate,
    findSyncFile,
    saveSyncFile,
  };
}
