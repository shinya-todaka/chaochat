import React, { FC } from 'react';
import Avatar from '@material-ui/core/Avatar';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import { IMember } from 'models/member';

const GroupAvatars: FC<{ members: IMember[] }> = ({ members }) => {
  return (
    <AvatarGroup max={5}>
      {members.map((member) =>
        member.photoUrl ? (
          <Avatar alt="profile image" src={member.photoUrl} key={member.id} />
        ) : (
          <Avatar alt="profile image" key={member.id}>
            {member.displayName.charAt(0)}
          </Avatar>
        ),
      )}
    </AvatarGroup>
  );
};

export default GroupAvatars;
