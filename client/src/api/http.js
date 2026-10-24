import axios from 'axios';

import { API_BASE_URL } from '../lib/config';

export const AUTH_STORAGE_KEY = 'crackers_auth';

const http = axios.create({
  baseURL: API_BASE_URL,
});

http.interceptors.request.use((config) => {
  const stored = localStorage.getItem(AUTH_STORAGE_KEY);
  const auth = stored ? JSON.parse(stored) : null;

  if (auth?.token) {
    config.headers.Authorization = `Bearer ${auth.token}`;
  }

  return config;
});

export default http;

