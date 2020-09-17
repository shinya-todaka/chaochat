import React, { FC } from 'react';
import Avatar from '@material-ui/core/Avatar';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import { IMember } from 'models/member';

const GroupAvatars: FC<{ members: IMember[]; onClickAvatars: () => void }> = ({
  members,
  onClickAvatars,
}) => {
  return (
    <AvatarGroup max={5} onClick={onClickAvatars}>
      {members.map((member) =>
        member.photoURL ? (
          <Avatar
            alt={member.displayName}
            src={member.photoURL}
            key={member.id}
          />
        ) : (
          <Avatar alt={member.displayName} key={member.id}>
            {member.displayName.charAt(0)}
          </Avatar>
        ),
      )}
    </AvatarGroup>
  );
};

export default GroupAvatars;
