import React from 'react'
import facebookIcon from "../assets/facebook.png";
import instagramIcon from "../assets/instagram.png";

function SocialGroup({ title, facebook, instagram }) {
  return (
    <div>
      <div className="flex justify-center gap-6 mb-4">
        <a href={facebook} target="_blank" rel="noreferrer">
          <img src={facebookIcon} alt={`${title} Facebook`} className="w-20 h-20 hover:scale-105 transition-transform"/>
        </a>

        <a href={instagram} target="_blank" rel="noreferrer">
          <img src={instagramIcon} alt={`${title} Instagram`} className="w-20 h-20 hover:scale-105 transition-transform"/>
        </a>
      </div>

      <h3 className="text-2xl font-semibold">{title}</h3>
    </div>
  )
}

export default SocialGroup
