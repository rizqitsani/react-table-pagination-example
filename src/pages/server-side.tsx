import * as React from 'react';
import { NextSeo } from 'next-seo';
import axios from 'axios';
import { useQuery } from 'react-query';
import { CellProps } from 'react-table';
import {
  Alert,
  AlertIcon,
  Badge,
  Heading,
  Link,
  useColorModeValue as mode,
  VStack,
} from '@chakra-ui/react';

import { HiOutlineExternalLink } from 'react-icons/hi';

import useRQToast from '@/hooks/useRQToast';
import useRenderCount from '@/hooks/useRenderCount';
import BaseTable from '@/components/BaseTable';
import Container from '@/components/Container';
import { DataType } from '@/types';

// Should be the length of data, usually returned by API
const DATA_LENGTH = 200;

type Key = { pageSize: number; pageIndex: number };

const queryFn = async ({ pageIndex, pageSize }: Key) => {
  const { data } = await axios.get(
    `https://jsonplaceholder.typicode.com/todos?_limit=${pageSize}&_page=${
      pageIndex + 1
    }`,
  );
  return data;
};

const ServerSidePage = () => {
  const [queryPageIndex, setQueryPageIndex] = React.useState(0);
  const [queryPageSize, setQueryPageSize] = React.useState(10);

  const renderCount = useRenderCount();

  const queryKey: Key = {
    pageSize: queryPageSize,
    pageIndex: queryPageIndex,
  };

  const { data: queryData } = useRQToast(
    useQuery<DataType[], Error>(
      ['server-side', queryKey],
      () => queryFn(queryKey),
      { keepPreviousData: true },
    ),
  );

  const data = queryData ?? [];

  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id' as const,
      },
      {
        Header: 'Title',
        accessor: 'title' as const,
      },
      {
        Header: 'Status',
        accessor: 'completed' as const,
        Cell: ({ value }: CellProps<DataType>) => {
          return value ? (
            <Badge size='sm' colorScheme='green'>
              Completed
            </Badge>
          ) : (
            <Badge colorScheme='red'>Todo</Badge>
          );
        },
      },
    ],
    [],
  );

  return (
    <>
      <NextSeo title='Server Side' />

      <Container as='main'>
        <VStack
          as='section'
          align='start'
          minHeight={{ base: 'calc(100vh - 7.5rem)', md: 'calc(100vh - 8rem)' }}
          py={8}
          spacing={6}
        >
          <Link
            display='flex'
            alignItems='flex-end'
            href='https://github.com/rizqitsani/learn-react-table-pagination/blob/main/src/pages/server-side.tsx'
            isExternal
            _focus={{ outline: 'none' }}
          >
            <Heading
              as='h1'
              mr={2}
              size='xl'
              color={mode('gray.900', 'orange.300')}
            >
              Server Side Pagination
            </Heading>
            <HiOutlineExternalLink size={24} />
          </Link>

          <Alert colorScheme='orange'>
            <AlertIcon />
            Render Counter: {renderCount}
          </Alert>

          <BaseTable
            columns={columns}
            data={data}
            options={{
              initialState: { pageIndex: 0, pageSize: queryPageSize },
              manualPagination: true,
              pageCount: Math.ceil(DATA_LENGTH / queryPageSize),
            }}
            setQueryPageIndex={setQueryPageIndex}
            setQueryPageSize={setQueryPageSize}
            isServerSide
          />
        </VStack>
      </Container>
    </>
  );
};

export default ServerSidePage;
