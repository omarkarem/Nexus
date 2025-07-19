import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { buildApiUrl } from '../config/api';

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('');
  
  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link. No token provided.');
      return;
    }
    
    verifyEmail(token);
  }, [searchParams]);
  
  const verifyEmail = async (token) => {
    try {
      const response = await fetch(buildApiUrl('/api/auth/verify-email'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setStatus('success');
        setMessage('Email verified successfully! You can now access all features.');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setStatus('error');
        setMessage(data.message || 'Email verification failed.');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setStatus('error');
      setMessage('Unable to connect to server. Please try again later.');
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-glass backdrop-blur-md rounded-3xl p-8 shadow-xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-turquoise rounded-full flex items-center justify-center mx-auto mb-4">
            {status === 'verifying' && (
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            )}
            {status === 'success' && (
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
            {status === 'error' && (
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
          
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            {status === 'verifying' && 'Verifying Email...'}
            {status === 'success' && 'Email Verified!'}
            {status === 'error' && 'Verification Failed'}
          </h1>
        </div>
        
        {/* Message */}
        <div className="text-center mb-8">
          <p className={`text-sm ${
            status === 'success' ? 'text-green-400' : 
            status === 'error' ? 'text-red-400' : 
            'text-text-secondary'
          }`}>
            {message}
          </p>
          
          {status === 'success' && (
            <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <p className="text-green-400 text-sm">
                🎉 Welcome to Nexus! Redirecting to login page...
              </p>
            </div>
          )}
        </div>
        
        {/* Actions */}
        <div className="space-y-4">
          {status === 'success' && (
            <Link
              to="/login"
              className="w-full py-3 px-4 bg-gradient-turquoise text-primary font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg shadow-turquoise/20 flex items-center justify-center"
            >
              Continue to Login
            </Link>
          )}
          
          {status === 'error' && (
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full py-3 px-4 bg-gradient-aurora text-primary font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg shadow-aurora/20"
              >
                Try Again
              </button>
              
              <Link
                to="/login"
                className="w-full py-3 px-4 border border-glass-border text-text-secondary font-semibold rounded-full transition-all duration-300 hover:bg-glass-light flex items-center justify-center"
              >
                Back to Login
              </Link>
            </div>
          )}
          
          {status === 'verifying' && (
            <div className="text-center">
              <div className="inline-flex items-center text-text-secondary text-sm">
                <div className="w-4 h-4 border-2 border-text-secondary border-t-transparent rounded-full animate-spin mr-2"></div>
                Please wait while we verify your email...
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-text-muted text-xs">
            Having trouble? <Link to="/signup" className="text-aurora hover:underline">Contact support</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail; 