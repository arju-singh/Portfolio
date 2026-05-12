import React from 'react';

const Footer = () => {
    const year = new Date().getFullYear();
    return (
        <footer className="site-footer">
            <p className="copyright">
                © {year} Arju Singh | Entrepreneur &amp; Tech Innovator
            </p>
        </footer>
    );
};

export default Footer;
