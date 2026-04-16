import React, { useState, useEffect } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '@/lib/supabase';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Plus, X, Loader2 } from 'lucide-react';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    salePrice: '',
    category: 'women',
    subCategory: '',
    description: '',
    images: '',
    sizes: '',
    inStock: true,
    isNew: false,
    isSale: false,
    trending: false,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    const data = await getProducts();
    setProducts(data);
    setLoading(false);
  }

  const openForm = (product?: Product) => {
    if (product) {
      setEditingId(product.id);
      setFormData({
        name: product.name,
        price: product.price.toString(),
        salePrice: product.salePrice ? product.salePrice.toString() : '',
        category: product.category,
        subCategory: product.subCategory,
        description: product.description,
        images: product.images.join(', '),
        sizes: product.sizes.join(', '),
        inStock: product.inStock,
        isNew: product.isNew,
        isSale: product.isSale,
        trending: product.trending,
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '', price: '', salePrice: '', category: 'women', subCategory: '',
        description: '', images: '', sizes: 'S, M, L, XL', inStock: true,
        isNew: false, isSale: false, trending: false,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const payload = {
      name: formData.name,
      price: Number(formData.price),
      salePrice: formData.salePrice ? Number(formData.salePrice) : undefined,
      category: formData.category as 'women'|'men'|'kids',
      subCategory: formData.subCategory,
      description: formData.description,
      images: formData.images.split(',').map(s => s.trim()).filter(Boolean),
      sizes: formData.sizes.split(',').map(s => s.trim()).filter(Boolean),
      inStock: formData.inStock,
      isNew: formData.isNew,
      isSale: formData.isSale,
      trending: formData.trending,
    };

    if (editingId) {
      await updateProduct(editingId, payload);
    } else {
      await createProduct(payload as unknown as Omit<Product, 'id'>);
    }

    setIsModalOpen(false);
    await fetchProducts();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setLoading(true);
      await deleteProduct(id);
      await fetchProducts();
    }
  };

  const toggleTrending = async (id: string, currentStatus: boolean) => {
    setLoading(true);
    await updateProduct(id, { trending: !currentStatus });
    await fetchProducts();
  };

  if (loading && products.length === 0) {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-primary w-8 h-8"/></div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 mt-1">Manage inventory, prices, and fast-moving items.</p>
        </div>
        <Button onClick={() => openForm()} className="bg-primary hover:bg-primary/90 text-white rounded-none">
          <Plus className="w-4 h-4 mr-2" /> Add Product
        </Button>
      </div>

      <div className="bg-white border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-widest text-gray-500">
              <th className="p-4 font-bold">Product</th>
              <th className="p-4 font-bold">Price</th>
              <th className="p-4 font-bold">Category</th>
              <th className="p-4 font-bold">Status</th>
              <th className="p-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className={loading ? 'opacity-50' : ''} style={{display: loading ? 'table-row' : 'none'}}>
              <td colSpan={5} className="p-4 text-center text-sm text-gray-400">Updating...</td>
            </tr>
            {products.map(product => (
              <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-4">
                    <img src={product.images[0]} alt={product.name} className="w-12 h-16 object-cover bg-gray-100" />
                    <div>
                      <p className="font-bold text-sm">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.subCategory}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <p className="font-medium">KES {product.price}</p>
                  {product.isSale && <p className="text-xs text-primary line-through">KES {product.salePrice}</p>}
                </td>
                <td className="p-4 uppercase text-xs">{product.category}</td>
                <td className="p-4">
                  <div className="flex flex-col gap-1 items-start">
                    {product.inStock ? 
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">In Stock</Badge> : 
                      <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Out of Stock</Badge>}
                    {product.trending && <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 mt-1">Trending</Badge>}
                  </div>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" size="sm" 
                      onClick={() => toggleTrending(product.id, product.trending)}
                      className="text-xs rounded-none border-gray-200"
                    >
                      {product.trending ? 'Un-Trend' : 'Trend'}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => openForm(product)}>
                      <Pencil className="w-4 h-4 text-gray-600" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto p-8 rounded-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-serif font-bold">{editingId ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={() => setIsModalOpen(false)}><X className="w-6 h-6 text-gray-500"/></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest font-bold mb-2">Name</label>
                  <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="rounded-none"/>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest font-bold mb-2">Price (KES)</label>
                  <Input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="rounded-none"/>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest font-bold mb-2">Category</label>
                  <select 
                    className="w-full flex h-10 border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-none"
                    value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="women">Women</option>
                    <option value="men">Men</option>
                    <option value="kids">Kids</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest font-bold mb-2">Sub Category</label>
                  <Input required placeholder="eg. Dresses, Tops" value={formData.subCategory} onChange={e => setFormData({...formData, subCategory: e.target.value})} className="rounded-none"/>
                </div>
              </div>
              
              <div>
                <label className="block text-xs uppercase tracking-widest font-bold mb-2">Description</label>
                <textarea 
                  required className="w-full min-h-[100px] border border-gray-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest font-bold mb-2">Image URLs (comma separated)</label>
                <Input required value={formData.images} onChange={e => setFormData({...formData, images: e.target.value})} className="rounded-none"/>
                <p className="text-xs text-gray-400 mt-1">Paste Unsplash/Cloudinary URLs here.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-100 pt-6">
                <div>
                   <label className="block text-xs uppercase tracking-widest font-bold mb-2">Sizes (comma separated)</label>
                   <Input required value={formData.sizes} onChange={e => setFormData({...formData, sizes: e.target.value})} className="rounded-none"/>
                </div>
                <div>
                   <label className="block text-xs uppercase tracking-widest font-bold mb-2">Sale Price (KES) - Optional</label>
                   <Input type="number" value={formData.salePrice} onChange={e => setFormData({...formData, salePrice: e.target.value})} className="rounded-none"/>
                </div>
              </div>

              <div className="flex gap-6 mt-4">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <input type="checkbox" checked={formData.inStock} onChange={e => setFormData({...formData, inStock: e.target.checked})} className="accent-primary" />
                  In Stock
                </label>
                <label className="flex items-center gap-2 text-sm font-medium">
                  <input type="checkbox" checked={formData.isNew} onChange={e => setFormData({...formData, isNew: e.target.checked})} className="accent-primary" />
                  New Arrival
                </label>
                <label className="flex items-center gap-2 text-sm font-medium">
                  <input type="checkbox" checked={formData.isSale} onChange={e => setFormData({...formData, isSale: e.target.checked})} className="accent-primary" />
                  On Sale
                </label>
              </div>

              <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-white rounded-none h-12 uppercase tracking-widest">
                {editingId ? 'Save Changes' : 'Create Product'}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
