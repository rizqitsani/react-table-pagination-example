import * as React from 'react';
import { UseQueryResult } from 'react-query';
import toast from 'react-hot-toast';

type OptionType = {
  runCondition?: boolean;
  loading?: string;
  success?: string;
  error?: string;
};

const defaultToastMessage = {
  loading: 'Loading...',
  success: 'Data fetched successfully',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: (err: any) =>
    err?.response?.data?.msg + '' ?? 'Something is wrong, please try again',
};

export default function useRQToast<T, E>(
  query: UseQueryResult<T, E>,
  { runCondition = true, ...customMessages }: OptionType = {},
) {
  const { data, isError, isLoading } = query;

  const toastStatus = React.useRef<string>(data ? 'done' : 'idle');
  const toastMessage = {
    ...defaultToastMessage,
    ...customMessages,
  };

  React.useEffect(() => {
    if (!runCondition) return;

    if (isError) {
      toast.error(toastMessage.error, { id: toastStatus.current });
      toastStatus.current = 'done';
    } else if (isLoading) {
      toastStatus.current = toast.loading(toastMessage.loading);
    } else if (data) {
      toast.success(toastMessage.success, { id: toastStatus.current });
      toastStatus.current = 'done';
    }

    return () => {
      toast.dismiss(toastStatus.current);
    };
  }, [
    data,
    isError,
    isLoading,
    runCondition,
    toastMessage.error,
    toastMessage.loading,
    toastMessage.success,
  ]);

  return { ...query };
}