import * as React from 'react';
import {
  Column,
  PluginHook,
  TableOptions,
  usePagination,
  useTable,
} from 'react-table';
import {
  ButtonGroup,
  HStack,
  IconButton,
  Select,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from '@chakra-ui/react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

type BaseTableProps<T extends object> = {
  columns: Column<T>[];
  data: T[];
  options?: Omit<TableOptions<T>, 'data' | 'columns'>;
  plugins?: PluginHook<T>[];
} & (
  | {
      isServerSide?: false;
      setQueryPageIndex?: never;
      setQueryPageSize?: never;
    }
  | {
      isServerSide: true;
      setQueryPageIndex: React.Dispatch<React.SetStateAction<number>>;
      setQueryPageSize: React.Dispatch<React.SetStateAction<number>>;
    }
);

const BaseTable = <T extends object>({
  columns,
  data,
  isServerSide = false,
  options,
  plugins = [],
  setQueryPageIndex,
  setQueryPageSize,
}: BaseTableProps<T>) => {
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
  } = useTable<T>({ ...options, columns, data }, usePagination, ...plugins);

  React.useEffect(() => {
    if (isServerSide && setQueryPageIndex && setQueryPageSize) {
      setQueryPageIndex(pageIndex);
      setQueryPageSize(pageSize);
    }
  }, [isServerSide, pageIndex, pageSize, setQueryPageIndex, setQueryPageSize]);

  return (
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
          Showing {pageIndex * pageSize + 1} to {(pageIndex + 1) * pageSize} of{' '}
          {data.length} entries
        </Text>
        <ButtonGroup isAttached variant='outline'>
          <IconButton
            aria-label='Go to previous page'
            icon={<HiChevronLeft />}
            disabled={!canPreviousPage}
            onClick={() => previousPage()}
          />
          <IconButton
            aria-label='Go to next page'
            icon={<HiChevronRight />}
            disabled={!canNextPage}
            onClick={() => nextPage()}
          />
        </ButtonGroup>
      </HStack>
    </VStack>
  );
};

export default BaseTable;
