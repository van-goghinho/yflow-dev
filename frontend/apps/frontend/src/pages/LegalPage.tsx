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
                        <strong>Y'Flow SAS</strong><br />
                        Société par actions simplifiée au capital de 10 000 €<br />
                        RCS Paris B 987 654 321<br />
                        Siège social : 14 Rue de la Tech, 75011 Paris, France<br />
                        TVA Intracommunautaire : FR 12 987654321<br />
                        Directeur de la publication : Ilian (CEO)
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>2. Hébergement et Infrastructure</h2>
                    <p style={{ color: '#aab0bd', lineHeight: 1.6 }}>
                        La plateforme Y'Flow est hébergée sur une infrastructure privée haute disponibilité.<br />
                        Prestataire principal : Hetzner Online GmbH (Allemagne).<br />
                        Les données sont stockées et traitées exclusivement au sein de l'Union Européenne, en conformité avec le RGPD.
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>3. Propriété Intellectuelle</h2>
                    <p style={{ color: '#aab0bd', lineHeight: 1.6 }}>
                        L'ensemble des éléments graphiques, logiciels, codes sources et textes de la plateforme Y'Flow sont la propriété exclusive de Y'Flow SAS.
                        Toute reproduction, distribution ou modification sans autorisation écrite préalable est strictement interdite.
                    </p>
                </section>

                <section>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>4. Conditions Générales d'Utilisation (CGU)</h2>
                    <p style={{ color: '#aab0bd', lineHeight: 1.6, marginBottom: '1rem' }}>
                        L'accès à la plateforme Y'Flow est réservé aux professionnels. En créant un compte, vous acceptez sans réserve les présentes conditions.
                    </p>
                    <ul style={{ color: '#aab0bd', lineHeight: 1.6, paddingLeft: '1.5rem' }}>
                        <li>Vous êtes responsable de la confidentialité de vos identifiants d'accès.</li>
                        <li>L'usage de la plateforme à des fins illégales ou malveillantes est strictement interdit.</li>
                        <li>Y'Flow se réserve le droit de suspendre tout compte ne respectant pas ces règles.</li>
                    </ul>
                </section>
            </main>
            <Footer />
        </div>
    );
};
