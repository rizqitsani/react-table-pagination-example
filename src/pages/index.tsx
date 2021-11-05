import Link from 'next/link';
import { NextSeo } from 'next-seo';
import {
  Button,
  Heading,
  useColorModeValue as mode,
  VStack,
} from '@chakra-ui/react';

import Container from '@/components/Container';

const HomePage = () => {
  return (
    <>
      <NextSeo title='Home' />

      <Container as='main'>
        <VStack
          as='section'
          justify='center'
          minHeight={{ base: 'calc(100vh - 7.5rem)', md: 'calc(100vh - 8rem)' }}
          spacing={6}
        >
          <Heading as='h1' color={mode('gray.900', 'orange.300')}>
            React Table Pagination
          </Heading>
          <VStack>
            <Link href='/client-side' passHref>
              <Button as='a' colorScheme='orange'>
                Client Side
              </Button>
            </Link>
            <Link href='/server-side' passHref>
              <Button as='a' colorScheme='orange'>
                Server Side
              </Button>
            </Link>
          </VStack>
        </VStack>
      </Container>
    </>
  );
};

export default HomePage;
