import { Helmet } from "react-helmet";
import ContactSection from "@/components/home/ContactSection";

const Contact = () => {
  return (
    <>
      <Helmet>
        <title>Contact Us - Oscar Digital System</title>
        <meta name="description" content="Get in touch with Oscar Digital System for inquiries, support, or to request a quote for our weighing solutions." />
      </Helmet>
      
      <div className="bg-gradient-primary text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg max-w-3xl">
            We'd love to hear from you. Reach out for any questions, support, or to request a quote.
          </p>
        </div>
      </div>
      
      <ContactSection />
      
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d248849.84916296526!2d77.6309395!3d12.9539974!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sBengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1688457098641!5m2!1sen!2sin" 
            width="100%" 
            height="450" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Oscar Digital System Location"
          ></iframe>
        </div>
      </div>
    </>
  );
};

export default Contact;
