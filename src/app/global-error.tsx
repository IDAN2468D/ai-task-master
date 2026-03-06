'use client';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html lang="he" dir="rtl">
            <body style={{ margin: 0, padding: 0, backgroundColor: '#0B1437', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'sans-serif' }}>
                <div style={{ textAlign: 'center' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>שגיאת מערכת</h2>
                    <p style={{ opacity: 0.7, marginBottom: '2rem' }}>משהו השתבש בטעינת האפליקציה.</p>
                    <button
                        onClick={() => reset()}
                        style={{ padding: '10px 20px', backgroundColor: '#4318FF', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        נסה שוב
                    </button>
                    {error.message && <pre style={{ marginTop: '2rem', fontSize: '0.7rem', color: '#ff4444' }}>{error.message}</pre>}
                </div>
            </body>
        </html>
    );
}
