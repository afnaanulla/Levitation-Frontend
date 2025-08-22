import { useState } from 'react';
import { isAxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { clearProducts } from '../features/productSlice';
import { generateInvoice } from '../services/invoiceService';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';

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
        ? err.response?.data?.message ?? 'Failed to generate PDF'
        : err instanceof Error
          ? err.message
          : 'Failed to generate PDF';
      setError(message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-[130vh] flex items-center justify-center bg-black px-8 gap-12 w-full">
      <div className="min-h-screen bg-gray-50 py-8 w-[1200px]">
        <div className="max-w-4xl mx-auto px-4">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Preview</CardTitle>
              <CardDescription>
                Review your invoice details before generating the PDF
              </CardDescription>
            </CardHeader>
            <CardContent style={{ position: 'relative' }}>
              <div className="border rounded-lg p-6 bg-white">
                {/* Header */}
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <img src="/logo.png" alt="Invoice" className="h-10 w-auto" />
                  </div>
                  <div className="text-right">
                    <h3 className="text-lg font-semibold">INVOICE GENERATOR</h3>
                  </div>
                </div>
                <hr className="border-t-2 border-gray-300 mb-8" />

                {/* User Info Box */}
                <div
                  className="w-[549px] h-[86px] rounded-[10px] opacity-100 flex flex-col justify-center px-6 text-white mb-8"
                  style={{
                    background:
                      'linear-gradient(90.77deg, #0F0F0F 10.65%, #303661 114.19%)',
                  }}
                >
                  <div className="flex justify-between text-sm font-medium">
                    <span>Name:</span>
                    <span>Date: {new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span>{user?.name ?? 'Guest User'}</span>
                    <span>{user?.email ?? 'No email'}</span>
                  </div>
                </div>

                {/* Invoice Table */}
                <div className="overflow-x-auto mb-8">
                  {/* Custom Header Div */}
                  <div
                    className="text-white"
                    style={{
                      width: '600px',
                      height: '31.990997314453125px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '7.14px',
                      transform: 'rotate(0deg)',
                      opacity: 1,
                      borderRadius: '78px',
                      padding: '10px',
                      background:
                        'linear-gradient(90.77deg, #303661 10.65%, #263406 114.19%)',
                    }}
                  >
                    <div
                      className="px-4 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ width: '150px' }}
                    >
                      Product
                    </div>
                    <div
                      className="px-4 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ width: '100px' }}
                    >
                      Quantity
                    </div>
                    <div
                      className="px-4 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ width: '100px' }}
                    >
                      Rate
                    </div>
                    <div
                      className="px-4 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ width: '100px' }}
                    >
                      Total
                    </div>
                    {/* <div
                      className="px-4 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ width: '100px' }}
                    >
                      GST (18%)
                    </div> */}
                  </div>

                  {/* Table */}
                  <table
                    className="border-separate border-spacing-0"
                    style={{ tableLayout: 'fixed', width: '600px' }}
                  >
                    <tbody>
                      {products.map((product, index) => (
                        <tr
                          key={product.id}
                          style={{
                            backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#FAFAFA',
                          }}
                        >
                          <td
                            className="px-4 py-3 text-sm text-gray-900"
                            style={{ width: '150px' }}
                          >
                            {product.name}
                          </td>
                          <td
                            className="px-4 py-3 text-sm text-gray-500"
                            style={{ width: '100px' }}
                          >
                            {product.qty}
                          </td>
                          <td
                            className="px-4 py-3 text-sm text-gray-500"
                            style={{ width: '100px' }}
                          >
                            ${product.rate.toFixed(2)}
                          </td>
                          <td
                            className="px-4 py-3 text-sm text-gray-500"
                            style={{ width: '100px' }}
                          >
                            ${product.total.toFixed(2)}
                          </td>
                          <td
                            className="px-4 py-3 text-sm text-gray-500"
                            style={{ width: '100px' }}
                          >
                            {/* ${product.gst.toFixed(2)} */}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Subtotal, GST, and Grand Total Div */}
                <div
                  style={{
                    width: '253px',
                    height: '104px',
                    position: 'absolute',
                    top: '402.5px',
                    left: '319px',
                    borderRadius: '8px',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: '#000',
                    padding: '11.87px',
                    gap: '11.87px',
                    transform: 'rotate(0deg)',
                    opacity: 1,
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    background: '#FAFAFA',
                  }}
                >
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-900">Subtotal</span>
                    <span className="text-gray-500">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-900">GST (18%)</span>
                    <span className="text-gray-500">${gstAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-gray-900">Grand Total</span>
                    <span className="text-gray-900">${grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-between mt-12">
                  <Button variant="outline" onClick={() => navigate('/add-product')}>
                    Back to Edit
                  </Button>
                  <Button
                    onClick={handleGeneratePDF}
                    disabled={isGenerating || products.length === 0}
                  >
                    {isGenerating ? 'Generating...' : 'Generate PDF'}
                  </Button>
                </div>

                {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GeneratePDFPage;