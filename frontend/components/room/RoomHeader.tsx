import React, { FC, useState } from 'react';
import Box from '@material-ui/core/Box';
import GroupAvatars from 'components/common/GroupAvatars';
import { IMember } from 'models/member';
import ToolBar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import { Menu, MenuItem } from '@material-ui/core';
import PersonAdd from '@material-ui/icons/PersonAdd';
import IconButton from '@material-ui/core/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import FileCopy from '@material-ui/icons/FileCopy';
import { TwitterIcon } from 'components/common/icons';
import ExpireTime from 'components/room/ExpireTime';
import { IRoom } from 'models/room';

const RoomHeader: FC<{
  title: string;
  room: IRoom;
  members: IMember[];
  onClickLeave: () => void;
  handleTweet: () => void;
  handleCopyUrl: () => Promise<void>;
}> = ({ title, room, members, onClickLeave, handleTweet, handleCopyUrl }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <ToolBar variant="dense">
        <Box display="flex" flexGrow={1} alignItems="center" borderBottom={1}>
          <Box ml="18px" fontSize={18} fontWeight="fontWeightBold">
            {title}
          </Box>
          <Box ml={2}>
            <ExpireTime room={room} />
          </Box>
          <Box flexGrow={1} />
          <Box mr={2}>
            <GroupAvatars members={members} />
          </Box>
          <IconButton onClick={handleClick}>
            <PersonAdd />
          </IconButton>
          <Menu
            keepMounted
            getContentAnchorEl={null}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={() => handleCopyUrl().then(() => handleClose())}>
              <ListItemIcon>
                <FileCopy fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="urlをコピー" />
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleClose();
                handleTweet();
              }}
            >
              <ListItemIcon>
                <TwitterIcon />
              </ListItemIcon>
              <ListItemText primary="urlをツイート" />
            </MenuItem>
          </Menu>
        </Box>
      </ToolBar>
    </AppBar>
  );
};

export default RoomHeader;
