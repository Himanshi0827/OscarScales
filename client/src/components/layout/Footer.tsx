import { Link } from "wouter";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  MapPin, 
  Phone, 
  Mail, 
  Clock 
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-[#0f172a] text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="text-3xl font-bold mb-4">
              <span className="text-secondary">O</span>SCAR
            </div>
            <p className="text-neutral/80 mb-4">
              Oscar Digital System provides high-quality weighing solutions for personal,
              commercial, and industrial applications.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral hover:text-white transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="text-neutral hover:text-white transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-neutral hover:text-white transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="text-neutral hover:text-white transition-colors">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-neutral/80 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-neutral/80 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-neutral/80 hover:text-white transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/#testimonials" className="text-neutral/80 hover:text-white transition-colors">
                  Testimonials
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-neutral/80 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-lg font-bold mb-4">Our Products</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/category/personal" className="text-neutral/80 hover:text-white transition-colors">
                  Personal Scales
                </Link>
              </li>
              <li>
                <Link href="/category/jewelry" className="text-neutral/80 hover:text-white transition-colors">
                  Jewelry Scales
                </Link>
              </li>
              <li>
                <Link href="/category/industrial" className="text-neutral/80 hover:text-white transition-colors">
                  Industrial Scales
                </Link>
              </li>
              <li>
                <Link href="/category/dairy" className="text-neutral/80 hover:text-white transition-colors">
                  Dairy Scales
                </Link>
              </li>
              <li>
                <Link href="/category/kitchen" className="text-neutral/80 hover:text-white transition-colors">
                  Kitchen Scales
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-4">Contact Information</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="mt-1 mr-3 text-secondary" size={18} />
                <span className="text-neutral/80">
                  123 Main Street, Tech Park, Bangalore - 560001, Karnataka, India
                </span>
              </li>
              <li className="flex items-start">
                <Phone className="mt-1 mr-3 text-secondary" size={18} />
                <span className="text-neutral/80">+91 9876543210</span>
              </li>
              <li className="flex items-start">
                <Mail className="mt-1 mr-3 text-secondary" size={18} />
                <span className="text-neutral/80">sales@oscardigital.com</span>
              </li>
              <li className="flex items-start">
                <Clock className="mt-1 mr-3 text-secondary" size={18} />
                <div className="text-neutral/80">
                  <p>Monday - Saturday: 10:00 AM - 7:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral/20 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-neutral/60 text-sm mb-4 md:mb-0">
              © {currentYear} Oscar Digital System. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral/60 text-sm hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-neutral/60 text-sm hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-neutral/60 text-sm hover:text-white transition-colors">
                Shipping Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
