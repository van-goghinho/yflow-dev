import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api, ApiError } from '../services/api';
import { WorkflowResult } from '../components/workflow/WorkflowResult';

interface WorkflowInput {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select';
  placeholder?: string;
  options?: string[];
  required?: boolean;
}

interface PublicWorkflow {
  id: string;
  name: string;
  description: string;
  category: string;
  webhookPath: string;
  definition: { inputs: WorkflowInput[] };
  createdAt: string;
}

const CATEGORY_ICONS: Record<string, string> = {
  IA: '🤖',
  Communication: '✉️',
  Productivité: '⚡',
  default: '⚙️',
};

export const WorkflowRunPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [workflow, setWorkflow] = useState<PublicWorkflow | null>(null);
  const [loadingWorkflow, setLoadingWorkflow] = useState(true);
  const [values, setValues] = useState<Record<string, string>>({});
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const workflows: PublicWorkflow[] = await api.getPublicWorkflows();
        const found = workflows.find((w) => w.id === id);
        if (!found) {
          setNotFound(true);
        } else {
          setWorkflow(found);
          const defaults: Record<string, string> = {};
          found.definition.inputs.forEach((input) => {
            defaults[input.name] = input.type === 'select' && input.options?.length ? input.options[0] : '';
          });
          setValues(defaults);
        }
      } catch {
        setNotFound(true);
      } finally {
        setLoadingWorkflow(false);
      }
    };
    load();
  }, [id]);

  const handleChange = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workflow) return;

    setRunning(true);
    setResult(null);
    setError(null);

    try {
      const data = await api.runWorkflow(workflow.id, values);
      setResult(data.result ?? "L'IA n'a pas retourné de résultat.");
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 0) setError('Impossible de contacter le serveur. Vérifiez votre connexion.');
        else if (err.status === 404) setError("Ce workflow n'a pas de webhook configuré.");
        else setError("Le workflow a rencontré une erreur. Veuillez réessayer.");
      } else {
        setError("Une erreur inattendue est survenue.");
      }
    } finally {
      setRunning(false);
    }
  };

  const handleRetry = () => {
    setResult(null);
    setError(null);
  };

  if (loadingWorkflow) {
    return (
      <div style={{ padding: '2rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>
        Chargement du workflow...
      </div>
    );
  }

  if (notFound || !workflow) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }}>Workflow introuvable.</p>
        <Link to="/app/gallery" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>
          ← Retour à la galerie
        </Link>
      </div>
    );
  }

  const icon = CATEGORY_ICONS[workflow.category] ?? CATEGORY_ICONS.default;

  return (
    <div style={{ padding: '2rem', maxWidth: '760px', margin: '0 auto', width: '100%' }}>
      {/* Retour */}
      <Link
        to="/app/gallery"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          color: 'var(--color-text-muted)',
          textDecoration: 'none',
          fontSize: '0.9rem',
          marginBottom: '1.5rem',
        }}
      >
        ← Retour à la galerie
      </Link>

      {/* En-tête workflow */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '2rem' }}>{icon}</span>
          <h1 style={{ margin: 0, fontSize: '1.8rem', color: 'white' }}>{workflow.name}</h1>
          <span style={{
            background: 'rgba(124,58,237,0.15)',
            border: '1px solid rgba(124,58,237,0.3)',
            color: '#a78bfa',
            padding: '0.2rem 0.6rem',
            borderRadius: '20px',
            fontSize: '0.8rem',
          }}>
            {workflow.category}
          </span>
        </div>
        <p style={{ color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.6 }}>
          {workflow.description}
        </p>
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit}>
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '1.5rem',
        }}>
          {workflow.definition.inputs.map((input) => (
            <div key={input.name} className="form-group" style={{ marginBottom: '1.2rem' }}>
              <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem', color: '#cbd5e1' }}>
                {input.label}
                {input.required && <span style={{ color: '#f87171', marginLeft: '0.2rem' }}>*</span>}
              </label>

              {input.type === 'textarea' && (
                <textarea
                  value={values[input.name] ?? ''}
                  onChange={(e) => handleChange(input.name, e.target.value)}
                  placeholder={input.placeholder}
                  required={input.required}
                  rows={6}
                  disabled={running}
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    padding: '0.75rem',
                    color: 'white',
                    fontSize: '0.95rem',
                    resize: 'vertical',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              )}

              {input.type === 'text' && (
                <input
                  type="text"
                  className="form-input"
                  value={values[input.name] ?? ''}
                  onChange={(e) => handleChange(input.name, e.target.value)}
                  placeholder={input.placeholder}
                  required={input.required}
                  disabled={running}
                />
              )}

              {input.type === 'select' && input.options && (
                <select
                  value={values[input.name] ?? input.options[0]}
                  onChange={(e) => handleChange(input.name, e.target.value)}
                  required={input.required}
                  disabled={running}
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    padding: '0.75rem',
                    color: 'white',
                    fontSize: '0.95rem',
                    outline: 'none',
                  }}
                >
                  {input.options.map((opt) => (
                    <option key={opt} value={opt} style={{ background: '#1a1a2e' }}>
                      {opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </option>
                  ))}
                </select>
              )}
            </div>
          ))}

          <button
            type="submit"
            className="btn-primary"
            disabled={running}
            style={{ opacity: running ? 0.6 : 1, cursor: running ? 'not-allowed' : 'pointer', marginTop: '0.5rem' }}
          >
            {running ? '⚙️ Traitement en cours...' : '🚀 Lancer le workflow'}
          </button>
        </div>
      </form>

      {/* Résultat */}
      {(running || result || error) && (
        <WorkflowResult
          loading={running}
          error={error}
          result={result}
          onRetry={handleRetry}
        />
      )}
    </div>
  );
};
