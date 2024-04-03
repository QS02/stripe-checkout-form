import { useRouter } from 'next/router';

import { Wrapper } from '@/components/Wrapper';
import CheckoutForm from '@/components/CheckoutForm';

export default function Checkout() {
  const router = useRouter();
  const { secret } = router.query;

  return (
    <div
      style={{
        width: '100%',
        height: '90vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {secret && (
        <Wrapper clientSecret={secret}>
          <CheckoutForm clientSecret={secret} />
        </Wrapper>
      )}
    </div>
  );
}
