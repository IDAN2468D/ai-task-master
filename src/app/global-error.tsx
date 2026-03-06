'use client';

// IMPORTANT: Do NOT import { Html, Head, Main, NextScript } from 'next/document'
// Those are ONLY for pages/_document.js in Pages Router.
// In App Router's global-error.tsx, use standard lowercase <html> and <body> tags.

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html lang="he" dir="rtl">
            <body style={{
                margin: 0,
                padding: 0,
                backgroundColor: '#0B1437',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                fontFamily: 'sans-serif',
                textAlign: 'center'
            }}>
                <div style={{ maxWidth: '400px', padding: '20px' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '1rem' }}>אופס! שגיאה</h2>
                    <p style={{ opacity: 0.8, marginBottom: '2rem', fontWeight: '500' }}>משהו השתבש בטעינת המערכת. אנחנו עושים מאמץ לתקן זאת.</p>
                    <button
                        onClick={() => reset()}
                        style={{
                            padding: '14px 28px',
                            backgroundColor: '#4318FF',
                            color: 'white',
                            border: 'none',
                            borderRadius: '16px',
                            cursor: 'pointer',
                            fontWeight: '900',
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                        }}
                    >
                        נסה לטעון מחדש
                    </button>
                    {error.digest && (
                        <p style={{ marginTop: '2rem', fontSize: '0.6rem', opacity: 0.4 }}>
                            Error ID: {error.digest}
                        </p>
                    )}
                </div>
            </body>
        </html>
    );
}
