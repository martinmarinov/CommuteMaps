import { DragEndEvent, Icon, LatLng } from "leaflet";
import { Marker } from "react-leaflet";
import React, { ReactNode, useMemo } from "react";

type Props = {
  children?: ReactNode;
  position: LatLng;
  onPositionChange?: (newPosition: LatLng) => void;
  icon?: Icon;
};

export const MapMarker = ({
  children,
  position,
  onPositionChange,
  icon,
}: Props) => {
  const eventHandler = useMemo(
    () => ({
      dragend: (event: DragEndEvent) =>
        onPositionChange && onPositionChange(event.target.getLatLng()),
    }),
    [onPositionChange]
  );

  return (
    <Marker
      position={position}
      icon={icon}
      draggable={onPositionChange !== undefined}
      eventHandlers={eventHandler}
    >
      {children}
    </Marker>
  );
};
