// "use client";
// import { useRouter } from "next/navigation";
// import React from "react";
// import { FaDiscord, FaLinkedinIn, FaGithub } from "react-icons/fa";
// import { IoGlobeOutline } from "react-icons/io5";

// const Footer = () => {

//     const navigation = useRouter()
//     const handleFreeTrial = () => {
//         navigation.push('https://halal-in-the-city-merchant.netlify.app/')
//     }
//     return (
//         <footer className="footer">
//             <div className="footer-container">
//                 {/* Left Section */}
//                 <div className="footer-left">
//                     <div className="footer-logo">
//                         <img src="/logo.png" alt="Logo" />
//                     </div>
//                     {/* <h3 className="footer-title">Stay Updated</h3> */}
//                     {/* <p className="footer-description">
//             Join our community to get the latest updates and news.
//           </p> */}
//                     <button onClick={handleFreeTrial} className="footer-btn">Start Free Trial</button>

//                     <div className="footer-icons">
//                         <FaGithub />
//                         <FaDiscord />
//                         <FaLinkedinIn />
//                     </div>
//                 </div>

//                 {/* Middle Section */}
//                 <div className="footer-links">
//                     <div>
//                         <h4>Solutions</h4>
//                         <ul>
//                             <li>MCP Server</li>
//                             <li>Backend Testing</li>
//                             <li>Frontend Testing</li>
//                             <li>Data Testing</li>
//                             <li>AI Agent Testing</li>
//                         </ul>
//                     </div>
//                     <div>
//                         <h4>Resources</h4>
//                         <ul>
//                             <li>Docs</li>
//                             <li>About</li>
//                             <li>Blog</li>
//                         </ul>
//                     </div>
//                     <div>
//                         <h4>Legal</h4>
//                         <ul>
//                             <li>Terms & Conditions</li>
//                             <li>Privacy Policy</li>
//                         </ul>
//                     </div>
//                 </div>
//             </div>

//             {/* Bottom Bar */}
//             <div className="footer-bottom">
//                 <p>© {new Date().getFullYear()} TestSprite. All rights reserved.</p>

//                 <div className="footer-lang">
//                     <IoGlobeOutline />
//                     <select>
//                         <option>English</option>
//                         <option>Urdu</option>
//                     </select>
//                 </div>
//             </div>
//         </footer>
//     );
// };

// export default Footer;


// components/ContactFooter.jsx
'use client';
// components/ContactFooter.jsx
import { useState } from 'react';
import styles from './ContactFooter.module.css';

export default function ContactFooter() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [status, setStatus] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');

        // Simulate form submission
        setTimeout(() => {
            setStatus('success');
            setFormData({ name: '', email: '', message: '' });
            setTimeout(() => setStatus(''), 3000);
        }, 1500);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <>
            {/* Contact Section */}
            <section id="contact" className={styles.contactSection}>
                <div className={styles.container}>
                    <div className={styles.contactGrid}>
                        {/* Left Side - Contact Info */}
                        <div className={styles.contactInfo}>
                            <h2 className={styles.sectionTitle}>
                                Get <span className={styles.gradient}>Started Today</span>
                            </h2>
                            <p className={styles.description}>
                                Ready to grow your restaurant business? Contact us to learn more about how Halal in the City can help you reach more customers.
                            </p>

                            <div className={styles.infoCards}>
                                <div className={styles.infoCard}>
                                    <div className={styles.iconBox}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M3 8L10.89 13.26C11.54 13.67 12.46 13.67 13.11 13.26L21 8M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3>Email</h3>
                                        <p>hello@halalinthecity.com</p>
                                    </div>
                                </div>

                                <div className={styles.infoCard}>
                                    <div className={styles.iconBox}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M17.657 16.657L13.414 20.9C11.633 22.681 8.78901 22.681 7.00801 20.9L2.75701 16.657C0.975006 14.876 0.975006 12.032 2.75701 10.251L7.00001 6.00702C8.78101 4.22602 11.625 4.22602 13.406 6.00702L17.657 10.258C19.438 12.039 19.438 14.883 17.657 16.657Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3>Location</h3>
                                        <p>Serving Cities Nationwide</p>
                                    </div>
                                </div>

                                <div className={styles.infoCard}>
                                    <div className={styles.iconBox}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3>Response Time</h3>
                                        <p>Within 24 hours</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Contact Form */}
                        <div className={styles.formContainer}>
                            <form onSubmit={handleSubmit} className={styles.form}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="name">Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="Your name"
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="your@email.com"
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="message">Message</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        placeholder="Tell us about your project..."
                                        rows="5"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className={styles.submitBtn}
                                    disabled={status === 'sending'}
                                >
                                    {status === 'sending' ? 'Sending...' : status === 'success' ? 'Sent!' : 'Send Message'}
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer Section */}
            <footer className={styles.footer}>
                <div className={styles.container}>
                    <div className={styles.footerContent}>
                        {/* Logo & Stay Updated */}
                        <div className={styles.footerBrand}>
                            <div className={styles.logo}>
                               <img src="./logo.png" alt="TestSprite" />
                             </div>

                            {/* <div className={styles.stayUpdated}>
                                <h3>Stay Updated</h3> 
                                <button className={styles.discordBtn}>
                                    Join Discord
                                </button>
                            </div> */}

                            <div className={styles.socialLinks}>
                                <a href="#" aria-label="Twitter">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                    </svg>
                                </a>
                                <a href="#" aria-label="Discord">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                                    </svg>
                                </a>
                                <a href="#" aria-label="LinkedIn">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                    </svg>
                                </a>
                                <a href="#" aria-label="YouTube">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* Footer Links */}
                        <div className={styles.footerLinks}>
                            <div className={styles.linkColumn}>
                                <h4>Platform</h4>
                                <a href="#">Merchant Dashboard</a>
                                <a href="#">Mobile App</a>
                                <a href="#">Analytics</a>
                                <a href="#">Coupon Management</a>
                                <a href="#">Customer Insights</a>
                            </div>

                            <div className={styles.linkColumn}>
                                <h4>Resources</h4>
                                <a href="#">Getting Started</a>
                                <a href="#">Success Stories</a>
                                <a href="#">Support Center</a>
                                <a href="#">Blog</a>
                            </div>

                            <div className={styles.linkColumn}>
                                <h4>Legal</h4>
                                <a href="#">Terms & Conditions</a>
                                <a href="#">Privacy Policy</a>
                                <a href="#">Merchant Agreement</a>
                            </div>
                        </div>
                    </div>

                    {/* Footer Bottom */}
                    <div className={styles.footerBottom}>
                        {/* <div className={styles.certBadge}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            SOC 2 Certified
                        </div> */}
                        <p>Copyright © 2025 Halal in the City</p>
                        <div className={styles.language}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" />
                                <path d="M2 12H22M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z" stroke="currentColor" strokeWidth="2" />
                            </svg>
                            English
                        </div>
                    </div>
                </div>

                {/* Large Background Text */}
                <div className={styles.bgText}>
                    <p>HALAL IN THE CITY</p>
                </div>
            </footer>
        </>
    );
}

// ContactFooter.module.css