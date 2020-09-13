import React, { FC } from 'react';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Link from 'next/link';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.secondary.main,
  },
  link: {
    textDecoration: 'none',
    fontSize: 18,
  },
}));

const RoomClosedFooter: FC = () => {
  const classes = useStyles();

  return (
    <Paper elevation={2} className={classes.root}>
      <Box
        display="flex"
        justifyContent="justifyContent"
        alignItems="center"
        flexDirection="column"
        p={2}
      >
        <Box>
          <Typography variant="h6">このルームは終了しました</Typography>
          <Box height={8} />
          <Link href="/">
            <Button variant="contained" fullWidth>
              <a className={classes.link}>ホームに戻る</a>
            </Button>
          </Link>
        </Box>
      </Box>
    </Paper>
  );
};

export default RoomClosedFooter;