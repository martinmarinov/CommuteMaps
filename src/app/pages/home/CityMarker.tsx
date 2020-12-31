import { Button } from "@material-ui/core";
import React from "react";
import { MIN_WIDTH_OF_POPUP } from "../../Constants";
import { PaperMapMarker } from "../../ui/PaperMapMarker";
import { City } from "../../utils/CityData";

type Props = {
  city: City;
  onSelected: () => void;
};

export const CityMarker = ({ city, onSelected }: Props) => {
  return (
    <PaperMapMarker
      position={city.position}
      closeButton={false}
      minWidth={MIN_WIDTH_OF_POPUP}
    >
      <Button fullWidth onClick={onSelected}>
        Select {city.cityname}
      </Button>
    </PaperMapMarker>
  );
};
