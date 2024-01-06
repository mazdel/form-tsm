"use client";
import { useState, useEffect } from "react";

/**
 * Custom react hook to manage sessionStorage
 * @param {string} key sessionStorage key
 * @param {string} defaultValue default value of the key
 * @returns {[any,function]}
 */
export const useLocalStorage = (key, defaultValue) => {
  const [value, setValue] = useState(defaultValue);

  const changeValue = (value) => {
    setValue(value);
    sessionStorage.setItem(key, JSON.stringify(value));
  };

  useEffect(() => {
    const stored = sessionStorage.getItem(key);
    if (!stored) {
      setValue(defaultValue);
      sessionStorage.setItem(key, JSON.stringify(defaultValue));
    } else {
      setValue(JSON.parse(stored));
    }
  }, [defaultValue, key]);

  return [value, changeValue];
};
