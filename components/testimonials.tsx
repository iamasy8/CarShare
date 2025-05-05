"use client"

import React from "react"
import { Star } from "lucide-react"

interface TestimonialProps {
  quote: string
  author: string
  role: string
  rating: number
}

function Testimonial({ quote, author, role, rating }: TestimonialProps) {
  return (
    <div className="flex flex-col items-start">
      {/* Stars */}
      <div className="flex mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${
              i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
      
      {/* Quote */}
      <p className="text-gray-600 italic mb-4">{quote}</p>
      
      {/* Author */}
      <div className="flex items-center mt-auto">
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 mr-3">
          {author.charAt(0)}
        </div>
        <div>
          <p className="font-semibold">{author}</p>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
      </div>
    </div>
  )
}

export function Testimonials() {
  const testimonials = [
    {
      quote: "J'ai pu louer une voiture rapidement pour un week-end. Le propriétaire était très sympathique et le processus était simple.",
      author: "Sophie D.",
      role: "Locataire",
      rating: 5,
    },
    {
      quote: "En tant que propriétaire, je peux facilement gérer mes annonces et communiquer avec les locataires. Un excellent moyen de rentabiliser ma voiture.",
      author: "Thomas L.",
      role: "Propriétaire",
      rating: 5,
    },
    {
      quote: "J'utilise régulièrement CarShare pour mes déplacements professionnels. C'est plus économique et plus flexible qu'une agence traditionnelle.",
      author: "Marc B.",
      role: "Locataire",
      rating: 4,
    },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Ce que disent nos utilisateurs</h2>
          <p className="text-gray-600">Découvrez les expériences de notre communauté</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Testimonial key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  )
} 