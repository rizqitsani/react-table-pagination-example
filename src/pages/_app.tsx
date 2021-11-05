import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { DefaultSeo } from 'next-seo';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Toaster } from 'react-hot-toast';
import { ChakraProvider } from '@chakra-ui/react';

import theme from '@/theme';

import DEFAULT_SEO from '../../next-seo.config.js';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <DefaultSeo
          {...DEFAULT_SEO}
          canonical={`https://learn-react-table-pagination.vercel.app${router.asPath}`}
          openGraph={{
            url: `https://learn-react-table-pagination.vercel.app${router.asPath}`,
          }}
        />
        <div>
          <Toaster
            reverseOrder={false}
            toastOptions={{
              style: {
                borderRadius: '8px',
                background: '#333',
                color: '#fff',
              },
            }}
          />
        </div>
        <NavBar />
        <Component {...pageProps} />
        <Footer />
      </ChakraProvider>
      <ReactQueryDevtools initialIsOpen={false} position='bottom-right' />
    </QueryClientProvider>
  );
}

export default MyApp;
