import { NextResponse } from 'next/server';

export async function GET() {
  // Comprehensive environment variable check
  const envCheck = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    variables: {
      API_URL: {
        value: process.env.API_URL,
        isSet: !!process.env.API_URL,
        isCorrect: process.env.API_URL === 'https://server-psi-lake-59.vercel.app'
      },
      NEXT_PUBLIC_API_URL: {
        value: process.env.NEXT_PUBLIC_API_URL,
        isSet: !!process.env.NEXT_PUBLIC_API_URL,
        isCorrect: process.env.NEXT_PUBLIC_API_URL === 'https://server-psi-lake-59.vercel.app'
      }
    },
    diagnosis: {
      allVariablesSet: false,
      allVariablesCorrect: false,
      readyForProduction: false
    }
  };

  // Check if all variables are set and correct
  const apiUrlOk = envCheck.variables.API_URL.isSet && envCheck.variables.API_URL.isCorrect;
  const publicApiUrlOk = envCheck.variables.NEXT_PUBLIC_API_URL.isSet && envCheck.variables.NEXT_PUBLIC_API_URL.isCorrect;

  envCheck.diagnosis.allVariablesSet = envCheck.variables.API_URL.isSet && envCheck.variables.NEXT_PUBLIC_API_URL.isSet;
  envCheck.diagnosis.allVariablesCorrect = apiUrlOk && publicApiUrlOk;
  envCheck.diagnosis.readyForProduction = envCheck.diagnosis.allVariablesCorrect;

  // Add recommendations
  envCheck.recommendations = [];
  
  if (!envCheck.variables.API_URL.isSet) {
    envCheck.recommendations.push('Set API_URL in Vercel environment variables');
  } else if (!envCheck.variables.API_URL.isCorrect) {
    envCheck.recommendations.push(`API_URL should be 'https://server-psi-lake-59.vercel.app', currently: '${envCheck.variables.API_URL.value}'`);
  }

  if (!envCheck.variables.NEXT_PUBLIC_API_URL.isSet) {
    envCheck.recommendations.push('Set NEXT_PUBLIC_API_URL in Vercel environment variables');
  } else if (!envCheck.variables.NEXT_PUBLIC_API_URL.isCorrect) {
    envCheck.recommendations.push(`NEXT_PUBLIC_API_URL should be 'https://server-psi-lake-59.vercel.app', currently: '${envCheck.variables.NEXT_PUBLIC_API_URL.value}'`);
  }

  if (envCheck.diagnosis.readyForProduction) {
    envCheck.recommendations.push('✅ All environment variables are correctly set!');
  } else {
    envCheck.recommendations.push('❌ Fix environment variables in Vercel dashboard and redeploy');
  }

  return NextResponse.json(envCheck, {
    status: envCheck.diagnosis.readyForProduction ? 200 : 400
  });
}