const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export async function fetchFromApi<T = any>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.message || `API error ${res.status}: ${res.statusText}`);
  }

  return res.json();
}

export const api = {
  businesses: {
    list: (params?: { q?: string; category?: string; city?: string; page?: number }) => {
      const qs = new URLSearchParams(params as any).toString();
      return fetchFromApi(`/businesses?${qs}`);
    },
    get: (idOrSlug: string) => fetchFromApi(`/businesses/${idOrSlug}`),
    create: (data: any) => fetchFromApi('/businesses', { method: 'POST', body: JSON.stringify(data) }),
    update: (idOrSlug: string, data: any) =>
      fetchFromApi(`/businesses/${idOrSlug}`, { method: 'PATCH', body: JSON.stringify(data) }),
  },
  claims: {
    submit: (data: any) => fetchFromApi('/claims', { method: 'POST', body: JSON.stringify(data) }),
    list: (status?: string) => fetchFromApi(`/claims${status ? `?status=${status}` : ''}`),
  },
  franchise: {
    getBrand: (id: string) => fetchFromApi(`/brands/${id}`),
    getBranches: (brandId: string) => fetchFromApi(`/brands/${brandId}/branches`),
    bulkImport: (brandId: string, branches: any[]) =>
      fetchFromApi(`/brands/${brandId}/branches/import`, {
        method: 'POST',
        body: JSON.stringify({ branches }),
      }),
  },
  leads: {
    submit: (data: any) => fetchFromApi('/leads', { method: 'POST', body: JSON.stringify(data) }),
    recordInteraction: (businessId: string, eventType: string) =>
      fetchFromApi('/leads/interactions', {
        method: 'POST',
        body: JSON.stringify({ businessId, eventType }),
      }),
  },
  seo: {
    getCampaign: (id: string) => fetchFromApi(`/campaigns/${id}`),
    verifyMilestone: (milestoneId: string) =>
      fetchFromApi(`/campaigns/milestones/${milestoneId}/verify`, { method: 'POST' }),
  },
};

