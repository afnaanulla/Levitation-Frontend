import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../app/hooks';
import { setCredentials } from '../features/authSlice';
import { login } from '../services/authServices';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { isAxiosError } from 'axios';

const images = [
  '/imgeeee.png', // first image
  '/imagee.jpg',  // second image
];

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const sliderRef = useRef<HTMLDivElement | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const userData = await login(email, password);
      dispatch(setCredentials(userData));
      navigate('/add-product');
    } catch (err: unknown) {
      const message = isAxiosError(err)
        ? err.response?.data?.message ?? 'Login failed'
        : err instanceof Error
        ? err.message
        : 'Login failed';
      setError(message);
    }
  };

  // Auto-scroll slider
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % images.length;
      slider.scrollTo({
        left: index * 523, // image width
        behavior: 'smooth',
      });
    }, 6000); // 6s delay

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-8 gap-12">
      {/* LEFT: Scrollable + auto slider */}
      <div
        ref={sliderRef}
        className="flex overflow-x-scroll scrollbar-hide gap-5 scroll-smooth"
        style={{
          width: '616px',
          height: '744px',
          borderRadius: '40px',
          scrollSnapType: 'x mandatory',
        }}
      >
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`slide-${index}`}
            className="w-[523px] h-[744px] rounded-[40px] object-cover flex-shrink-0"
            style={{ scrollSnapAlign: 'center', background: '#2F2F2F' }}
          />
        ))}
      </div>

      {/* RIGHT: Login box */}
      <div
        className="flex flex-col items-center bg-transparent text-white"
        style={{
          width: '565px',
          height: '578px',
          gap: '44px',
        }}
      >
        {/* Logo */}
        <img
          src="/LogoWhite.svg"
          alt="Levitation Logo"
          style={{
            width: '215px',
            height: '73px',
          }}
        />

        {/* Title + subtitle */}
        <div className="text-center" style={{ width: '500px' }}>
          <h1 className="text-[40px] font-bold">Let the journey begin</h1>
          <p className="text-gray-400 text-[18px]">
            This is a basic login page which is used for the Levitation
            assessment purpose
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 w-full max-w-[500px]"
        >
          {/* Email */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-300">Email Address</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Email ID"
              required
              className="h-[48px] rounded-md border border-[#424647] bg-[#202020] text-[#B8B8B8]"
            />
            <span className="text-xs text-gray-400">
              This email will be displayed with your inquiry
            </span>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-300">Current Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter the password"
              required
              className="h-[48px] rounded-md border border-[#424647] bg-[#202020] text-[#B8B8B8]"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Login button + forgot password */}
          <div className="flex items-center justify-between mt-2">
            <Button
              type="submit"
              className="rounded-md"
              style={{
                width: '274px',
                height: '48px',
                background:
                  'linear-gradient(90.12deg, #141414 -6.53%, #303030 0.64%)',
                color: '#c3e979',
              }}
            >
              Login Now
            </Button>
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="text-blue-500 hover:underline text-sm"
            >
              Forgot Password?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
