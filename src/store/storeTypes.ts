export type coordsContainer = {
  place: {
    geometry: {
      coordinates: Array<number>;
    };
  };
  name?: string;
  collection?: Array<string>;
  displayString?: string;
  id?: string;
  language?: string;
  recordType?: string;
  slug?: string;
};
