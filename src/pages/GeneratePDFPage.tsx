import { useState } from 'react';
import { isAxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { clearProducts } from '../features/productSlice';
import { generateInvoice } from '../services/invoiceService';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const GeneratePDFPage = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const products = useAppSelector((state) => state.products.products);
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
      
      // Clear products after successful generation
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle>Invoice Preview</CardTitle>
            <CardDescription>
              Review your invoice details before generating the PDF
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-6 bg-white">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-bold">INVOICE</h2>
                  <p className="text-gray-600">Date: {new Date().toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <h3 className="text-lg font-semibold">Your Company</h3>
                  <p className="text-gray-600">123 Business Street</p>
                  <p className="text-gray-600">City, State, ZIP</p>
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-2">Bill To:</h3>
                <p className="text-gray-800">Customer Name</p>
                <p className="text-gray-600">customer@example.com</p>
              </div>
              
              <div className="overflow-x-auto mb-8">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rate
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        GST (18%)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td className="px-4 py-3 text-sm text-gray-900">{product.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{product.qty}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">${product.rate.toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">${product.total.toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">${product.gst.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan={3} className="px-4 py-3 text-sm font-medium text-gray-900">
                        Subtotal
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        ${subtotal.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        ${gstAmount.toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="px-4 py-3 text-sm font-bold text-gray-900">
                        Grand Total
                      </td>
                      <td className="px-4 py-3 text-sm font-bold text-gray-900" colSpan={2}>
                        ${grandTotal.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/add-product')}
                >
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
  );
};

export default GeneratePDFPage;