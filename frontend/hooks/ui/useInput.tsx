import { useState, useCallback } from 'react';

const useInput = (
  validator: (text: string) => boolean,
): { text: string; isValid: boolean; onChange: (text: string) => void } => {
  const [text, setText] = useState('');
  const [isValid, setIsValid] = useState(false);

  const onChange = useCallback(
    (theText: string) => {
      setText(theText);
      setIsValid(validator(theText));
    },
    [validator],
  );

  return { text, isValid, onChange };
};

export default useInput;
