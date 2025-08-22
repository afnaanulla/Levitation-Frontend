import { Button } from "../ui/button"
import { Link, useLocation } from "react-router-dom"
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isLoginPage = location.pathname === "/login";
  const isAddProductPage = location.pathname === "/add-product";
  const isGeneratePDFPage = location.pathname ==="/generate-pdf";
  if(isGeneratePDFPage) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 w-screen z-50">
      <nav
        className="w-screen h-22 flex items-center justify-between px-6
                   bg-[#1f1f1f]/[0.95] border-b border-[#2c2c2c7d] 
                   backdrop-blur-[32px] shadow-[2px_4px_4px_0px_#0000001F]"
      >
        {/* Logo */}
        <div className="flex items-center gap-2 h-[156px] w-[145px] ml-20">
          <img src="/LogoWhite.svg" alt="Logo" className="h-12 w-auto" />
          <span className="text-white text-lg font-medium font-sans"></span>
        </div>

        {/* Right Side Button */}
        {isLoginPage ? (
          <Button
            variant="outline"
            className="bg-[#c3e979] text-black border-[#c3e979] 
                       hover:bg-[#b8d96d] hover:border-[#b8d96d] font-medium mr-20"
          >
            Connect with Technology
          </Button>
        ) : isAddProductPage ? (
          <Button
            variant="outline"
            className=" text-black bg-[#CCF557] 
                        font-medium mr-20"
                        onClick={() => navigate('/login')}
          >
            Logout
          </Button>
        ) : (
          <Link to="/login">
            <Button
              variant="outline"
              className="bg-[#c3e979] text-black border-[#c3e979] 
                         hover:bg-[#b8d96d] hover:border-[#b8d96d] font-medium mr-20"
            >
              Login
            </Button>
          </Link>
        )}
      </nav>
    </div>
  );
}
