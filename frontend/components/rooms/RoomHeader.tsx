import React, { FC } from 'react';
import Box from '@material-ui/core/Box';
import GroupAvatars from 'components/common/GroupAvatars';
import { IMember } from 'models/member';
import ToolBar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import { Typography } from '@material-ui/core';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import Avatar from '@material-ui/core/Avatar';

const RoomHeader: FC<{
  title: string;
  members: IMember[];
  onClickLeave: () => void;
}> = ({ title, members, onClickLeave }) => {
  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <ToolBar variant="dense">
        <Box display="flex" flexGrow={1} alignItems="center" borderBottom={1}>
          <Box ml="8px">
            <Typography>{title}</Typography>
          </Box>
          <Box flexGrow={1} />
          <AvatarGroup>
            <Avatar
              alt="profile image"
              src="https://pbs.twimg.com/profile_images/1135105195707211777/Z4YGhnSp_400x400.jpg"
            />
          </AvatarGroup>
          <Button onClick={onClickLeave}>退出</Button>
        </Box>
      </ToolBar>
    </AppBar>
  );
};

export default RoomHeader;
