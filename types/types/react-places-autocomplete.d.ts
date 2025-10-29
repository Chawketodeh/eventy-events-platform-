declare module "react-places-autocomplete" {
  import * as React from "react";

  export interface Suggestion {
    active: boolean;
    description: string;
    placeId: string;
  }

  export interface PlacesAutocompleteProps {
    value: string;
    onChange: (value: string) => void;
    onSelect: (address: string) => void;
    searchOptions?: object;
    debounce?: number;
    children: (args: {
      getInputProps: (options?: object) => any;
      suggestions: Suggestion[];
      getSuggestionItemProps: (suggestion: Suggestion, options?: object) => any;
      loading: boolean;
    }) => React.ReactNode;
  }

  export default class PlacesAutocomplete extends React.Component<PlacesAutocompleteProps> {}

  export function geocodeByAddress(address: string): Promise<any[]>;
  export function getLatLng(result: any): Promise<{ lat: number; lng: number }>;
}
