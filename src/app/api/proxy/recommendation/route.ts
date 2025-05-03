import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'https://coinspire-ai.onrender.com';
const AI_SERVICE_API_KEY = process.env.RECOMMENDER_API_KEY;
const AI_SERVICE_TIMEOUT = parseInt(process.env.AI_SERVICE_TIMEOUT || '30000', 10);

export async function GET(request: NextRequest) {

  if (!AI_SERVICE_API_KEY) {
    console.error('CRITICAL: AI_SERVICE_API_KEY is not defined in the Next.js server environment.');

    return NextResponse.json({ error: 'Internal Server Error: API Key configuration missing.' }, { status: 500 });
  }

  try {

    const { searchParams } = new URL(request.url);
    const keywords = searchParams.get('keywords');
    const style = searchParams.get('style');
    const count = searchParams.get('count');


    const params: Record<string, string | null> = { keywords, style, count };

    console.log(`Proxying request to: ${AI_SERVICE_URL}/api/recommendation with params:`, params);

    const backendResponse = await axios.get(`${AI_SERVICE_URL}/api/recommendation`, {
      params: params,
      headers: {
        'X-API-Key': AI_SERVICE_API_KEY,
        'Accept': 'application/json',
      },
      timeout: AI_SERVICE_TIMEOUT 
    });

    return NextResponse.json(backendResponse.data, { status: backendResponse.status });

  } catch (error: any) {
    console.error('Error proxying request to AI service:', error.message);

    if (axios.isAxiosError(error) && error.response) {
      console.error('Backend API Error:', error.response.status, error.response.data);
      const errorData = typeof error.response.data === 'object' ? error.response.data : { error: 'Backend API request failed', details: String(error.response.data) };
      return NextResponse.json(errorData, { status: error.response.status });
    } else {
      console.error('Unknown Proxy Error:', error);
      return NextResponse.json({ error: 'Failed to proxy request to AI service', details: error.message }, { status: 500 });
    }
  }
}
