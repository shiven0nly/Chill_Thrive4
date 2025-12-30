import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Instagram, Youtube, PhoneCall } from 'lucide-react';
import './Footer.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here
  };

  return (
    <section id="contact" className="contact-section">
      <div className="contact-container">
        {/* Header */}
        <div className="contact-header">
          <h2 className="contact-title">Get in Touch</h2>
          <p className="contact-subtitle">
            Have questions about our flavors or want to place a custom order? We'd love to hear from you!
          </p>
        </div>

        <div className="contact-content">
          {/* Contact Info */}
          <div className="contact-info">
            <h3>Visit Our Store</h3>
            
            <div className="info-item">
              <MapPin className="info-icon" />
              <div>
                <h4>Address</h4>
                <p>Mota Varachha<br />Surat<br />PinCode- 395007</p>
              </div>
            </div>

            <div className="info-item">
              <Phone className="info-icon" />
              <div>
                <h4>Phone</h4>
                <p>9227025160</p>
              </div>
            </div>

            <div className="info-item">
              <Mail className="info-icon" />
              <div>
                <h4>Email</h4>
                <p>thrivechill@gmail.com</p>
              </div>
            </div>

            <div className="info-item">
              <Clock className="info-icon" />
              <div>
                <h4>Hours</h4>
                <p>Mon-Thu: 9am-11pm<br />Fri-Sat: 10am-9pm<br />Sun: 11am-10pm</p>
              </div>
            </div>

            {/* Social Media */}
            <div className="social-section">
              <h4>Follow Us</h4>
              <ul className="footer">
                <li>
                  <a href="https://www.instagram.com/chill.thrive/?hl=en" target='_blank' aria-label="Instagram">
                    <Instagram />
                  </a>
                </li>
                <li>
                  <a href="https://www.youtube.com/@ChillThrive" aria-label="Youtube" target='_blank'>
                    <Youtube />
                  </a>
                </li>
                <li>
                  <a   href="https://wa.me/919227025160?text=Hi%20Chill%20Thrive%20I%20have%20to%20join"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                >
                    <PhoneCall/>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          
          <form className="form" onSubmit={handleSubmit}>
            <div className="title">Send Message</div>
            
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            
            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
            
            <button type="submit" className="submit-btn">
              <a href="https://mail.google.com/mail/?view=cm&fs=1&to=thrivechill@gmail.com"
                target="_blank"
                rel="noopener noreferrer">Send Message</a>
            </button>
            <div className="mapouter my-16 mx-auto" style={{ position: 'relative', textAlign: 'right', width: '350px', height: '250px' }}>
  <div className="gmap_canvas" style={{ overflow: 'hidden', background: 'none', width: '350px', height: '300px', border: '2px' , borderRadius: '10px', hover: 'boxShadow: 2px 2px 2px rgba(255 , 255 , 255 , 0.2)'}}>
    <iframe
      title="Chill Thrive Location"
      width="300"
      height="250"
      style={{ border: 0 }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      src="https://www.google.com/maps/d/embed?mid=1RugSX0Sa9EjEWtA1ry7N4d7eNm0L5zc&ehbc=2E312F&noprof=1"
    ></iframe>
  </div>
</div>
          </form>
        </div>
      </div>



      <footer className="mt-20 pt-10 border-t border-slate-200/50 text-center">
  <p className="text-sm text-slate-500">
    © 2025–2026 Chill Thrive. All rights reserved.
    <br className="sm:hidden" />
    <span className="inline-block mt-2 sm:mt-0 sm:ml-4">
      Made with <span className="text-cyan-600 ">❤️</span> by{' '}
      <span className='font-semibold text-cyan-300 underline'>
      PixelDev
      </span>
    </span>
  </p>
</footer>
    </section>
  );
};

export default Contact;