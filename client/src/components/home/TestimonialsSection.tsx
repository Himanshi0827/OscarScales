import { Star, StarHalf } from "lucide-react";

type Testimonial = {
  rating: number;
  text: string;
  author: {
    initials: string;
    name: string;
    title: string;
  };
};

const testimonials: Testimonial[] = [
  {
    rating: 5,
    text: "Our dairy farm has been using Oscar's milk collection scales for over 2 years. Their accuracy and durability have significantly improved our operations. The after-sales support is exceptional.",
    author: {
      initials: "RK",
      name: "Rajesh Kumar",
      title: "Dairy Farm Owner",
    },
  },
  {
    rating: 5,
    text: "As a jewelry store owner, precision is everything. Oscar's jewelry scales provide the accuracy we need with an elegant design that impresses our customers. The calibration stays perfect even with daily use.",
    author: {
      initials: "AP",
      name: "Anita Patel",
      title: "Jewelry Store Owner",
    },
  },
  {
    rating: 4.5,
    text: "We equipped our warehouse with Oscar's industrial scales and the efficiency improvement has been tremendous. The scales are robust, accurate, and the digital integration with our inventory system works flawlessly.",
    author: {
      initials: "SM",
      name: "Suresh Mehta",
      title: "Logistics Manager",
    },
  },
];

const TestimonialsSection = () => {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="fill-yellow-400 text-yellow-400" size={18} />);
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="fill-yellow-400 text-yellow-400" size={18} />);
    }

    return stars;
  };

  return (
    <section id="testimonials" className="py-12 bg-neutral/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-neutral-dark max-w-2xl mx-auto">
            Don't just take our word for it, hear from those who've experienced Oscar Digital Systems.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex text-yellow-400 mb-3">
                {renderStars(testimonial.rating)}
              </div>
              <p className="text-neutral-dark mb-4">{testimonial.text}</p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-neutral-dark/20 flex items-center justify-center mr-3">
                  <span className="text-lg font-bold text-primary">{testimonial.author.initials}</span>
                </div>
                <div>
                  <h4 className="font-semibold">{testimonial.author.name}</h4>
                  <p className="text-sm text-neutral-dark">{testimonial.author.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
