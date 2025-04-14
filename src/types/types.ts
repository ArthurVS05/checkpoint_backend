export const CountryCodes = {
  FR: "FR",
  BE: "BE",
  AN: "AN",
  US: "US",
  DE: "DE",
  // and others countries
} as const; // This object is "read-only"

export type CountryCodeType = (typeof CountryCodes)[keyof typeof CountryCodes];
