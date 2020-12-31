import React, { useState } from "react";
import { Autocomplete } from "@material-ui/lab";
import CITY_DATA, { City } from "../../utils/CityData";
import { Icon, TextField, withStyles } from "@material-ui/core";

type Props = {
  label: string;
  onCityChosen: (city: City) => void;
};

const CssTextField = withStyles({
  root: {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderWidth: "0",
      },
      "&.Mui-focused fieldset": {
        borderWidth: "1px",
      },
    },
  },
})(TextField);

export const CityChooser = ({ label, onCityChosen }: Props) => {
  const [open, setOpen] = useState(false);
  return (
    <Autocomplete
      disableClearable
      options={CITY_DATA}
      getOptionLabel={(city) => city.cityname}
      style={{ width: 290 }}
      onChange={(_event: any, newCity: City | null) => {
        if (newCity !== null) {
          onCityChosen(newCity);
        }
      }}
      popupIcon={<Icon>search</Icon>}
      forcePopupIcon={!open}
      renderInput={(params) => (
        <CssTextField {...params} label={label} variant="outlined" />
      )}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
    />
  );
};
