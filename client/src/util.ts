import { AxiosInstance } from 'axios';
import { useState, useEffect, createRef } from 'react';
import * as React from 'react';
import { fold } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';
import * as t from 'io-ts';

// https://usehooks.com/useDebounce/
// Hook
export function useDebounce<T>(value: T, delay: number):T{
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return ():void => {
        clearTimeout(handler);
      };
    },
    [value, delay] // Only re-call effect if value or delay changes
  );

  return debouncedValue;
}


interface useSearchReturn {
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  data: any;
  isSearching: boolean;
  error: boolean;
}
export function useSearch<T>(delay: number, axios: AxiosInstance, url: string, count: number): useSearchReturn{
  const [inputValue, setInputValue] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [data, setData] = useState<T>();
  const searchValue = useDebounce<string>(inputValue, delay);

  useEffect(() => {
    const fetchData = (): void => {
      setIsSearching(true);
      setError(false);
      axios.get(url, {params: {count: count, search: searchValue}})
        .then(res => res.data)
        .then(data => {
          setData(data); 
          setIsSearching(false);
        })
        .catch(_error => {
          setError(true);
          setIsSearching(false);
        });
    }

    if(searchValue){
      fetchData();
    }

  },[searchValue]);

  return {inputValue, setInputValue, data, isSearching, error}
}

interface useValidatorReturn<T>{
  data: T;
  error: boolean;
}
export function useValidator<T, O = T, I = unknown>(validator: t.Type<T, O, I>, dataToValidate: any, initialState: T): useValidatorReturn<T>{
  const [data, setData] = useState<T>(initialState);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const validate = (): void => {
      const onLeft = (_err: t.Errors):void => {
        setError(true);
      }
      const onRight = (validData: T): void => {
        setData(validData);
      }

      setError(false);
      pipe(validator.decode(dataToValidate), fold(onLeft, onRight));
    }

    validate();

  }, [dataToValidate]);

  return {data, error}
}

export function useScrollToBottomIfAtTop(dependencies: any[]): React.LegacyRef<HTMLDivElement>{
  const ref= createRef<HTMLDivElement>();

  useEffect(() => {
    const scrollToBottom = (ref: HTMLDivElement): void => {
      const bottom =  ref.scrollHeight - ref.clientHeight;
      ref.scrollTo(0, bottom);
    }

    if(ref.current) {
      if(ref.current.scrollTop === 0){
        scrollToBottom(ref.current);
      }
    }
  }, dependencies);

  return ref;
}