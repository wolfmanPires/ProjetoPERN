import { EditIcon, Trash2Icon } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'
import { useProduct } from '../constants/product';

function ProductCard({product}) {
  const {products, loading, error, deleteProduct} = useProduct();
  const handleDelete = async () => {
    if(window.confirm("De certeza que quer eliminar este produto?")){
      await deleteProduct(product.id);
      navigate("/");
    }
  };

  return (
    <div className='card bg-base-100 shadow-xl hover:shadow-2xl transition-colors duration-300'>
      
      {/* Imagem do Produto */}
      <figure className='relative pt-[56.25%]'>
        <img src={product.image} alt={product.name} className='absolute top-0 left-0 w-full h-full object-cover' />
      </figure>

      {/* Corpo do Produto */}
      <div className='card-body'>
        <h2 className='card-title text-lg font-semibold'> {product.name} </h2>
        <p className='text-2xl font-bold text-primary'> ${Number(product.price).toFixed(2)} </p>
        <p className='text-2xl font-bold text-primary'> Stock: {Number(product.stock)} </p>

        {/* Acoes da Card */}
        <div className='card-actions justify-end mt-4'>
            <Link to={`/store/productGestor/${product.id_products}`} className="btn btn-sm btn-info btn-outline" >
                <EditIcon className='size-4' />
            </Link>

            <button className='btn btn-sm btn-error btn-outline' onClick={handleDelete} >
                <Trash2Icon className='size-4' />
            </button>
        </div>
      </div>  
    </div>
  )
}

export default ProductCard
