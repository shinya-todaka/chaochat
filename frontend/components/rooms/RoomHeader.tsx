import React, { FC } from 'react';
import Box from '@material-ui/core/Box';
import GroupAvatars from 'components/common/GroupAvatars';
import { IMember } from 'models/member';
import ToolBar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import { Typography, Tooltip } from '@material-ui/core';
import PersonAdd from '@material-ui/icons/PersonAdd';
import IconButton from '@material-ui/core/IconButton';

const RoomHeader: FC<{
  title: string;
  members: IMember[];
  onClickLeave: () => void;
  handleTweet: () => void;
  handleCopyUrl: () => void;
}> = ({ title, members, onClickLeave, handleTweet, handleCopyUrl }) => {
  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <ToolBar variant="dense">
        <Box display="flex" flexGrow={1} alignItems="center" borderBottom={1}>
          <Box ml="18px" fontSize={18} fontWeight="fontWeightBold">
            {title}
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
