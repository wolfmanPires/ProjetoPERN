import React from 'react'

function PartnerCard({ image, title }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <img src={image} alt={title} className="max-h-40 object-contain"/>
      <h3 className="text-2xl font-semibold">{title}</h3>
    </div>
  )
}

export default PartnerCard
