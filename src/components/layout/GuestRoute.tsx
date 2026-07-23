import { Navigate, Outlet } from 'react-router';

/**
 * GuestRoute: Prevents authenticated users from accessing auth pages
 * - Allows password recovery flow (type=recovery hash) to pass through
 * - Redirects authenticated users to dashboard (unless recovery flow)
 * - Pure render-based guard (no state updates in render phase)
 */
export default function GuestRoute() {
    const token =
        localStorage.getItem('token') ||
        sessionStorage.getItem('token');

    // Allow password recovery flows to pass through regardless of auth state
    const isRecoveryFlow =
        window.location.hash.includes('type=recovery');

    // If user is authenticated and NOT in recovery flow, redirect to dashboard
    if (token && !isRecoveryFlow) {
        return <Navigate to="/projects" replace />;
    }

    return <Outlet />;
}

// expired token for testing the routing problem
/*
eyJhbGciOiJFUzI1NiIsImtpZCI6IjJhYjc2ODExLTc5ZDMtNGI5My05ZDMyLWVkMTk1NjAzMWVkZCIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2RlaG9tb2t1am9vZGR2b3NycHpqLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiI0YzRjZDgzMi1jOTQ1LTRiZmMtYmQxMi03NDk1NWYwYzhkNWQiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzg0Nzg2NTI0LCJpYXQiOjE3ODQ3ODI5MjQsImVtYWlsIjoiYWJkdWxyYWhtYW4uc2hhd2t5bUBnbWFpbC5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7ImVtYWlsIjoiYWJkdWxyYWhtYW4uc2hhd2t5bUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiam9iX3RpdGxlIjoiIiwibmFtZSI6IkFiZHVscmFobWFuIFNoYXdreSIsInBob25lX3ZlcmlmaWVkIjpmYWxzZSwic3ViIjoiNGM0Y2Q4MzItYzk0NS00YmZjLWJkMTItNzQ5NTVmMGM4ZDVkIn0sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoicGFzc3dvcmQiLCJ0aW1lc3RhbXAiOjE3ODQ3ODI5MjR9XSwic2Vzc2lvbl9pZCI6IjYwNDEwMDU1LWVkZjMtNGIzMC04MDY4LTE2NTFlMjI4NWFkNyIsImlzX2Fub255bW91cyI6ZmFsc2V9.bdADtFrSLr0sVdYTzWGWPoVt_NNs6143OOuMrDoQO6yzY_Pn9yhgJuBj461piS6vcCgCap2Ta2l2jpzCRuuzcg 
*/
