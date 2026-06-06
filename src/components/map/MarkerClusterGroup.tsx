import { type PropsWithChildren } from 'react';
import { createLayerComponent } from '@react-leaflet/core';
import L from 'leaflet';
import 'leaflet.markercluster';

const MarkerClusterLayer = createLayerComponent<
  L.MarkerClusterGroup,
  L.MarkerClusterGroupOptions
>(
  function createMarkerClusterGroup(props, context) {
    const instance = L.markerClusterGroup(props);
    return {
      instance,
      context: { ...context, layerContainer: instance },
    };
  },
  function updateMarkerClusterGroup() {},
);

export function MarkerClusterGroup({
  children,
  ...options
}: PropsWithChildren<L.MarkerClusterGroupOptions>) {
  return <MarkerClusterLayer {...options}>{children}</MarkerClusterLayer>;
}
