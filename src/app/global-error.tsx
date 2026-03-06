'use client';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html>
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
                    <button
                        onClick={() => reset()}
                        style={{
                            padding: '14px 28px',
                            backgroundColor: '#4318FF',
                            color: 'white',
                            border: 'none',
                            borderRadius: '16px',
                            cursor: 'pointer',
                            fontWeight: '900'
                        }}
                    >
                        נסה לטעון מחדש
                    </button>
                </div>
            </body>
        </html>
    );
}
