import { useRouter } from 'next/router';

export default function Page() {
  const router = useRouter();

  return (
    <main>
      <div
        style={{
          width: '100%',
          height: '90vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 20,
        }}
      >
        <h3>Payment success!</h3>
        <button style={{ maxWidth: '200px' }} onClick={() => router.push(`/`)}>
          Go to Home
        </button>
      </div>
    </main>
  );
}
