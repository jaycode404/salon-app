import React from "react";

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-column">
        <h4>Contact Us</h4>
        <p>Email: <a href="mailto:info@salon.com">info@salon.com</a></p>
        <p>Phone: <a href="tel:+1234567890">+1 234 567 890</a></p>
      </div>
      <div className="footer-column">
        <h4>Location</h4>
        <p>123 Beauty St.</p>
        <p>Salon City, SC 12345</p>
      </div>
      <div className="footer-column">
        <h4>Hours of Operation</h4>
        <p>Monday - Friday: 9am - 6pm</p>
        <p>Saturday: 10am - 4pm</p>
        <p>Sunday: Closed</p>
      </div>
      <div className="footer-column">
        <h4>Follow Us</h4>
        <p><a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a></p>
        <p><a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a></p>
        <p><a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a></p>
      </div>
    </footer>
  );
}
