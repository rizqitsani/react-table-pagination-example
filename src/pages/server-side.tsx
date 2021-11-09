import * as React from 'react';
import { NextSeo } from 'next-seo';
import axios from 'axios';
import { useQuery } from 'react-query';
import { CellProps, usePagination, useTable } from 'react-table';
import {
  Alert,
  AlertIcon,
  Badge,
  ButtonGroup,
  Heading,
  HStack,
  IconButton,
  Link,
  Select,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue as mode,
  VStack,
} from '@chakra-ui/react';

import {
  HiChevronLeft,
  HiChevronRight,
  HiOutlineExternalLink,
} from 'react-icons/hi';

import useRQToast from '@/hooks/useRQToast';
import useRenderCount from '@/hooks/useRenderCount';
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

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable<DataType>(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: queryPageSize },
      manualPagination: true,

      pageCount: Math.ceil(DATA_LENGTH / queryPageSize),
    },
    usePagination,
  );

  React.useEffect(() => {
    setQueryPageIndex(pageIndex);
    setQueryPageSize(pageSize);
  }, [pageIndex, pageSize]);

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

          <VStack w='full' align='start' spacing={4}>
            <HStack minW='xs'>
              <Select
                size='sm'
                maxW='70px'
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                }}
              >
                {[10, 20, 50].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </Select>
              <Text>entries per page</Text>
            </HStack>
            <Table variant='striped' colorScheme='gray' {...getTableProps()}>
              <colgroup>
                <col span={1} style={{ width: '5%' }} />
                <col span={1} style={{ width: '80%' }} />
                <col span={1} style={{ width: '15%' }} />
              </colgroup>
              <Thead>
                {headerGroups.map((headerGroup, index) => (
                  <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
                    {headerGroup.headers.map((column) => (
                      <Th {...column.getHeaderProps()} key={column.id}>
                        {column.render('Header')}
                      </Th>
                    ))}
                  </Tr>
                ))}
              </Thead>
              <Tbody {...getTableBodyProps()}>
                {page?.map((row, index) => {
                  prepareRow(row);
                  return (
                    <Tr {...row.getRowProps()} key={index}>
                      {row?.cells?.map((cell, index) => {
                        return (
                          <Td {...cell.getCellProps()} key={index}>
                            {cell.render('Cell')}
                          </Td>
                        );
                      })}
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
            <HStack w='full' justify='space-between'>
              <Text>
                Showing {pageIndex * pageSize + 1} to{' '}
                {(pageIndex + 1) * pageSize} of {DATA_LENGTH} entries
              </Text>
              <ButtonGroup isAttached variant='outline'>
                <IconButton
                  aria-label='Go to previous page'
                  icon={<HiChevronLeft size={20} />}
                  disabled={!canPreviousPage}
                  onClick={() => previousPage()}
                />
                <IconButton
                  aria-label='Go to next page'
                  icon={<HiChevronRight size={20} />}
                  disabled={!canNextPage}
                  onClick={() => nextPage()}
                />
              </ButtonGroup>
            </HStack>
          </VStack>
        </VStack>
      </Container>
    </>
  );
};

export default ServerSidePage;
