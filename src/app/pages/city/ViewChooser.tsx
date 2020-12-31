import {
  Button,
  Icon,
  IconButton,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";
import React, { useState } from "react";
import { ModalAlert } from "../../ui/ModalAlert";
import { ALL_VIEWS, View } from "../../views/ViewsRegistry";

type Props = {
  view: View;
  onViewKeyChosen: (viewKey: string) => void;
};

export const ViewChooser = ({ view, onViewKeyChosen }: Props) => {
  const [infoOpen, setInfoOpen] = useState<boolean>(false);
  return (
    <>
      <Select
        value={view.key}
        style={{ width: 260 }}
        onChange={(event) => onViewKeyChosen(event.target.value as string)}
        variant="outlined"
      >
        {ALL_VIEWS.map((v) => (
          <MenuItem key={`view_${v.key}`} value={v.key}>
            {v.short_name}
          </MenuItem>
        ))}
      </Select>
      <IconButton edge="end" color="inherit" onClick={() => setInfoOpen(true)}>
        <Icon>info</Icon>
      </IconButton>
      <ModalAlert title={view.short_name} severity="info" open={infoOpen}>
        {view.description.map((p, id) => (
          <Typography key={`view_info_p_${id}`}>
            <p>{p}</p>
          </Typography>
        ))}
        <Button
          variant="contained"
          color="primary"
          disableElevation
          onClick={() => setInfoOpen(false)}
        >
          OK
        </Button>
      </ModalAlert>
    </>
  );
};
