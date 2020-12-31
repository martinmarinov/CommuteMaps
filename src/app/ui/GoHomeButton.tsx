import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const GoHomeButton = ({ children }: Props) => {
  return (
    <Button
      variant="contained"
      color="primary"
      disableElevation
      component={Link}
      to="/"
    >
      {children}
    </Button>
  );
};
