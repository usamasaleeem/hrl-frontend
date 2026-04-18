import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useStore } from '../../../store/useStore';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { BriefcaseIcon, UserIcon } from 'lucide-react';
import { motion } from 'motion/react';
import logo from '../../../images/logo.svg';

import axios from 'axios';
export function SignupPage() {
  const navigate = useNavigate();
  const setUser = useStore((state) => state.setUser);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'employer' | 'candidate' | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;

    try {
      setLoading(true);
      setError('');

      const { data } = await axios.post(
        'http://localhost:3000/api/auth/register', // updated port + route
        {
          name,
          email,
          password,
          role: selectedRole,
        }
      );

      // Save user
      setUser({
        id: data.user._id,
        email: data.user.email,
        role: data.user.role,
        name: data.user.name,
      });

      // Save token
      localStorage.setItem('token', data.token);

      navigate('/dashboard');
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || 'Signup failed'
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-6"
      >
        <div className="text-center space-y-2">
        <img
           src={logo}
           alt="Intervo AI"
           className="mx-auto h-10 w-auto object-contain transition-all duration-300"
         />  <p className="text-gray-600">Create your account</p>
        </div>

        <Card className="border-gray-200 shadow-lg">
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>Sign up to start using AI Interviewer</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>I am a...</Label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('employer')}
                    className={`p-4 border-2 rounded-lg transition-all ${selectedRole === 'employer'
                        ? 'border-black bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <BriefcaseIcon className="mx-auto mb-2 h-6 w-6" />
                    <div className="text-sm">Employer</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole('candidate')}
                    className={`p-4 border-2 rounded-lg transition-all ${selectedRole === 'candidate'
                        ? 'border-black bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <UserIcon className="mx-auto mb-2 h-6 w-6" />
                    <div className="text-sm">Candidate</div>
                  </button>
                </div>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}

              <Button type="submit" className="w-full" disabled={!selectedRole || loading}>
                {loading ? 'Creating...' : 'Create Account'}
              </Button>
              <div className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-black hover:underline"
                >
                  Sign in
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
