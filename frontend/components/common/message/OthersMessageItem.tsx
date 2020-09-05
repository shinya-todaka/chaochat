import React, { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Message } from 'models/message';
import useMember from 'hooks/use-member';
import Box from '@material-ui/core/Box';
import ProfileImageAvatar from 'components/common/ProfileImageAvatar';

const useStyles = makeStyles({
  messageBubble: {
    border: 'solid',
    borderWidth: '1px',
    width: 'auto',
    padding: '8px',
    borderRadius: '4px',
    fontSize: '14px',
    overflowWrap: 'break-word',
  },
});

const OthersMessageItem: FC<{ roomId: string; message: Message }> = ({
  roomId,
  message,
}) => {
  const classes = useStyles();
  const { member } = useMember(roomId, message.from);

  return member ? (
    <Box display="flex" flexDirection="row" mt="6px" ml="4px" pr="10px">
      <Box mr="5px">
        <ProfileImageAvatar member={member} />
      </Box>
      <Box maxWidth="60%">
        <Box mb="2px" fontSize="14px">
          {member.displayName}
        </Box>
        <Box className={classes.messageBubble}>{message.text} </Box>
      </Box>
    </Box>
  ) : (
    <></>
  );
};

export default OthersMessageItem;
