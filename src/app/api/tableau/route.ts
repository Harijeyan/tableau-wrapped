import { NextResponse } from 'next/server';
import { logUsername } from '@/utils/logger';

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
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    // Log the username
    await logUsername(username);

    // Get profile data
    let profileData;
    try {
      const profileResponse = await fetch(`https://public.tableau.com/profile/api/${username}`);
      if (!profileResponse.ok) {
        throw new Error(`Profile API failed with status: ${profileResponse.status}`);
      }
      profileData = await profileResponse.json();
    } catch (error) {
      console.error('Profile API Error:', error);
      return NextResponse.json({ error: 'Failed to fetch profile data' }, { status: 500 });
    }

    // Fetch all workbooks using 'next' pagination
    let totalViews = 0;
    let totalFavorites = 0;
    let fetchError = false;
    let nextStart = 0;

    while (nextStart !== null) {
      try {
        const workbooksResponse = await fetch(
          `https://public.tableau.com/public/apis/workbooks?profileName=${username}&start=${nextStart}&count=50&visibility=NON_HIDDEN`
        );
        
        if (!workbooksResponse.ok) {
          throw new Error(`Workbooks API failed with status: ${workbooksResponse.status} for start=${nextStart}`);
        }

        const responseData = await workbooksResponse.json();
        
        // Check if the response has the expected structure
        if (!responseData || !Array.isArray(responseData.contents)) {
          console.error('Unexpected API response structure:', responseData);
          throw new Error('Invalid API response format');
        }
        
        // Sum up the views and favorites from this batch
        responseData.contents.forEach((wb: any) => {
          totalViews += wb.viewCount || 0;
          totalFavorites += wb.numberOfFavorites || 0;
        });

        // Get next start value for pagination
        nextStart = responseData.next;

      } catch (error) {
        console.error(`Batch Error at start=${nextStart}:`, error);
        fetchError = true;
        break; // Stop processing on first error
      }
    }

    const joinDate = new Date(profileData.createdAt);
    const now = new Date();
    const yearsOnPlatform = now.getFullYear() - joinDate.getFullYear();
    const monthsOnPlatform = now.getMonth() - joinDate.getMonth();
    const daysOnPlatform = now.getDate() - joinDate.getDate();

    const response = {
      profile: {
        name: profileData.name,
        profileName: profileData.profileName,
        title: profileData.title,
        organization: profileData.organization,
        avatarUrl: profileData.avatarUrl,
        totalFollowers: profileData.totalNumberOfFollowers,
        totalFollowing: profileData.totalNumberOfFollowing,
        joinDate: profileData.createdAt,
      },
      stats: {
        yearsOnPlatform: yearsOnPlatform,
        monthsOnPlatform: monthsOnPlatform,
        daysOnPlatform: daysOnPlatform,
        totalWorkbooks: profileData.visibleWorkbookCount,
        totalViews: totalViews,
        totalFavorites: totalFavorites
      },
      generatedAt: new Date().toISOString()
    };

    if (fetchError) {
      return NextResponse.json({
        ...response,
        warning: 'Some workbook data could not be fetched. Totals may be incomplete.'
      }, { status: 206 }); // 206 Partial Content
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('Unexpected Error:', error);
    return NextResponse.json({ 
      error: 'An unexpected error occurred',
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