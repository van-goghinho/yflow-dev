const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// Wrapper fetch avec auth JWT
async function fetchApi(endpoint: string, options?: RequestInit) {
  const token = localStorage.getItem('token');
  let res: Response;
  try {
    res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options?.headers,
      },
    });
  } catch {
    throw new ApiError(0, 'network_error');
  }
  if (!res.ok) throw new ApiError(res.status, await res.text());
  return res.json();
}

export const api = {
  // Auth
  signIn: (email: string, password: string) =>
    fetchApi('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  signUp: (email: string, password: string, name: string) =>
    fetchApi('/auth/register', { method: 'POST', body: JSON.stringify({ email, password, name }) }),

  // Profile
  getMe: () => fetchApi('/users/me'),
  updateProfile: (data: { name?: string; email?: string }) =>
    fetchApi('/users/me', { method: 'PUT', body: JSON.stringify(data) }),
  updatePassword: (currentPassword: string, newPassword: string) =>
    fetchApi('/users/me/password', { method: 'PUT', body: JSON.stringify({ currentPassword, newPassword }) }),

  // Workflows
  getPublicWorkflows: () => fetchApi('/workflows/public'),
  getWorkflows: () => fetchApi('/workflows'),
  getWorkflow: (id: string) => fetchApi(`/workflows/${id}`),
  createWorkflow: (data: any) =>
    fetchApi('/workflows', { method: 'POST', body: JSON.stringify(data) }),
  updateWorkflow: (id: string, data: any) =>
    fetchApi(`/workflows/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteWorkflow: (id: string) =>
    fetchApi(`/workflows/${id}`, { method: 'DELETE' }),
  runWorkflow: (id: string, inputs?: any) =>
    fetchApi(`/workflows/${id}/run`, { method: 'POST', body: JSON.stringify(inputs || {}) }),
};
