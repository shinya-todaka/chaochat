import React, { FC } from 'react';
import Avatar from '@material-ui/core/Avatar';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import { IMember } from 'models/member';

const GroupAvatars: FC<{ members: IMember[] }> = ({ members }) => {
  return (
    <AvatarGroup max={5}>
      {members.map((member) =>
        member.photoUrl ? (
          <Avatar
            alt={member.displayName}
            src={member.photoUrl}
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
