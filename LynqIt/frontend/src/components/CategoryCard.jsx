import React from 'react'

function CategoryCard({name,image,onClick}) {
  return (
    <div className='w-[140px] h-[140px] md:w-[180px] md:h-[180px] rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:scale-105 cursor-pointer fade-in relative' onClick={onClick}>
     <img src={image} alt="" className='w-full h-full object-cover transition-transform duration-300 hover:scale-110'/>
     <div className='absolute bottom-0 w-full left-0 bg-gradient-to-t from-black/80 to-transparent px-4 py-3 rounded-b-2xl'>
        <div className='text-white text-lg font-bold drop-shadow-lg'>{name}</div>
     </div>
    </div>
  )
}

export default CategoryCard
