import { LinearProgress, Box, Typography } from "@material-ui/core";

type Props = {
  progress?: number;
};

export const ProgressBar = ({ progress }: Props) => {
  if (progress === undefined) {
    return <LinearProgress />;
  } else {
    return (
      <Box display="flex" alignItems="center">
        <Box width="100%" mr={1}>
          <LinearProgress variant="determinate" value={progress} />
        </Box>
        <Box minWidth={35}>
          <Typography variant="body2" color="textSecondary">{`${Math.round(
            progress
          )}%`}</Typography>
        </Box>
      </Box>
    );
  }
};
