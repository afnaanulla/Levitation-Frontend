import { useState, useEffect } from 'react';
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
  const [qty, setQty] = useState('1');
  const [rate, setRate] = useState('0');
  const products = useAppSelector((state) => state.products.products);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericQty = Number(qty);
    const numericRate = Number(rate);
    if (name && numericQty > 0 && numericRate >= 0) {
      dispatch(addProduct({ name, qty: numericQty, rate: numericRate }));
      setName('');
      setQty('1');
      setRate('0');
    }
  };

  const handleNext = () => {
    if (products.length > 0) {
      navigate('/generate-pdf');
    }
  };

  useEffect(() => {
    const main = document.getElementById('add-product-main');
    if (main) {
      main.classList.add('animate-fadein');
    }
  }, []);

  // Calculate GST-inclusive total for each product with explicit type
  const calculateTotalWithGST = (product: Product) => {
    const gstRate = 0.18; // 18% GST
    const baseTotal = product.qty * product.rate;
    return baseTotal + (baseTotal * gstRate);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-[4vw] gap-[4vw] w-full">
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
        id="add-product-main"
        className="bg-black flex flex-col items-center justify-center w-[90%] max-w-[1200px] min-h-[80vh] rounded-[2vw] shadow-lg animate-fadein"
        style={{
          padding: '4vw',
          position: 'relative',
          opacity: 1,
        }}
      >
        <div className="w-full">
          <Card className="mb-8 w-full bg-transparent border-none shadow-none">
            <CardHeader>
              <CardTitle style={{ color: 'white', fontSize: '2.5vw', fontFamily: 'Inter, sans-serif' }}>
                Add Products
              </CardTitle>
              <CardDescription style={{ color: 'white' }}>
                Add products to your invoice
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4 w-full">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                      style={{ fontSize: '1vw', color: '#FFFFFF' }}
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
                      className="rounded-md px-4 py-2 border"
                      style={{
                        width: '100%',
                        height: '7vh',
                        minHeight: '40px',
                        borderColor: '#424647',
                        color: '#B3B3B3',
                        background: '#202020',
                      }}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="qty"
                      className="block text-sm font-medium text-gray-700 mb-1"
                      style={{ fontSize: '1vw', color: '#FFFFFF' }}
                    >
                      Product Price
                    </label>
                    <Input
                      id="qty"
                      type="number"
                      min="1"
                      value={qty}
                      onChange={(e) => setQty(e.target.value)}
                      required
                      placeholder="Enter the price"
                      className="rounded-md px-4 py-2 border"
                      style={{
                        width: '100%',
                        height: '7vh',
                        minHeight: '40px',
                        borderColor: '#424647',
                        color: '#B3B3B3',
                        background: '#202020',
                      }}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="rate"
                      className="block text-sm font-medium text-gray-700 mb-1"
                      style={{ fontSize: '1vw', color: '#FFFFFF' }}
                    >
                      Quantity
                    </label>
                    <Input
                      id="rate"
                      type="number"
                      min="0"
                      step="0.01"
                      value={rate}
                      onChange={(e) => setRate(e.target.value)}
                      required
                      className="rounded-md px-4 py-2 border"
                      placeholder="Enter the Qty"
                      style={{
                        width: '100%',
                        height: '7vh',
                        minHeight: '40px',
                        borderColor: '#424647',
                        color: '#B3B3B3',
                        background: '#202020',
                      }}
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="btn-animate mt-8"
                  style={{
                    width: '20%',
                    minWidth: '140px',
                    height: '6vh',
                    borderRadius: '0.5vw',
                    background: 'linear-gradient(90.12deg, #141414 -6.53%, #303030 0.64%)',
                    color: '#CCF575',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 500,
                    fontSize: '1vw',
                    marginLeft: '400px'
                  }}
                >
                  <span>Add Product</span>
                  <div className="relative flex items-center justify-center w-[18px] h-[18px] rounded-full border border-[#CCF575] ml-2">
                    <div className="absolute w-[2px] h-[10px] bg-[#CCF575]" />
                    <div className="absolute w-[10px] h-[2px] bg-[#CCF575]" />
                  </div>
                </Button>
              </form>
            </CardContent>
          </Card>

          {products.length > 0 && (
            <Card className="animate-fadein">
              <CardHeader>
                <CardTitle></CardTitle>
                <CardDescription></CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto rounded-[1vw]">
                  <table className="min-w-full divide-y divide-gray-200 overflow-hidden border border-gray-700">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left">
                          <div className="flex items-center gap-2 font-[Inter] font-medium text-[1vw] leading-4 text-black">
                            Product Name
                          </div>
                        </th>
                        <th className="px-6 py-3 text-left">
                          <div className="flex items-center gap-2 font-[Inter] font-medium text-[1vw] leading-4 text-black">
                            Price
                          </div>
                        </th>
                        <th className="px-6 py-3 text-left">
                          <div className="flex items-center gap-2 font-[Inter] font-medium text-[1vw] leading-4 text-black">
                            Quantity
                          </div>
                        </th>
                        <th className="px-6 py-3 text-left">
                          <div className="flex items-center gap-2 font-[Inter] font-medium text-[1vw] leading-4 text-black">
                            Total Price
                          </div>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white-500 uppercase tracking-wider ">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {products.map((product) => (
                        <tr key={product.id} className="animate-fadein">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-white">{product.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{product.rate.toFixed(2)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{product.qty}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                            INR {calculateTotalWithGST(product).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => dispatch(removeProduct(product.id))}
                              className="text-red-600 hover:text-red-400 transition-colors duration-150"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t border-gray-700">
                        <td colSpan={3} className="px-6 py-4 text-sm font-medium text-white text-right">
                          Sub-Total
                        </td>
                        <td className="px-6 py-4 text-sm text-white">
                          INR {products.reduce((sum, product) => sum + product.qty * product.rate, 0).toFixed(2)}
                        </td>
                        <td></td>
                      </tr>
                      <tr className="border-t border-gray-700">
                        <td colSpan={3} className="px-6 py-4 text-sm font-bold text-white text-right">
                          Incl + GST 18%
                        </td>
                        <td className="px-6 py-4 text-sm text-white">
                          INR {products.reduce((sum, product) => sum + calculateTotalWithGST(product), 0).toFixed(2)}
                        </td>
                        <td></td>
                      </tr>
                      <tr className="border-t-2 border-gray-500 rounded-bl-[1vw] rounded-br-[1vw] overflow-hidden">
                        <td colSpan={3} className="px-6 py-4 text-sm font-bold text-white text-right rounded-bl-[1vw]">
                          Grand Total
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-white">
                          INR {products.reduce((sum, product) => sum + calculateTotalWithGST(product), 0).toFixed(2)}
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                <div className="flex justify-center mt-[5vh]">
                  <Button
                    onClick={handleNext}
                    className="btn-animate"
                    style={{
                      width: '30%',
                      minWidth: '180px',
                      height: '6vh',
                      borderRadius: '0.5vw',
                      background: 'linear-gradient(90.12deg, #141414 -6.53%, #303030 0.64%)',
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 500,
                      fontSize: '1vw',
                      color: '#CCF575',
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
  );
};

export default AddProductPage;