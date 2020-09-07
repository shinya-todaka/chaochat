import React, { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import useInput from 'hooks/ui/useInput';

const useStyles = makeStyles({
  inputBase: {
    marginLeft: 4,
    flex: 1,
  },
});

const Input: FC<{
  sendMessage: (text: string) => void;
}> = ({ sendMessage }) => {
  const classes = useStyles();
  const validator = (text: string) => text.length > 0 && text.length < 100;
  const { text, isValid, onChange } = useInput(validator);

  const onSendAction = (event: React.SyntheticEvent<HTMLElement>) => {
    if (isValid) {
      event.preventDefault();
      sendMessage(text);
      onChange('');
    }
  };

  return (
    <Box display="flex" pb="16px" pl="6px" pr="6px" bgcolor="white">
      <TextField
        variant="outlined"
        placeholder="text"
        className={classes.inputBase}
        value={text}
        onChange={({ target: { value } }) => onChange(value)}
        onKeyPress={(event) =>
          event.key === 'Enter' ? onSendAction(event) : null
        }
      />
      <IconButton onClick={onSendAction} disabled={!isValid} color="secondary">
        <SendIcon />
      </IconButton>
    </Box>
  );
};

export default Input;
