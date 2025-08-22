import { useState } from 'react';
import { isAxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { clearProducts } from '../features/productSlice';
import { generateInvoice } from '../services/invoiceService';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import html2pdf from 'html2pdf.js';
import './GeneratePdfPage.css'; // 👈 add CSS file
const GeneratePDFPage = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const products = useAppSelector((state) => state.products.products);
  const user = useAppSelector((state) => state.auth.userInfo);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const subtotal = products.reduce((sum, product) => sum + product.total, 0);
  const gstAmount = products.reduce((sum, product) => sum + product.gst, 0);
  const grandTotal = subtotal + gstAmount;
  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    setError('');
  
    try {
      const invoiceElement = document.getElementById("invoice-preview");
      if (!invoiceElement) throw new Error("Invoice Preview Not Found");
  
      const options = {
        margin: 10,
        filename: `invoice_${new Date().toISOString().slice(0, 10)}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      
      await html2pdf().set(options).from(invoiceElement).save();
  
      const pdfBlob = await generateInvoice(products);
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice_${new Date().toISOString().slice(0, 10)}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
  
      dispatch(clearProducts());
      navigate('/add-product');
    } catch (err: unknown) {
      const message = isAxiosError(err)
        ? err.response?.data?.message ?? ''
        : err instanceof Error
          ? err.message
          : 'Failed to generate PDF';
      setError(message);
    } finally {
      setIsGenerating(false);
    }
  };
  return (
    <div
      className="min-h-screen flex items-center justify-center px-[4vw] gap-[4vw] w-full bg-black"
      style={{ backgroundColor: "#000000" }}
    >
      <style>
        {`
          @keyframes fadein {
            from { opacity: 0; transform: translateY(40px);}
            to { opacity: 1; transform: translateY(0);}
          }
          .animate-fadein {
            animation: fadein 0.8s cubic-bezier(0.4,0,0.2,1) both;
          }
          .btn-animate {
            transition: transform 0.2s cubic-bezier(0.4,0,0.2,1), box-shadow 0.2s;
          }
          .btn-animate:hover {
            transform: scale(1.04) translateY(-2px);
            box-shadow: 0 6px 24px 0 #c3e97944;
          }
        `}
      </style>
      <div
        className="min-h-[80vh] py-[4vh] w-[90%] max-w-[1200px] bg-black animate-fadein"
        style={{ backgroundColor: "black", borderRadius: '2vw' }}
      >
        <div className="max-w-4xl mx-auto px-[2vw] min-h-[60vh] bg-black">
          <Card>
            <CardHeader>
              <CardTitle style={{ color: 'white', fontSize: '2vw' }}>Invoice Preview</CardTitle>
              <CardDescription style={{ color: 'white' }}>
                Review your invoice details before generating the PDF
              </CardDescription>
            </CardHeader>
            <CardContent
              id="invoice-preview"
              style={{
                position: 'relative',
                backgroundColor: "#ffffff",
                borderRadius: '1vw',
                minHeight: '60vh',
              }}
            >
              <div
                className="border rounded-lg p-[3vw] h-full"
                style={{ backgroundColor: "#ffffff", borderColor: "#d1d5db" }}
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-[4vh]">
                  <div>
                    <img src="/logo.png" alt="Invoice" className="h-10 w-auto" />
                  </div>
                  <div className="text-right">
                    <h3 className="text-lg font-semibold" style={{ color: "#111827" }}>INVOICE GENERATOR</h3>
                  </div>
                </div>
                <hr style={{ borderTop: "2px solid #d1d5db", marginBottom: "2rem" }} />
                {/* User Info Box */}
                <div
                  className="w-[90%] max-w-[620px] h-[95px] rounded-[10px] opacity-100 flex flex-col justify-center px-6 mb-8"
                  style={{
                    background: "linear-gradient(90.77deg, #0F0F0F 10.65%, #303661 114.19%)",
                    color: "#ffffff"
                  }}
                >
                  <div className="flex justify-between text-sm font-medium">
                    <span style={{ color: 'rgba(204, 204, 204, 0.8)' }}>Name</span>
                    <span style={{ fontSize: '12px', color: '#CCCCCC' }}>Date: {new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span style={{ color: "#CCF575" }}>
                      {user?.name ?? "Guest User"}
                    </span>
                    <span
                      style={{
                        background: "#FFFFFF",
                        color: "#000000",
                        borderRadius: "28px",
                        padding: "5px 12px",
                        fontSize: "12px",
                      }}
                    >
                      {user?.email ?? "No email"}
                    </span>
                  </div>
                </div>
                {/* Table Header */}
                <div
                  style={{
                    width: "90%",
                    maxWidth: "620px",
                    height: "32px",
                    display: "flex",
                    alignItems: "center",
                    borderRadius: "10px",
                    padding: "10px",
                    background:
                      "linear-gradient(90.77deg, #303661 10.65%, #263406 114.19%)",
                    color: "#ffffff",
                  }}
                >
                  <div className="px-4 text-left text-xs font-medium" style={{ width: "30%" }}>Product</div>
                  <div className="px-4 text-center text-xs font-medium" style={{ width: "15%", marginLeft: '5px' }}>Qty</div>
                  <div className="px-4 text-center text-xs font-medium" style={{ width: "20%", marginLeft: '5vw' }}>Rate</div>
                  <div className="px-4 text-right text-xs font-medium" style={{ width: "30%", marginLeft: '2vw' }}>Total-Amount</div>
                </div>
                {/* Table */}
                <table className="border-separate" style={{ tableLayout: "fixed", width: "90%", maxWidth: "620px", borderSpacing: "0 10px" }}>
                  <tbody>
                    {products.map((product, index) => (
                      <tr key={product.id}
                        style={{ backgroundColor: index % 2 === 0 ? "#ffffff" : "#fafafa" }}>
                        <td className="px-4 py-3 text-sm" style={{ width: "30%", borderTopLeftRadius: "20px", borderBottomLeftRadius: "20px" }}>
                          {product.name}
                        </td>
                        <td className="px-4 py-3 text-sm" style={{ width: "15%", textAlign: "center" }}>
                          {product.qty}
                        </td>
                        <td className="px-4 py-3 text-sm" style={{ width: "20%", textAlign: "center" }}>
                          {product.rate.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-sm" style={{ width: "30%", textAlign: "right", borderTopRightRadius: "20px", borderBottomRightRadius: "20px" }}>
                          INR {product.total.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* Add spacing between table and total box */}
                <div style={{ height: "4vh" }}></div>
                {/* Totals Box - Only show when products exist */}
                {products.length > 0 && (
                  <div
                    style={{
                      width: "40%",
                      minWidth: "220px",
                      maxWidth: "253px",
                      height: "104px",
                      borderRadius: "8px",
                      border: "1px solid #A2A2A2",
                      padding: "12px",
                      marginTop: "2vh",
                      background: "#FFFFFF",
                      marginLeft: 'auto'
                    }}
                  >
                    <div className="flex justify-between text-sm">
                      <span style={{ color: '#0A0A0A8C', fontFamily: 'Inter, sans-serif' }}>Total Charges</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span style={{ color: '#0A0A0A8C', fontFamily: 'Inter, sans-serif' }}>GST (18%)</span>
                      <span>₹{gstAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold">
                      <span style={{ color: '#0A0A0A' }}>Total Amount</span>
                      <span style={{ color: '#175EE2' }}>₹{grandTotal.toFixed(2)}</span>
                    </div>
                  </div>
                )}
                {/* New section with date and message */}
                {products.length > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4vh', width: '90%', maxWidth: '620px' }}>
                    <div style={{ color: '#111827', fontSize: '14px' }}>
                      Date: {new Date().toLocaleDateString()}
                    </div>
                  </div>
                )}
                {error && <p style={{ color: "#ef4444" }} className="mt-4 text-center">{error}</p>}
              </div>
            </CardContent>
          </Card>
          {/* Buttons outside preview (hidden in PDF) */}
          <div className="flex justify-between mt-[6vh] no-print">
            <Button
              variant="outline"
              onClick={() => navigate("/add-product")}
              className="btn-animate"
              style={{ color: 'red', minWidth: '120px', height: '6vh', borderRadius: '0.5vw', fontSize: '1vw' }}
            >
              Back to Edit
            </Button>
            <Button
              onClick={handleGeneratePDF}
              disabled={isGenerating || products.length === 0}
              className="btn-animate"
              style={{ backgroundColor: '#c6ed76', minWidth: '160px', height: '6vh', borderRadius: '0.5vw', fontSize: '1vw', color: '#222' }}
            >
              {isGenerating ? "Generating..." : "Generate PDF"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default GeneratePDFPage;