import React, { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import { IMember } from 'models/member';

const useStyles = makeStyles({
  avatar: {
    borderRadius: '14px',
    width: '28px',
    height: '28px',
  },
});

const ProfileImageAvatar: FC<{ member: IMember }> = ({ member }) => {
  const classes = useStyles();

  return member.photoUrl ? (
    <Avatar
      alt="profile image"
      src={member.photoUrl}
      className={classes.avatar}
    />
  ) : (
    <Avatar alt="profile image" className={classes.avatar}>
      {member.displayName.charAt(0)}
    </Avatar>
  );
};

export default ProfileImageAvatar;
