import React, { FC, useState } from 'react';
import Box from '@material-ui/core/Box';
import GroupAvatars from 'components/common/GroupAvatars';
import { IMember } from 'models/member';
import { IRoom } from 'models/room';
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
import ToolTip from '@material-ui/core/Tooltip';

const RoomHeader: FC<{
  title: string | null;
  room: IRoom;
  members: IMember[];
  handleTweet: () => void;
  handleCopyUrl: () => Promise<void>;
  handleClickAvatars: () => void;
}> = ({
  title,
  room,
  members,
  handleTweet,
  handleCopyUrl,
  handleClickAvatars,
}) => {
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
          <Box display="flex" flexDirection="column" ml="6px">
            {title && (
              <Box fontSize="16px" fontWeight="fontWeightBold">
                {title}
              </Box>
            )}
            <Box fontSize="12px">
              <ExpireTime room={room} />
            </Box>
          </Box>

          <Box flexGrow={1} />
          <ToolTip title="メンバー">
            <Box style={{ cursor: 'pointer' }}>
              <GroupAvatars
                members={members}
                onClickAvatars={handleClickAvatars}
              />
            </Box>
          </ToolTip>
          <ToolTip title="メンバーを招待する" color="primary">
            <IconButton onClick={handleClick}>
              <PersonAdd />
            </IconButton>
          </ToolTip>

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
              <ListItemText primary="URLをコピー" />
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
              <ListItemText primary="URLをツイート" />
            </MenuItem>
          </Menu>
        </Box>
      </ToolBar>
    </AppBar>
  );
};

export default RoomHeader;
