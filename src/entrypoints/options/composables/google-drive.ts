import type { GoogleDriveConfig } from '@/utils/types';
import { getAuthCode, getEmail, getTokenExpiration, getTokens, refreshAccessToken, revokeToken } from '../utils/google-drive-auth';

export function useGoogleDriveConnect(config: Ref<GoogleDriveConfig | null>) {
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
    const THRESHOLD_MS = 60000; // 1 minute
    if (Date.now() < expirationTime - THRESHOLD_MS) {
      return currentAccessToken;
    }

    const refreshToken = config.value.refreshToken;
    const { accessToken, expiresIn } = await refreshAccessToken(refreshToken);
    config.value = {
      ...config.value,
      accessToken,
      expiresIn: getTokenExpiration(expiresIn),
    };
  }

  return {
    signIn,
    signOut,
  };
}
