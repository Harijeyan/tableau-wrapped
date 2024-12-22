const BASE_URL = 'https://public.tableau.com';

export async function fetchTableauProfile(username: string) {
  try {
    const response = await fetch(`${BASE_URL}/profile/api/${username}`);
    if (!response.ok) {
      throw new Error('Profile not found');
    }
    return await response.json();
  } catch (error) {
    throw new Error('Failed to fetch profile');
  }
}

export async function fetchTableauWorkbooks(username: string) {
  try {
    const response = await fetch(
      `${BASE_URL}/public/apis/workbooks?profileName=${username}&start=0&count=50`
    );
    if (!response.ok) {
      throw new Error('Workbooks not found');
    }
    return await response.json();
  } catch (error) {
    throw new Error('Failed to fetch workbooks');
  }
}

export async function fetchTableauStats(username: string) {
  try {
    const response = await fetch(`/api/tableau?username=${username}`);
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}
