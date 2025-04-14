/**
 * Custom hook to handle test IDs in components
 * This hook extracts the data-testid from props and provides clean props without data-testid
 * to avoid attribute duplication
 * 
 * @param props Props object that might contain data-testid
 * @returns An object with dataTestId and cleanProps
 */
export const useTestId = <T extends Record<string, any>>(props: T) => {
  // Extract data-testid
  const dataTestId = props['data-testid' as keyof typeof props] as string | undefined
  
  // Remove data-testid from props to avoid duplication
  const { ['data-testid']: _, ...cleanProps } = props as { 'data-testid'?: string } & Record<string, any>
  
  return {
    dataTestId,
    cleanProps
  }
} 