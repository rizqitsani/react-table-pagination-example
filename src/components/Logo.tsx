import NextLink from 'next/link';
import { Text } from '@chakra-ui/react';

const Logo = () => {
  return (
    <NextLink href='/' passHref>
      <Text as='a' fontSize='lg' fontWeight='semibold'>
        React Table Pagination
      </Text>
    </NextLink>
  );
};

export default Logo;
