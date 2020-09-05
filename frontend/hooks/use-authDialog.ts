import { useState, useEffect } from 'react';

const useAuthDialog = (
  isSignined: boolean,
): {
  authDialogOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  authDialogOnClose: () => void;
} => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isSignined) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [isSignined]);

  const authDialogOnClose = () => {
    setOpen(false);
  };

  return { authDialogOpen: open, setOpen, authDialogOnClose };
};

export default useAuthDialog;
