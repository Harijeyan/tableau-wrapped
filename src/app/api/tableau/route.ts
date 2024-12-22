import { NextResponse } from 'next/server';

interface TableauResponse {
  data: {
    [key: string]: string | number;
  };
  status: number;
}

interface TableauError {
  message: string;
  code: number;
}

interface TableauRequestData {
  url: string;
  method: string;
  headers?: Record<string, string>;
  body?: string;
}

interface TableauApiResponse {
  data: Record<string, string | number>;
  error?: string;
}

type ErrorResponse = {
  error: string;
  status: number;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');
  const BASE_URL = 'https://public.tableau.com';

  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 });
  }

  try {
    // Fetch both profile and workbooks in parallel
    const [profileRes, workbooksRes] = await Promise.all([
      fetch(`${BASE_URL}/profile/api/${username}`),
      fetch(`${BASE_URL}/public/apis/workbooks?profileName=${username}&start=0&count=50&visibility=NON_HIDDEN`)
    ]);

    if (!profileRes.ok || !workbooksRes.ok) {
      throw new Error('Failed to fetch data');
    }

    const profile = await profileRes.json();
    const workbooksData = await workbooksRes.json();

    // Calculate total views and favorites
    const totalViews = workbooksData.contents.reduce((sum: number, wb: any) => sum + (wb.viewCount || 0), 0);
    const totalFavorites = workbooksData.contents.reduce((sum: number, wb: any) => sum + (wb.numberOfFavorites || 0), 0);

    // Calculate time on platform
    const joinDate = new Date(profile.createdAt);
    const now = new Date();
    const yearsOnPlatform = now.getFullYear() - joinDate.getFullYear();
    const monthsOnPlatform = now.getMonth() - joinDate.getMonth();
    const daysOnPlatform = now.getDate() - joinDate.getDate();

    return NextResponse.json({
      profile: {
        name: profile.name,
        profileName: profile.profileName,
        title: profile.title || 'Data Enthusiast',
        organization: profile.organization,
        avatarUrl: profile.avatarUrl,
        totalFollowers: profile.totalNumberOfFollowers,
        totalFollowing: profile.totalNumberOfFollowing,
        joinDate: profile.createdAt,
      },
      stats: {
        yearsOnPlatform,
        monthsOnPlatform,
        daysOnPlatform,
        totalWorkbooks: workbooksData.contents.length,
        totalViews,
        totalFavorites,
      },
      workbooks: workbooksData.contents,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch Tableau data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    const requestData: TableauRequestData = await request.json();
    const response = await fetch(requestData.url, {
      method: requestData.method,
      headers: requestData.headers,
      body: requestData.body
    });
    
    const data: TableauApiResponse = await response.json();
    return Response.json(data);
    
  } catch (error) {
    const errorResponse: ErrorResponse = {
      error: error instanceof Error ? error.message : 'An unknown error occurred',
      status: 500
    };
    return Response.json(errorResponse, { status: 500 });
  }
} 