import React from 'react';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/landing/Hero';
import { Features } from '../components/landing/Features';
import { About } from '../components/landing/About';
import { Footer } from '../components/Footer';

export const LandingPage: React.FC = () => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <main>
                <Hero />
                <Features />
                <About />
            </main>
            <Footer />
        </div>
    );
};
