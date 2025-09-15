/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface UseSearchQuery {
  delay?: number;
  searchKey: string;
  deleteKeys?: string[];
}

export const useSearchQuery = ({
  delay = 500,
  searchKey = "query",
  deleteKeys,
}: UseSearchQuery) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialQuery = searchParams.get(searchKey) || "";
  const [inputValue, setInputValue] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (inputValue.trim()) {
        params.set(searchKey, inputValue);

        if (deleteKeys && deleteKeys.length > 0) {
          for (const key of deleteKeys) {
            if (params.has(key)) {
              params.delete(key);
            }
          }
        }
      } else {
        params.delete(searchKey);
      }

      router.replace(`?${params.toString()}`);
      setDebouncedQuery(inputValue);
    }, delay);

    return () => clearTimeout(handler);
  }, [inputValue, delay, router, searchParams, searchKey]);

  return {
    inputValue,
    setInputValue,
    debouncedQuery,
  };
};
