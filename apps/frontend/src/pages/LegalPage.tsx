import React from 'react';
import { Footer } from '../components/Footer';

export const LegalPage: React.FC = () => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <main style={{ flex: 1, padding: '4rem 2rem', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: 'var(--color-primary)' }}>Mentions Légales & CGU</h1>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>1. Éditeur du site</h2>
                    <p style={{ color: '#aab0bd', lineHeight: 1.6 }}>
                        Y'Flow<br />
                        SAS au capital de 10 000 €<br />
                        RCS Paris B 123 456 789<br />
                        Siège social : 123 Avenue de l'Innovation, 75000 Paris
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>2. Hébergement</h2>
                    <p style={{ color: '#aab0bd', lineHeight: 1.6 }}>
                        Ce site est hébergé sur une infrastructure privée sécurisée.
                    </p>
                </section>

                <section>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>3. Conditions Générales d'Utilisation</h2>
                    <p style={{ color: '#aab0bd', lineHeight: 1.6 }}>
                        L'utilisation de la plateforme Y'Flow implique l'acceptation pleine et entière des conditions générales d'utilisation décrites ci-après...
                    </p>
                </section>
            </main>
            <Footer />
        </div>
    );
};
