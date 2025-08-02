import { Link } from "wouter";
import { ArrowRight, Headset } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-primary overflow-hidden">
      <div className="container mx-auto px-4 py-12 md:py-24">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          
          {/* TEXT SECTION */}
          <div className="text-white z-10 order-2 md:order-1">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Precision Weighing Solutions
            </h1>
            <p className="text-lg md:text-xl mb-8 text-neutral/90">
              From jewelry to industrial scales, Oscar Digital System offers unmatched 
              accuracy and reliability.
            </p>

            <div className="flex flex-wrap gap-4 mb-6">
              <Button
                asChild
                size="lg"
                className="bg-secondary hover:bg-secondary/90 text-white font-medium"
              >
                <Link href="products">
                  Explore Products <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                className="bg-white text-primary hover:bg-neutral font-medium"
              >
                <Link href="/contact">
                  Contact Us <Headset className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Trusted By Card – MOVED FOR MOBILE */}
            <div className="block md:hidden bg-white p-4 rounded-lg shadow-lg w-fit">
              <div className="text-sm text-neutral-dark mb-1">Trusted by</div>
              <div className="text-2xl font-bold text-primary">
                5000+ <span className="text-secondary">Businesses</span>
              </div>
            </div>
          </div>

          {/* IMAGE SECTION */}
          <div className="relative order-1 md:order-2">
            <img 
              src="https://i.ibb.co/PZ4kYrhg/Gemini-Generated-Image-j6oz25j6oz25j6oz.jpg" 
              alt="Oscar Digital Weighing Scale" 
              className="rounded-lg shadow-2xl w-full h-auto object-cover"
            />

            {/* Trusted by Box for Desktop */}
            <div className="hidden md:block absolute bottom-12 -left-12 bg-white p-4 rounded-lg shadow-lg w-48">
              <div className="text-sm text-neutral-dark mb-1">Trusted by</div>
              <div className="text-2xl font-bold text-primary">
                5000+ <span className="text-secondary">Businesses</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Circles */}
      <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-secondary"></div>
        <div className="absolute bottom-1/3 left-1/5 w-40 h-40 rounded-full bg-primary"></div>
      </div>
    </section>
  );
};

export default HeroSection;
