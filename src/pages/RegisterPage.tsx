import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/authServices';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { isAxiosError } from 'axios';
const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    try {
      await register(name, email, password);
      navigate('/login');
    } catch (err: unknown) {
      const message = isAxiosError(err)
        ? err.response?.data?.message ?? 'Registration failed'
        : err instanceof Error
          ? err.message
          : 'Registration failed';
      setError(message);
    }
  };
  return (
    <div className="min-h-[90vh] flex bg-black px-4 relative">
      {/* Left blurred shape */}
      <div
        className="absolute left-0"
        style={{
          width: '220.18px',
          height: '256.88px',
          backgroundColor: '#CCF575',
          opacity: 0.43,
          filter: 'blur(150px)',
          marginTop: '950px',
          zIndex: 0,
        }}
      />
      {/* Right blurred shape */}
      <div
        className="absolute top-0 left-[668px]"
        style={{
          width: '220px',
          height: '256px',
          backgroundColor: '#CCF575',
          opacity: 0.43,
          filter: 'blur(150px)',
          marginTop: '130px',
          marginLeft: '80px',
          zIndex: 1000,
        }}
      />
      {/* LEFT: Registration form */}
      <div className="flex-1 p-8 relative z-10 flex items-center justify-center min-h-[180vh]">
        <Card className="w-full max-w-[496px] p-8 flex flex-col gap-6 bg-transparent border-none shadow-none">
          <CardHeader className="text-center" style={{ marginBottom: '20px', paddingBottom: '0', position: 'relative' }}>
            <CardTitle
              className="text-[40px] font-bold"
              style={{
                fontFamily: 'Inter,sans-serif',
                fontWeight: 700,
                fontStyle: 'Bold',
                lineHeight: '113%',
                letterSpacing: '1%',
                color: '#FFFFFF',
                width: '465px',
                marginTop: '-290px',
                marginLeft: '-150px'
              }}
            >
              Sign up to begin journey
            </CardTitle>
            <CardDescription
              className="text-[20px] break-words"
              style={{
                fontFamily: 'Mukta',
                fontSize: '20px',
                fontWeight: 400,
                lineHeight: '30px',
                letterSpacing: '-0.17px',
                color: '#A7A7A7',
              }}
            >
            </CardDescription>
          </CardHeader>
          <CardContent style={{ marginTop: '-100px' }}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 -mt-30">
              {/* Name Input */}
              <div className="flex flex-col gap-2 -ml-35">
                <label
                  htmlFor="name"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 500,
                    fontSize: '16px',
                    lineHeight: '120%',
                    color: '#E5E5E5',
                  }}
                >
                  Enter your name
                </label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter Name"
                  required
                  className="w-[496px] h-[60px] px-2 py-5 rounded-md border border-[#424647]
                             bg-[#202020] text-[#B8B8B8] font-poppins text-sm -ml-1"
                />
                <label
                  htmlFor="name"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 400,
                    fontSize: '14px',
                    lineHeight: '120%',
                    color: '#B8B8B8',
                  }}
                >
                  This name will be displayed with your inquiry
                </label>
              </div>
              {/* Email Input */}
              <div className="flex flex-col gap-2 -ml-35">
                <label
                  htmlFor="email"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 500,
                    fontSize: '16px',
                    lineHeight: '120%',
                    color: '#E5E5E5',
                  }}
                >
                  Enter Address
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Email ID"
                  required
                  className="w-[496px] h-[60px] px-2 py-5 rounded-md border border-[#424647]
                             bg-[#202020] text-[#B8B8B8] font-poppins text-sm"
                />
              </div>
              {/* Password Input */}
              <div className="flex flex-col gap-2 -ml-35">
                <label htmlFor="password" className="text-sm font-medium text-gray-200">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter the password"
                  required
                  className="w-full h-[60px] px-2 py-5 rounded-md border border-[#424647]
                             bg-[#202020] text-[#B8B8B8] font-poppins text-sm"
                />
              </div>
              {/* Confirm Password Input */}
              <div className="flex flex-col gap-2 -ml-35">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-200">
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm the password"
                  required
                  className="w-full h-[60px] px-2 py-5 rounded-md border border-[#424647]
                             bg-[#202020] text-[#B8B8B8] font-poppins text-sm"
                />
              </div>
              <label
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 500,
                  fontSize: '16px',
                  lineHeight: '120%',
                  color: '#E5E5E5',
                  marginLeft: '-140px'
                }}
              >
                Any further updates will be forwarded on this Email ID
              </label>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {/* Register + Already have account side by side */}
              <div className="flex items-center gap-4 mt-6">
                <Button
                  type="submit"
                  style={{
                    width: '100.83px',
                    height: '48.87px',
                    gap: '9.96px',
                    borderRadius: '7.47px',
                    padding: '14.94px 19.91px',
                    background: 'linear-gradient(90.12deg, #141414 -6.53%, #303030 0.64%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#c3e979',
                    fontFamily: 'Inter, sans-serif',
                    marginLeft: '-140px'
                  }}
                >
                  Register
                </Button>
                <div className="text-sm text-gray-300 flex items-center ml-15">
                  Already have an account?{' '}
                  <button
                    onClick={() => navigate('/login')}
                    className="ml-1 text-blue-600 hover:underline"
                  >
                    Login
                  </button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      {/* RIGHT: Image panel */}
      <div
        className="hidden md:flex items-center justify-center"
        style={{
          width: '830px',
          height: '733px',
          background: '#2F2F2F',
          borderTopLeftRadius: '60px',
          borderBottomLeftRadius: '60px',
          marginTop: '190.5px',
          marginLeft: '0',
          overflow: 'hidden',
        }}
      >
        <img
          src="/Free_billbord.png"
          alt="Billboard"
          className="w-full h-full object-cover"
          style={{ opacity: 1 }}
        />
      </div>
    </div>
  );
};
export default RegisterPage;