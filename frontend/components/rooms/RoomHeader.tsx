import React, { FC } from 'react';
import Box from '@material-ui/core/Box';
import GroupAvatars from 'components/common/GroupAvatars';
import { IMember } from 'models/member';
import ToolBar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import { Typography } from '@material-ui/core';

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
          <GroupAvatars members={members} />
          <Button onClick={onClickLeave}>退出</Button>
        </Box>
      </ToolBar>
    </AppBar>
  );
};

export default RoomHeader;
