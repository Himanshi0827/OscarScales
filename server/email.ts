import nodemailer from 'nodemailer';
import { ContactMessage } from '../shared/schema.js';

// Create a transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'oscardigicompany@gmail.com', // Company email from ContactSection
    // user: 'ronitshah350@gmail.com',
    pass: process.env.EMAIL_PASSWORD // Will be set via environment variable
  }
});

export async function sendContactEmail(contact: ContactMessage) {
  // Email to company
  const companyMailOptions = {
    from: 'oscardigicompany@gmail.com',
    // from: 'ronitshah350@gmail.com',
    to: 'oscardigicompany@gmail.com',
    // to: 'ronitshah350@gmail.com',
    subject: `New Contact Form Submission: ${contact.subject}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${contact.name}</p>
      <p><strong>Email:</strong> ${contact.email}</p>
      <p><strong>Phone:</strong> ${contact.phone}</p>
      <p><strong>Subject:</strong> ${contact.subject}</p>
      <p><strong>Message:</strong></p>
      <p>${contact.message}</p>
    `
  };

  // Auto-reply to customer
  const customerMailOptions = {
    from: 'oscardigicompany@gmail.com',
    // from: 'ronitshah350@gmail.com',
    to: contact.email,
    subject: 'Thank you for contacting Oscar Digital Systems',
    html: `
      <h2>Thank you for contacting Oscar Digital Systems</h2>
      <p>Dear ${contact.name},</p>
      <p>We have received your message and will get back to you as soon as possible.</p>
      <p>Here's a copy of your message:</p>
      <hr>
      <p><strong>Subject:</strong> ${contact.subject}</p>
      <p><strong>Message:</strong></p>
      <p>${contact.message}</p>
      <hr>
      <p>Best regards,</p>
      <p>Oscar Digital Systems Team</p>
    `
  };

  try {
    // Send email to company
    await transporter.sendMail(companyMailOptions);
    
    // Send auto-reply to customer
    await transporter.sendMail(customerMailOptions);
    
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
}