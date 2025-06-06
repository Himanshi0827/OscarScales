import { CheckCircle, Bolt, Headset, Award } from "lucide-react";

type Feature = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

const features: Feature[] = [
  {
    icon: <CheckCircle className="text-primary text-xl" />,
    title: "Precision Engineering",
    description: "Our scales are built with advanced sensors ensuring accurate measurements every time."
  },
  {
    icon: <Bolt className="text-primary text-xl" />,
    title: "Durability",
    description: "Built to last with high-quality materials that withstand rigorous daily use."
  },
  {
    icon: <Headset className="text-primary text-xl" />,
    title: "Expert Support",
    description: "Our technical team provides prompt assistance for installation and maintenance."
  },
  {
    icon: <Award className="text-primary text-xl" />,
    title: "ISO Certified",
    description: "All our products meet international quality standards and certifications."
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-12 bg-neutral/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose Oscar Digital System</h2>
          <p className="text-neutral-dark max-w-2xl mx-auto">
            Our commitment to quality and precision makes us the preferred choice for weighing solutions.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-neutral-dark">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
