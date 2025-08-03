import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Facebook, 
  Instagram 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { FaWhatsapp } from "react-icons/fa";

type ContactFormData = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

const ContactSection = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  
  const { toast } = useToast();

  const contactMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      const res = await apiRequest("POST", "/api/contact", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Message sent successfully",
        description: "We'll get back to you as soon as possible.",
        variant: "default",
      });
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    },
    onError: (error) => {
      toast({
        title: "Error sending message",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contactMutation.mutate(formData);
  };

  return (
    <section id="contact" className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
          <p className="text-neutral-dark max-w-2xl mx-auto">
            Have questions or need assistance? Contact our team for personalized support 
            and expert advice.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-10">
          {/* Contact Form */}
          <div className="bg-light rounded-lg shadow-md p-6">
            <h3 className="text-2xl font-bold mb-6">Send Us a Message</h3>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="name" className="block text-sm font-medium mb-1">
                    Your Name
                  </Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-neutral rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="block text-sm font-medium mb-1">
                    Your Email
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-neutral rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <Label htmlFor="phone" className="block text-sm font-medium mb-1">
                  Phone Number
                </Label>
                <Input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-neutral rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              
              <div className="mb-4">
                <Label htmlFor="subject" className="block text-sm font-medium mb-1">
                  Subject
                </Label>
                <Input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-neutral rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              
              <div className="mb-4">
                <Label htmlFor="message" className="block text-sm font-medium mb-1">
                  Your Message
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  required
                  className="w-full px-4 py-2 border border-neutral rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              
              <Button 
                type="submit"
                disabled={contactMutation.isPending}
                className="w-full py-3 bg-primary text-white font-medium rounded-md hover:bg-primary/90 transition-colors"
              >
                {contactMutation.isPending ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
          
          {/* Contact Information */}
          <div>
            <div className="bg-primary text-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-2xl font-bold mb-6">Our Contact Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="mt-1 mr-3 w-8 h-8 flex items-center justify-center bg-white/20 rounded-full flex-shrink-0">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Office Address</h4>
                    <p>Shayona Estate, memco cross road, Naroda Rd, Ahmedabad, Gujarat 382345</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mt-1 mr-3 w-8 h-8 flex items-center justify-center bg-white/20 rounded-full flex-shrink-0">
                    <Phone size={16} />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Phone Number</h4>
                    <p>+91 9879557391</p>
                    <p>+91 9898993857</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mt-1 mr-3 w-8 h-8 flex items-center justify-center bg-white/20 rounded-full flex-shrink-0">
                    <Mail size={16} />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Email Address</h4>
                    <p>oscardigicompany@gmail.com</p>
                    {/* <p>support@oscardigital.com</p> */}
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mt-1 mr-3 w-8 h-8 flex items-center justify-center bg-white/20 rounded-full flex-shrink-0">
                    <Clock size={16} />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Business Hours</h4>
                    <p>Monday - Saturday: 10:00 AM - 7:00 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-light rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-4">Connect With Us</h3>
              
              <div className="grid grid-cols-3 gap-4">
                <a
                  href="https://wa.me/919879557391"
                  className="flex flex-col items-center justify-center p-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <FaWhatsapp className="text-2xl mb-2" />
                  <span className="text-sm">WhatsApp</span>
                </a>
                
                <a
                  href="#"
                  className="flex flex-col items-center justify-center p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Facebook className="text-2xl mb-2" />
                  <span className="text-sm">Facebook</span>
                </a>
                
                <a
                  href="#"
                  className="flex flex-col items-center justify-center p-4 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                >
                  <Instagram className="text-2xl mb-2" />
                  <span className="text-sm">Instagram</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
