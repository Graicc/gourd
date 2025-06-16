import { useContext } from 'react';
import { PyodideContext } from '../pyodideContext';

export function usePyodideInShape() {
  return useContext(PyodideContext);
}
