import React, { FC } from 'react';
import Box from '@material-ui/core/Box';
import GroupAvatars from 'components/common/GroupAvatars';
import { IMember } from 'models/member';
import ToolBar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import { Typography, Tooltip } from '@material-ui/core';
import PersonAdd from '@material-ui/icons/PersonAdd';
import IconButton from '@material-ui/core/IconButton';
import ToolTip from '@material-ui/core/Tooltip';

const RoomHeader: FC<{
  title: string;
  members: IMember[];
  onClickLeave: () => void;
  handleTweet: () => void;
}> = ({ title, members, onClickLeave, handleTweet }) => {
  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <ToolBar variant="dense">
        <Box display="flex" flexGrow={1} alignItems="center" borderBottom={1}>
          <Box ml="8px">
            <Typography>{title}</Typography>
          </Box>
          <Box flexGrow={1} />
          <GroupAvatars members={members} />
          <Tooltip title="urlをツイートする">
            <IconButton onClick={handleTweet}>
              <PersonAdd />
            </IconButton>
          </Tooltip>
        </Box>
      </ToolBar>
    </AppBar>
  );
};

export default RoomHeader;
