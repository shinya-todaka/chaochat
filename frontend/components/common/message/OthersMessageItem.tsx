import React, { FC, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { IMessage } from 'models/message';
import { IMember } from 'models/member';
import Box from '@material-ui/core/Box';
import ProfileImageAvatar from 'components/common/ProfileImageAvatar';
import { useMembersContext } from 'contexts/MembersContext';

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
  const { members } = useMembersContext();

  const findMember = useCallback(
    (_members: IMember[]) => {
      return (
        _members.filter((_member) => _member.id === message.from)[0] ?? null
      );
    },
    [message.from],
  );

  return findMember(members) ? (
    <Box className={classes.root}>
      <Box mr="5px">
        <ProfileImageAvatar member={findMember(members)} />
      </Box>
      <Box maxWidth="60%">
        <Box mb="2px" fontSize="10px" fontWeight="fontWeightBold">
          {findMember(members).displayName}
        </Box>
        <Box className={classes.messageBubble}>{message.text} </Box>
      </Box>
    </Box>
  ) : (
    <></>
  );
};

export default OthersMessageItem;
