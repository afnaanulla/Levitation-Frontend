import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { addProduct, removeProduct } from '../features/productSlice';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';

// Define the Product interface based on your Redux state structure
interface Product {
  id: string | number; // Adjust based on your actual ID type
  name: string;
  qty: number;
  rate: number;
  total?: number; // Optional if not always present
}

const AddProductPage = () => {
  const [name, setName] = useState('');
  const [qty, setQty] = useState(1);
  const [rate, setRate] = useState(0);
  const products = useAppSelector((state) => state.products.products);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && qty > 0 && rate >= 0) {
      dispatch(addProduct({ name, qty, rate }));
      setName('');
      setQty(1);
      setRate(0);
    }
  };

  const handleNext = () => {
    if (products.length > 0) {
      navigate('/generate-pdf');
    }
  };

  // Calculate GST-inclusive total for each product with explicit type
  const calculateTotalWithGST = (product: Product) => {
    const gstRate = 0.18; // 18% GST
    const baseTotal = product.qty * product.rate;
    return baseTotal + (baseTotal * gstRate);
  };

  return (
    <div className="min-h-[130vh] flex items-center justify-center bg-black px-8 gap-12 w-full">
      <div
        style={{
          width: "1248px",
          height: "701px",
          top: "164.2px",
          left: "79px",
          gap: "32px",
          position: "absolute",
          opacity: 1,
        }}
        className="bg-black items-center justify-center"
      >
        <div className="min-h-screen bg-white py-8 mt-10 -ml-1" style={{ width: "1850px" }}>
          <div className="px-4 mt-[-20px]" style={{ width: "1550px" }}>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle style={{color:'green', fontSize: '40px', fontFamily: 'Inter, sans-serif'}}>Add Products</CardTitle>
                <CardDescription>
                  Add products to your invoice
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                        style={{fontSize: '16px',}}
                      >
                        Product Name
                      </label>
                      <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="Enter the product name"
                        className="w-[800px] h-[60px] rounded-md px-4 py-2 border"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="qty"
                        className="block text-sm font-medium text-gray-700 mb-1"
                        style={{fontSize: '16px',}}
                      >
                        Product Price
                      </label>
                      <Input
                        id="qty"
                        type="number"
                        min="1"
                        value={qty}
                        onChange={(e) => setQty(Number(e.target.value))}
                        required
                        className="w-[800px] h-[60px] rounded-md px-4 py-2 border"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="rate"
                        className="block text-sm font-medium text-gray-700 mb-1"
                        style={{fontSize: '16px',}}
                      >
                        Quantity
                      </label>
                      <Input
                        id="rate"
                        type="number"
                        min="0"
                        step="0.01"
                        value={rate}
                        onChange={(e) => setRate(Number(e.target.value))}
                        required
                        className="w-[800px] h-[60px] rounded-md px-4 py-2 border"
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-[156px] h-[45px] flex items-center gap-2 rounded-[7.47px] px-4 py-3 ml-155 mt-10"
                    style={{
                      background: "linear-gradient(90.12deg, #141414 -6.53%, #303030 0.64%)",
                    }}
                  >
                    <span className="text-white text-sm font-medium" style={{color: '#CCF575'}}>Add Product</span>
                    <div className="relative flex items-center justify-center w-[18.375px] h-[18.375px] rounded-full border border-[#CCF575]">
                      <div className="absolute w-[1.3125px] h-[9.1875px] bg-[#CCF575]" />
                      <div className="absolute w-[9.1875px] h-[1.3125px] bg-[#CCF575]" />
                    </div>
                  </Button>
                </form>
              </CardContent>
            </Card>

            {products.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle></CardTitle>
                  <CardDescription></CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left">
                            <div className="flex items-center gap-2 font-[Inter] font-medium text-[14px] leading-4 text-black" style={{fontFamily:'Inter, sans-serif', fontWeight:400, fontSize:'14px'}}>
                              Product Name
                              <span className="text-black text-sm" style={{width:'13px', height:'14px', marginTop: '-10px', marginLeft: '5px'}}>↑</span>
                            </div>
                          </th>
                          <th className="px-6 py-3 text-left">
                            <div
                              className="flex items-center gap-2 font-[Inter] font-medium text-[14px] leading-4 text-black"
                              style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '14px' }}
                            >
                              Price
                            </div>
                          </th>
                          <th className="px-6 py-3 text-left">
                            <div
                              className="flex items-center gap-2 font-[Inter] font-medium text-[14px] leading-4 text-black"
                              style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '14px' }}
                            >
                              Quantity
                              <span
                                className="text-black text-sm"
                                style={{ width: '13px', height: '14px', marginTop: '-10px', marginLeft: '5px' }}
                              >
                                ↓
                              </span>
                            </div>
                          </th>
                          <th className="px-6 py-3 text-left">
                            <div
                              className="flex items-center gap-2 font-[Inter] font-medium text-[14px] leading-4 text-black"
                              style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '14px' }}
                            >
                              Total Price
                            </div>
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {products.map((product) => (
                          <tr key={product.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {product.name}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              ${product.rate.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {product.qty}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              ${calculateTotalWithGST(product).toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => dispatch(removeProduct(product.id))}
                                className="text-red-600 hover:text-red-900"
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-gray-50">
                        <tr>
                          <td colSpan={3} className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                            Sub-Total
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            INR {products.reduce((sum, product) => sum + calculateTotalWithGST(product), 0).toFixed(2)}
                          </td>
                          <td></td>
                        </tr>
                        <tr>
                          <td colSpan={3} className="px-6 py-4 text-sm font-bold text-gray-900 text-right">
                            Incl + GST 18%
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            INR {products.reduce((sum, product) => sum + calculateTotalWithGST(product), 0).toFixed(2)}
                          </td>
                          <td></td>
                        </tr>
                        <tr>
                          <td colSpan={3} className="px-6 py-4 text-sm font-bold text-gray-900 text-right">
                            Grand Total
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-gray-900">
                            INR {products.reduce((sum, product) => sum + calculateTotalWithGST(product), 0).toFixed(2)}
                          </td>
                          <td></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                  <div className="mt-6 flex justify-center">
                <Button
                  onClick={handleNext}
                  className="px-6"
                  style={{
                    width: '435px',
                    height: '43px',
                    gap: '12px',
                    opacity: 1,
                    borderRadius: '7.47px',
                    paddingTop: '12px',
                    paddingRight: '16px',
                    paddingBottom: '12px',
                    paddingLeft: '16px',
                    background: 'linear-gradient(90.12deg, #141414 -6.53%, #303030 0.64%)',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 500,
                    fontSize: '16px',
                    color: '#CCF575',
                    lineHeight: '100%',
                    letterSpacing: '0px',
                  }}
                >
                  Generate PDF Invoice
                </Button>
              </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductPage;