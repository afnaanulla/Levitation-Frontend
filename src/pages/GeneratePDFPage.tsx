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
    <div className="min-h-[180vh] flex items-center justify-center px-8 gap-12 w-full bg-black"
     style={{ backgroundColor: "#000000" }}>
      <div className="min-h-[200vh] py-8 w-[1200px] bg-black"
          style={{ backgroundColor: "black" }}>
        <div className="max-w-4xl mx-auto px-4 min-h-[800px] bg-black">
          <Card>
            <CardHeader>
              <CardTitle style={{color: 'white'}}>Invoice Preview</CardTitle>
              <CardDescription style={{color: 'white'}}>
                Review your invoice details before generating the PDF
              </CardDescription>
            </CardHeader>
            <CardContent id="invoice-preview" style={{ position: 'relative', backgroundColor: "#ffffff" }}>
              <div className="border rounded-lg p-6 h-full" style={{ backgroundColor: "#ffffff", borderColor: "#d1d5db" }}>
                
                {/* Header */}
                <div className="flex justify-between items-start mb-8">
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
                  className="w-[620px] h-[95px] rounded-[10px] opacity-100 flex flex-col justify-center px-6 mb-8"
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
                    width: "620px",
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
                  <div className="px-4 text-left text-xs font-medium" style={{ width: "150px" }}>Product</div>
                  <div className="px-4 text-center text-xs font-medium" style={{ width: "100px", marginLeft: '5px' }}>Qty</div>
                  <div className="px-4 text-center text-xs font-medium" style={{ width: "100px", marginLeft: '60px' }}>Rate</div>
                  <div className="px-4 text-right text-xs font-medium" style={{ width: "150px", marginLeft: '20px' }}>Total-Amount</div>
                </div>
                {/* Table */}
                <table className="border-separate" style={{ tableLayout: "fixed", width: "620px", borderSpacing: "0 10px" }}>
                  <tbody>
                    {products.map((product, index) => (
                      <tr key={product.id}
                        style={{ backgroundColor: index % 2 === 0 ? "#ffffff" : "#fafafa" }}>
                        <td className="px-4 py-3 text-sm" style={{ width: "150px", borderTopLeftRadius: "20px", borderBottomLeftRadius: "20px" }}>
                          {product.name}
                        </td>
                        <td className="px-4 py-3 text-sm" style={{ width: "100px", textAlign: "center", paddingRight: '90px' }}>
                          {product.qty}
                        </td>
                        <td className="px-4 py-3 text-sm" style={{ width: "100px", textAlign: "center" }}>
                          {product.rate.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-sm" style={{ width: "150px", textAlign: "right", borderTopRightRadius: "20px", borderBottomRightRadius: "20px", paddingRight: '55px' }}>
                          INR {product.total.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {/* Add spacing between table and total box */}
                <div style={{ height: "40px" }}></div>
                
                {/* Totals Box - Only show when products exist */}
                {products.length > 0 && (
                  <div
                    style={{
                      width: "253px",
                      height: "104px",
                      borderRadius: "8px",
                      border: "1px solid #A2A2A2",
                      padding: "12px",
                      marginTop: "20px", // Added margin
                      background: "#FFFFFF",
                      marginLeft: '355px'
                    }}
                  >
                    <div className="flex justify-between text-sm">
                      <span style={{color:'#0A0A0A8C', fontFamily: 'Inter, sans-serif'}}>Total Charges</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span style = {{color: '#0A0A0A8C', fontFamily: 'Inter, sans-serif'}}>GST (18%)</span>
                      <span>₹{gstAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold">
                      <span style={{color: '#OAOAOA'}}>Total Amount</span>
                      <span style={{color: '#175EE2'}}>₹{grandTotal.toFixed(2)}</span>
                    </div>
                  </div>
                )}
                
                {/* New section with date and message */}
                {products.length > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '40px', width: '620px' }}>
                    <div style={{ color: '#111827', fontSize: '14px' }}>
                      Date: {new Date().toLocaleDateString()}
                    </div>
                    {/* <div
                      style={{
                        width: '463px',
                        height: '46px',
                        borderRadius: '40px',
                        padding: '10px 30px',
                        background: '#272833',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        fontSize: '11px',
                        lineHeight: '1.2'
                      }}
                    >
                      We are pleased to provide any further information you may require and look forward to assisting with your next order. Rest assured, it will receive our prompt and dedicated attention.
                    </div> */}
                  </div>
                )}
                
                {error && <p style={{ color: "#ef4444" }} className="mt-4 text-center">{error}</p>}
              </div>
            </CardContent>
          </Card>
          {/* Buttons outside preview (hidden in PDF) */}
          <div className="flex justify-between mt-12 no-print">
            <Button variant="outline" onClick={() => navigate("/add-product")} style={{color: 'red'}}>
              Back to Edit
            </Button>
            <Button onClick={handleGeneratePDF} disabled={isGenerating || products.length === 0} style={{backgroundColor: '#c6ed76'}}>
              {isGenerating ? "Generating..." : "Generate PDF"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default GeneratePDFPage;