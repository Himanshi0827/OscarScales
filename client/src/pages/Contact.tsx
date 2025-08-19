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
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1118.0808288653718!2d72.62829064577254!3d23.052205524926332!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e86a83fffffff%3A0x327f350797bff87a!2sOscar%20Digital%20System!5e1!3m2!1sen!2sin!4v1755608205805!5m2!1sen!2sin" 
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
