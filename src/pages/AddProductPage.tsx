import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { addProduct, removeProduct } from '../features/productSlice';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add Products</CardTitle>
            <CardDescription>
              Add products to your invoice
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="qty" className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <Input
                    id="qty"
                    type="number"
                    min="1"
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="rate" className="block text-sm font-medium text-gray-700 mb-1">
                    Rate ($)
                  </label>
                  <Input
                    id="rate"
                    type="number"
                    min="0"
                    step="0.01"
                    value={rate}
                    onChange={(e) => setRate(Number(e.target.value))}
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">
                Add Product
              </Button>
            </form>
          </CardContent>
        </Card>

        {products.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Product List</CardTitle>
              <CardDescription>
                Review your products before generating the invoice
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rate
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        GST (18%)
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
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.qty}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${product.rate.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${product.total.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${product.gst.toFixed(2)}
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
                      <td colSpan={3} className="px-6 py-4 text-sm font-medium text-gray-900">
                        Subtotal
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        ${products.reduce((sum, product) => sum + product.total, 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        ${products.reduce((sum, product) => sum + product.gst, 0).toFixed(2)}
                      </td>
                      <td></td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-sm font-bold text-gray-900">
                        Grand Total
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">
                        ${products.reduce((sum, product) => sum + product.total + product.gst, 0).toFixed(2)}
                      </td>
                      <td></td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <div className="mt-6 flex justify-end">
                <Button onClick={handleNext} className="px-6">
                  Next: Generate PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AddProductPage;