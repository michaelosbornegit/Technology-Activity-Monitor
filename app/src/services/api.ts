import { DisplaySession, Session } from '@serverTypes/session';

const sessionResource = `${process.env.REACT_APP_API_HOST}/session` || '';

const enrichedFetch = async (
    url: string,
    options = {} as RequestInit,
    throwOnError = true
) => {
    const response = await fetch(url, options);
    if (response.status === 204) return response;
    if (response.status === 401) throw new Error('Unauthorized');
    if (response.status < 200 || response.status >= 300) {
      if (throwOnError) throw new Error('Failed API Call');
      return response;
    }
    return response.json();
}

export const getPastDaySessions = (): Promise<DisplaySession> => {
    return enrichedFetch(`${sessionResource}/lastDay`);
}