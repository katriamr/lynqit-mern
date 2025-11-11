import React, { useState } from 'react';
import { FaStar } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/userSlice';

function ProductCard({ data }) {
	const [quantity, setQuantity] = useState(0);
	const dispatch = useDispatch();
	const { cartItems } = useSelector(state => state.user);
	const renderStars = (rating) => {
		const stars = [];
		for (let i = 1; i <= 5; i++) {
			stars.push(
				(i <= rating) ? (
					<FaStar className='text-amber-400 text-lg' />
				) : (
					<FaRegStar className='text-amber-400 text-lg' />
				)
			);
		}
		return stars;
	};

	const handleIncrease = () => {
		const newQty = quantity + 1;
		setQuantity(newQty);
	};
	const handleDecrease = () => {
		if (quantity > 0) {
			const newQty = quantity - 1;
			setQuantity(newQty);
		}
	};

	return (
		<div className='w-[280px] rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col border border-gray-100 overflow-hidden hover:scale-[1.02] fade-in'>
			<div className='relative w-full h-[180px] flex justify-center items-center bg-gradient-to-br from-gray-50 to-gray-100'>
				<img src={data.image} alt="" className='w-full h-full object-cover transition-transform duration-300 hover:scale-110' />
				{data.rating?.average > 4 && (
					<div className='absolute top-3 right-3 bg-emerald-500 text-white px-2 py-1 rounded-full text-xs font-semibold'>
						Top Rated
					</div>
				)}
			</div>

			<div className="flex-1 flex flex-col p-5">
				<h1 className='font-bold text-gray-900 text-lg truncate mb-1'>{data.name}</h1>
				<div className='text-sm text-gray-500 mb-1'>Brand: <span className='font-medium'>{data.brand}</span></div>
				<div className='text-sm text-gray-500 mb-1'>Color: <span className='font-medium'>{data.color}</span></div>
				<div className='text-sm text-gray-500 mb-2'>Sizes: <span className='font-medium'>{Array.isArray(data.size) ? data.size.join(', ') : data.size}</span></div>
				{data.description && <div className='text-sm text-gray-600 mb-3 line-clamp-2'>{data.description}</div>}

				<div className='flex items-center gap-1 mb-3'>
					<div className='flex items-center gap-1'>
						{renderStars(data.rating?.average || 0)}
					</div>
					<span className='text-sm text-gray-500 ml-1'>
						({data.rating?.count || 0})
					</span>
				</div>
			</div>

			<div className='flex items-center justify-between mt-auto p-5 pt-0'>
				<span className='font-bold text-gray-900 text-xl'>
					₹{data.price}
				</span>

				<div className='flex items-center border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm bg-gray-50'>
					<button className='px-3 py-2 hover:bg-gray-200 transition-colors' onClick={handleDecrease}>
						<FaMinus size={14} className='text-gray-600' />
					</button>
					<span className='px-4 py-2 font-semibold text-gray-800 min-w-[40px] text-center'>{quantity}</span>
					<button className='px-3 py-2 hover:bg-gray-200 transition-colors' onClick={handleIncrease}>
						<FaPlus size={14} className='text-gray-600' />
					</button>
					<button className={`${cartItems.some(i => i.id == data._id) ? "bg-emerald-500 hover:bg-emerald-600" : "bg-indigo-600 hover:bg-indigo-700"} text-white px-4 py-2 transition-all duration-200 ml-2 rounded-lg`} onClick={() => {
						quantity > 0 ? dispatch(addToCart({
							id: data._id,
							name: data.name,
							price: data.price,
							image: data.image,
							shop: data.shop,
							quantity,
							brand: data.brand,
							size: data.size,
							color: data.color,
							description: data.description
						})) : null;
					}}>
						<FaShoppingCart size={16} />
					</button>
				</div>
			</div>
		</div>
	);
}

export default ProductCard;
