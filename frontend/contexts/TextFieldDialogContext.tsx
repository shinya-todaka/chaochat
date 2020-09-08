import { createContext, useState, useContext, FC } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import useInput from 'hooks/ui/useInput';
import { DialogContent } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';

type Options = {
  title: string;
  validator: (text: string) => boolean;
  actionTitle: string;
  action: (text: string) => Promise<void>;
};

type TextFieldContextValue = {
  showDialog: (options: Options) => void;
};

const DEFAULT_OPTIONS: Options = {
  title: '',
  validator: (text) => !!text,
  actionTitle: '',
  action: () => Promise.resolve(),
};

const TextFieldDialogContext = createContext<TextFieldContextValue>({
  showDialog: () => undefined,
});

const TextFieldDialogProvider: FC<{ children: any }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<Options>(DEFAULT_OPTIONS);
  const { text, isValid, onChange } = useInput(options.validator);

  const showDialog = (theOptions: Options) => {
    setOptions(theOptions);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const action = () => {
    options
      .action(text)
      .then(() => {
        setOpen(false);
        onChange('');
      })
      .catch((error) => {
        console.log(error);
        setOpen(false);
        onChange('');
      });
  };

  return (
    <>
      <TextFieldDialogContext.Provider value={{ showDialog }}>
        {children}
      </TextFieldDialogContext.Provider>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{options.title}</DialogTitle>
        <DialogContent>
          <TextField
            onChange={({ target: { value } }) => onChange(value)}
            value={text}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>キャンセル</Button>
          <Button onClick={action} color="primary" disabled={!isValid}>
            {options.actionTitle}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TextFieldDialogProvider;

export const useTextFieldDialog = () => useContext(TextFieldDialogContext);
