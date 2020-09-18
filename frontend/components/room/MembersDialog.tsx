import React, { FC } from 'react';
import { IMember } from 'models/member';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import Box from '@material-ui/core/Box';
import DialogContent from '@material-ui/core/DialogContent';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  paper: {
    maxHeight: '50%',
    maxWidth: '315px',
    width: '80%',
  },
});

const MembersDialog: FC<{
  members: IMember[];
  open: boolean;
  setIsOpen: (open: boolean) => void;
}> = ({ members, open, setIsOpen }) => {
  const classes = useStyles();

  return (
    <Dialog
      open={open}
      onClose={() => setIsOpen(false)}
      classes={{ paper: classes.paper }}
    >
      <DialogTitle>
        <Box fontWeight="fontWeightBold">メンバー</Box>
      </DialogTitle>
      <DialogContent dividers>
        <List dense disablePadding>
          {members.map((member) => (
            <ListItem key={member.id} disableGutters>
              <ListItemAvatar>
                {member.photoURL ? (
                  <Avatar alt={member.displayName} src={member.photoURL} />
                ) : (
                  <Avatar alt={member.displayName}>
                    {member.displayName.charAt(0) || ''}
                  </Avatar>
                )}
              </ListItemAvatar>
              <ListItemText primary={member.displayName} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default MembersDialog;
