import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Footer } from '../components/Footer';

const NAV_ITEMS = [
    { path: '/legal',          label: 'Mentions légales' },
    { path: '/cgu',            label: 'CGU' },
    { path: '/confidentialite', label: 'Confidentialité' },
];

const MentionsLegales: React.FC = () => (
    <>
        <h1 style={{ fontSize: '2rem', marginBottom: '2rem', color: 'var(--color-primary)' }}>Mentions Légales</h1>

        <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '0.75rem', color: 'white' }}>Éditeur du site</h2>
            <p style={{ color: '#aab0bd', lineHeight: 1.7 }}>
                Y'Flow — Projet académique réalisé dans le cadre du cursus B3 Informatique à Ynov Campus Aix-en-Provence.<br />
                Contact : <a href="mailto:yflowprojet@gmail.com" style={{ color: 'var(--color-primary)' }}>yflowprojet@gmail.com</a>
            </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '0.75rem', color: 'white' }}>Responsable de la publication</h2>
            <p style={{ color: '#aab0bd', lineHeight: 1.7 }}>
                Équipe projet Y'Flow — Ynov Campus Aix-en-Provence
            </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '0.75rem', color: 'white' }}>Hébergement</h2>
            <p style={{ color: '#aab0bd', lineHeight: 1.7 }}>
                OVHcloud — SAS au capital de 10 069 020 €<br />
                Siège social : 2 rue Kellermann, 59100 Roubaix, France<br />
                Téléphone : 1007
            </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '0.75rem', color: 'white' }}>Propriété intellectuelle</h2>
            <p style={{ color: '#aab0bd', lineHeight: 1.7 }}>
                Le contenu de ce site (textes, images, code source) est la propriété de l'équipe projet Y'Flow dans le cadre de leur formation à Ynov Campus. Toute reproduction sans autorisation est interdite.
            </p>
        </section>

        <section>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '0.75rem', color: 'white' }}>Protection des données personnelles</h2>
            <p style={{ color: '#aab0bd', lineHeight: 1.7 }}>
                Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles. Pour exercer ces droits, contactez : <a href="mailto:yflowprojet@gmail.com" style={{ color: 'var(--color-primary)' }}>yflowprojet@gmail.com</a>
            </p>
            <p style={{ color: '#aab0bd', lineHeight: 1.7, marginTop: '0.75rem' }}>
                Données collectées :
            </p>
            <ul style={{ color: '#aab0bd', lineHeight: 1.7, paddingLeft: '1.5rem' }}>
                <li>Email et nom lors de l'inscription</li>
                <li>Données d'utilisation des workflows (textes soumis, résultats générés)</li>
            </ul>
            <p style={{ color: '#aab0bd', lineHeight: 1.7, marginTop: '0.75rem' }}>
                Les données sont stockées sur un serveur OVHcloud situé en France et ne sont pas partagées avec des tiers, à l'exception des appels API vers Mistral AI pour le traitement des workflows.
            </p>
        </section>
    </>
);

const CGU: React.FC = () => (
    <>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>Conditions Générales d'Utilisation</h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>Dernière mise à jour : Mars 2026</p>

        {[
            {
                title: 'Article 1 — Objet',
                content: "Les présentes CGU régissent l'utilisation de la plateforme Y'Flow, un service d'automatisation de workflows utilisant l'intelligence artificielle.",
            },
            {
                title: 'Article 2 — Accès au service',
                content: "L'accès à Y'Flow nécessite la création d'un compte utilisateur. L'utilisateur s'engage à fournir des informations exactes lors de l'inscription et à maintenir la confidentialité de ses identifiants.",
            },
            {
                title: 'Article 3 — Description du service',
                content: "Y'Flow propose une galerie de workflows automatisés utilisant l'IA (Mistral). Les utilisateurs peuvent sélectionner un workflow, fournir des données en entrée, et recevoir un résultat généré par l'IA.",
            },
            {
                title: 'Article 4 — Responsabilité',
                content: "Les résultats générés par l'IA sont fournis à titre indicatif. Y'Flow ne garantit pas l'exactitude, l'exhaustivité ou la pertinence des contenus générés. L'utilisateur est seul responsable de l'utilisation qu'il fait des résultats.",
            },
            {
                title: 'Article 5 — Données personnelles',
                content: "Les données personnelles collectées sont traitées conformément au RGPD. Voir notre politique de confidentialité pour plus de détails.",
            },
            {
                title: 'Article 6 — Propriété intellectuelle',
                content: "Les contenus générés par les workflows appartiennent à l'utilisateur qui les a générés. Le code source, le design et la marque Y'Flow sont la propriété de l'équipe projet.",
            },
            {
                title: 'Article 7 — Limitation de responsabilité',
                content: "Y'Flow est un projet académique fourni « en l'état ». L'équipe ne saurait être tenue responsable des dommages directs ou indirects résultant de l'utilisation du service.",
            },
            {
                title: 'Article 8 — Modification des CGU',
                content: "L'équipe Y'Flow se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront informés des modifications par notification sur la plateforme.",
            },
        ].map(({ title, content }) => (
            <section key={title} style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'white' }}>{title}</h2>
                <p style={{ color: '#aab0bd', lineHeight: 1.7, margin: 0 }}>{content}</p>
            </section>
        ))}
    </>
);

const Confidentialite: React.FC = () => (
    <>
        <h1 style={{ fontSize: '2rem', marginBottom: '2rem', color: 'var(--color-primary)' }}>Politique de confidentialité</h1>

        <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '0.75rem', color: 'white' }}>Données collectées</h2>
            <ul style={{ color: '#aab0bd', lineHeight: 1.7, paddingLeft: '1.5rem' }}>
                <li>Nom et adresse email (inscription)</li>
                <li>Textes soumis aux workflows IA (traitement en temps réel, non conservés)</li>
                <li>Date de création du compte</li>
            </ul>
        </section>

        <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '0.75rem', color: 'white' }}>Utilisation des données</h2>
            <p style={{ color: '#aab0bd', lineHeight: 1.7 }}>
                Vos données sont utilisées uniquement pour le fonctionnement de la plateforme : authentification, affichage de votre profil, exécution des workflows demandés.
            </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '0.75rem', color: 'white' }}>Stockage et sécurité</h2>
            <p style={{ color: '#aab0bd', lineHeight: 1.7 }}>
                Les données sont stockées sur un serveur OVHcloud en France. Les mots de passe sont chiffrés avec bcrypt. Les sessions sont sécurisées par JWT.
            </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '0.75rem', color: 'white' }}>Tiers et API</h2>
            <p style={{ color: '#aab0bd', lineHeight: 1.7 }}>
                Les textes soumis aux workflows sont transmis à l'API Mistral AI pour traitement. Aucune autre donnée n'est partagée avec des tiers.
            </p>
        </section>

        <section>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '0.75rem', color: 'white' }}>Vos droits (RGPD)</h2>
            <p style={{ color: '#aab0bd', lineHeight: 1.7 }}>
                Vous pouvez demander l'accès, la rectification ou la suppression de vos données à tout moment en contactant :{' '}
                <a href="mailto:yflowprojet@gmail.com" style={{ color: 'var(--color-primary)' }}>yflowprojet@gmail.com</a>
            </p>
        </section>
    </>
);

export const LegalPage: React.FC = () => {
    const { pathname } = useLocation();

    const renderContent = () => {
        if (pathname === '/cgu') return <CGU />;
        if (pathname === '/confidentialite') return <Confidentialite />;
        return <MentionsLegales />;
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <main style={{ flex: 1, padding: '4rem 2rem', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
                {/* Navigation entre sections */}
                <nav style={{ display: 'flex', gap: '0.5rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
                    {NAV_ITEMS.map(({ path, label }) => (
                        <Link
                            key={path}
                            to={path}
                            style={{
                                padding: '0.4rem 1rem',
                                borderRadius: '20px',
                                fontSize: '0.9rem',
                                textDecoration: 'none',
                                background: pathname === path ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.04)',
                                border: `1px solid ${pathname === path ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.08)'}`,
                                color: pathname === path ? '#a78bfa' : 'var(--color-text-muted)',
                            }}
                        >
                            {label}
                        </Link>
                    ))}
                </nav>

                {renderContent()}
            </main>
            <Footer />
        </div>
    );
};
