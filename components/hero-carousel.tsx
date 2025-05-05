"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

const carImages = [
  {
    src: "/cars/black-luxury-car.jpg",
    alt: "Voiture de luxe noire sur fond rouge",
  },
  {
    src: "/cars/luxury-car-2.jpg", 
    alt: "Berline sportive moderne",
  },
  {
    src: "/cars/luxury-car-3.jpg",
    alt: "SUV premium en environnement urbain",
  }
];

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Auto-advance the carousel unless paused
  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % carImages.length);
      }, 3000); // Change image every 3 seconds
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused]);
  
  // Handle hover zones
  const handleHoverZone = (zone: number) => {
    setIsPaused(true);
    setCurrentIndex(zone);
  };
  
  // Resume auto-rotation when not hovering
  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  return (
    <div 
      className="relative h-[300px] sm:h-[400px] lg:h-[500px] overflow-hidden rounded-lg shadow-2xl"
      onMouseLeave={handleMouseLeave}
    >
      {/* Image container with transitions */}
      {carImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-500 ease-in-out ${
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover rounded-lg"
            priority={index === 0}
          />
        </div>
      ))}
      
      {/* Hover zones - invisible divs that trigger image changes */}
      <div className="absolute inset-0 z-20 flex">
        <div 
          className="flex-1 cursor-pointer"
          onMouseEnter={() => handleHoverZone(0)} 
          aria-label="View first car"
        />
        <div 
          className="flex-1 cursor-pointer"
          onMouseEnter={() => handleHoverZone(1)} 
          aria-label="View second car"
        />
        <div 
          className="flex-1 cursor-pointer"
          onMouseEnter={() => handleHoverZone(2)} 
          aria-label="View third car"
        />
      </div>
      
      {/* Zone indicators - subtle visual indicators for the hover zones */}
      <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center space-x-4">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className={`h-1 transition-all duration-300 rounded-full ${
              index === currentIndex 
                ? "bg-white w-8" 
                : "bg-white/40 w-4 hover:bg-white/60"
            }`}
            onMouseEnter={() => handleHoverZone(index)}
          />
        ))}
      </div>
      
      {/* Auto-rotate indicator */}
      <div className="absolute top-4 right-4 z-20">
        <div className={`w-2 h-2 rounded-full transition-all duration-300 ${isPaused ? 'bg-white/40' : 'bg-white'}`} />
      </div>
      
      {/* Optional overlay gradient for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-[5] rounded-lg"></div>
    </div>
  );
} 