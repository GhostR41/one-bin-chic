import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { signInWithGoogle } from '@/utils/auth';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Shield, Chrome } from 'lucide-react';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, loginAsViewer } = useAuth();

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate('/', { replace: true });
    return null;
  }

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithGoogle();
      
      if (result.success) {
        toast({
          title: "Welcome Admin!",
          description: "Successfully authenticated with Google.",
        });
        navigate('/', { replace: true });
      } else {
        toast({
          title: "Access Denied",
          description: result.error || "You are not authorized to access this application.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Authentication Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Secure Access
          </h1>
          <p className="text-muted-foreground">
            Authenticated access only
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-8 shadow-xl">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Login To Access</h3>
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">Full Control</p>
                  <p>Admin can edit and manage all portfolio content in real-time.</p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full h-12 text-base font-semibold"
              size="lg"
            >
              <Chrome className="w-5 h-5 mr-2" />
              {loading ? 'Authenticating...' : 'Admin Sign in with Google'}
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            Secured with Firebase Authentication & Google OAuth 2.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
