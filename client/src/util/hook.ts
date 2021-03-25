import { AxiosInstance } from 'axios';
import { useState, useEffect, useRef } from 'react';
import * as React from 'react';
import { fold } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';
import * as t from 'io-ts';
import { PathReporter } from 'io-ts/lib/PathReporter';

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


// searches for the input value on a given delay using a given api route
interface useSearchReturn {
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  data: any;
  isSearching: boolean;
  error: boolean;
  errMsg: any;
}
export function useSearch<T>(delay: number, axios: AxiosInstance, url: string, count: number): useSearchReturn{
  const [inputValue, setInputValue] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState<any>();
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
        .catch(error => {
          setErrMsg(error);
          setError(true);
          setIsSearching(false);
        });
    }

    if(searchValue){
      fetchData();
    }

  },[searchValue]);

  return {inputValue, setInputValue, data, isSearching, error, errMsg}
}

// validation as a hook
interface useValidatorReturn<T>{
  data: T;
  setData: React.Dispatch<React.SetStateAction<T>>;
  error: boolean;
  errMsg: string[];
}
export function useValidator<T, O = T, I = unknown>(validator: t.Type<T, O, I>, dataToValidate: any, initialState: T): useValidatorReturn<T>{
  const [data, setData] = useState<T>(initialState);
  const [error, setError] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState<string[]>([]);
  const resetError = (): void => {
    setError(false);
    setErrMsg([]);
  }

  useEffect(() => {
    const validate = (): void => {
      const onLeft = (_err: t.Errors):void => {
        setError(true);
        setErrMsg(PathReporter.report(decoded));
      }
      const onRight = (validData: T): void => {
        setData(validData);
      }

      resetError();
      let decoded: t.Validation<T>;
      pipe(decoded = validator.decode(dataToValidate), fold(onLeft, onRight));
    }

    validate();

  }, [dataToValidate]);

  return {data, setData, error, errMsg}
}

// scrolls to the bottom of a div if at the top of the div
export function useScrollToBottomIfAtTop(dependencies: any[]): React.LegacyRef<HTMLDivElement>{
  const ref= useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollToBottom = (ref: HTMLDivElement): void => {
      const bottom =  ref.scrollHeight - ref.clientHeight;
      ref.scrollTo(0, bottom);
    }

    if(ref && ref.current) {
      if(ref.current.scrollTop === 0){
        scrollToBottom(ref.current);
      }
    }
  }, dependencies);

  return ref;
}

// prints errors
interface GenericError<T> {
  error: boolean;
  errMsg: T;
}
export function useErrorPrinter<T>(dependencies: GenericError<T>[], errorType = ''): void{
  useEffect(() => {
    dependencies.forEach((error) => {
      if(error) console.error(errorType, error.errMsg);
    });
  }, [dependencies])
}