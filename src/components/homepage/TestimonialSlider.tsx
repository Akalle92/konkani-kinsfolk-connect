
import React from "react";

interface Testimonial {
  name: string;
  location: string;
  quote: string;
  avatar: string;
}

interface TestimonialSliderProps {
  testimonials: Testimonial[];
  activeIndex: number;
}

export const TestimonialSlider = ({ testimonials, activeIndex }: TestimonialSliderProps) => {
  return (
    <div className="relative overflow-hidden w-full">
      <div 
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {testimonials.map((testimonial, index) => (
          <div 
            key={index} 
            className="w-full flex-shrink-0 px-4"
          >
            <div className="bg-accent/60 p-8 rounded-xl shadow-md">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-primary/20 rounded-full mr-4 overflow-hidden">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-lg text-primary">{testimonial.name}</h4>
                  <div className="flex items-center text-gray-600 text-sm">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                    </svg>
                    {testimonial.location}
                  </div>
                </div>
              </div>
              <p className="italic text-gray-700 leading-relaxed">"{testimonial.quote}"</p>
              <div className="flex mt-6 space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-6 space-x-2">
        {testimonials.map((_, index) => (
          <div 
            key={index} 
            className={`h-2 rounded-full transition-all duration-300 ${
              activeIndex === index ? "w-8 bg-primary" : "w-2 bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
