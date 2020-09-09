import React, { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { IMessage } from 'models/message';
import useMember from 'hooks/use-member';
import Box from '@material-ui/core/Box';
import ProfileImageAvatar from 'components/common/ProfileImageAvatar';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: '6px',
    marginLeft: '4px',
    paddingRight: '10px',
  },
  messageBubble: {
    backgroundColor: theme.palette.primary.main,
    minWidth: '30px',
    color: '#fff',
    width: 'auto',
    paddingTop: '6px',
    paddingBottom: '6px',
    paddingLeft: '12px',
    paddingRight: '12px',
    borderRadius: '20px',
    fontSize: '14px',
    overflowWrap: 'break-word',
  },
}));

const OthersMessageItem: FC<{ roomId: string; message: IMessage }> = ({
  roomId,
  message,
}) => {
  const classes = useStyles();
  const { member } = useMember(roomId, message.from);

  return member ? (
    <Box className={classes.root}>
      <Box mr="5px">
        <ProfileImageAvatar member={member} />
      </Box>
      <Box maxWidth="60%">
        <Box mb="2px" fontSize="10px" fontWeight="fontWeightBold">
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
