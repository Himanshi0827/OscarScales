import { Helmet } from "react-helmet";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Target, Users, Layers, Award, TrendingUp } from "lucide-react";

const About = () => {
  return (
    <>
      <Helmet>
        <title>About Us - Oscar Digital System</title>
        <meta name="description" content="Learn about Oscar Digital System, our history, mission, values, and commitment to providing high-quality weighing solutions." />
      </Helmet>
      
      <div className="bg-gradient-primary text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">About Oscar Digital System</h1>
          <p className="text-lg max-w-3xl">
            Discover our journey of innovation and excellence in the field of precision weighing solutions.
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <p className="text-neutral-dark mb-4">
              Founded in 2005, Oscar Digital System has established itself as a leading manufacturer and supplier of precision weighing solutions in India. What started as a small-scale operation has grown into a trusted brand serving thousands of businesses and individuals across the country.
            </p>
            <p className="text-neutral-dark mb-4">
              Our journey began with a simple vision - to provide accurate, reliable, and affordable weighing solutions that meet the diverse needs of various industries. Over the years, we have continuously innovated and expanded our product range to include personal, jewelry, industrial, dairy, and kitchen scales.
            </p>
            <p className="text-neutral-dark">
              Today, Oscar Digital System is synonymous with quality and precision. Our state-of-the-art manufacturing facility, quality control processes, and dedicated team ensure that every product that bears the Oscar name meets the highest standards of excellence.
            </p>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1521791136064-7986c2920216" 
              alt="Oscar Digital System Team" 
              className="rounded-lg shadow-lg"
            />
            <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg">
              <p className="text-primary font-bold">15+ Years of Excellence</p>
            </div>
          </div>
        </div>
        
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Our Mission & Values</h2>
            <p className="text-neutral-dark max-w-2xl mx-auto">
              At Oscar Digital System, we're guided by a clear mission and a strong set of values that shape everything we do.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                    <Target className="text-primary" size={24} />
                  </div>
                  <h3 className="text-xl font-bold">Our Mission</h3>
                </div>
                <p className="text-neutral-dark">
                  To empower businesses and individuals with accurate, reliable, and innovative weighing solutions that enhance efficiency, ensure compliance, and drive success.
                </p>
              </CardContent>
            </Card>
            
            <Card className="shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mr-4">
                    <Layers className="text-secondary" size={24} />
                  </div>
                  <h3 className="text-xl font-bold">Our Vision</h3>
                </div>
                <p className="text-neutral-dark">
                  To be the most trusted and preferred partner for weighing solutions globally, known for our innovation, quality, and customer-centric approach.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="shadow-md">
              <CardContent className="pt-6">
                <CheckCircle className="text-primary mb-4" size={24} />
                <h3 className="text-lg font-bold mb-2">Quality Excellence</h3>
                <p className="text-neutral-dark">
                  We are committed to delivering products that meet the highest standards of precision, durability, and reliability.
                </p>
              </CardContent>
            </Card>
            
            <Card className="shadow-md">
              <CardContent className="pt-6">
                <Users className="text-primary mb-4" size={24} />
                <h3 className="text-lg font-bold mb-2">Customer Focus</h3>
                <p className="text-neutral-dark">
                  Our customers are at the heart of everything we do. We listen, understand, and respond to their needs promptly.
                </p>
              </CardContent>
            </Card>
            
            <Card className="shadow-md">
              <CardContent className="pt-6">
                <TrendingUp className="text-primary mb-4" size={24} />
                <h3 className="text-lg font-bold mb-2">Innovation</h3>
                <p className="text-neutral-dark">
                  We continuously strive to innovate and improve our products, processes, and services to stay ahead of industry trends.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Our Certifications</h2>
            <p className="text-neutral-dark max-w-2xl mx-auto">
              We adhere to the highest standards of quality and compliance, as evidenced by our certifications.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Badge variant="outline" className="text-base py-2 px-4 border-2 flex items-center">
              <Award className="mr-2 text-primary" size={20} /> ISO 9001:2015
            </Badge>
            <Badge variant="outline" className="text-base py-2 px-4 border-2 flex items-center">
              <Award className="mr-2 text-primary" size={20} /> CE Certified
            </Badge>
            <Badge variant="outline" className="text-base py-2 px-4 border-2 flex items-center">
              <Award className="mr-2 text-primary" size={20} /> BIS Approved
            </Badge>
            <Badge variant="outline" className="text-base py-2 px-4 border-2 flex items-center">
              <Award className="mr-2 text-primary" size={20} /> RoHS Compliant
            </Badge>
          </div>
        </div>
        
        <div className="bg-neutral/30 p-8 rounded-lg shadow-md">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">Join the Oscar Family</h2>
            <p className="text-neutral-dark">
              Experience the difference of working with a company that values precision, quality, and customer satisfaction.
            </p>
          </div>
          <div className="flex justify-center">
            <a 
              href="/contact" 
              className="bg-primary hover:bg-primary/90 text-white font-medium px-6 py-3 rounded-md transition-colors"
            >
              Contact Us Today
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
