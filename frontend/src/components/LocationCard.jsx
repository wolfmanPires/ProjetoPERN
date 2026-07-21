import { Mail, MapPin, Phone } from 'lucide-react'
import React from 'react'

function LocationCard({ image, address, mapUrl, phone, email }) {
  return (
    <div className="card bg-base-200 shadow-lg">
      <figure>
        <img src={image} alt={address} className="w-full h-64 object-cover"/>
      </figure>

      <div className="card-body">
        <div className="flex items-start gap-2">
          <MapPin className="w-6 h-6 mt-1" />
          <a href={mapUrl} target="_blank" rel="noreferrer" className="link link-primary">
            {address}
          </a>
        </div>

        <div className="flex items-center gap-2">
          <Phone className="w-6 h-6" />
          <span>{phone}</span>
        </div>

        <div className="flex items-center gap-2">
          <Mail className="w-6 h-6" />
          <a href={`mailto:${email}`} className="link link-primary">
            {email}
          </a>
        </div>
      </div>
    </div>
  )
}

export default LocationCard
