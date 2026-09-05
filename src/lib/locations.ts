import {
  LOCATIONS as RAW_LOCATIONS,
  STATES as RAW_STATES,
  DISTRICT_COORDINATES as RAW_DISTRICT_COORDINATES,
  getDistricts as rawGetDistricts,
  getBlocks as rawGetBlocks,
  getBlockMeta as rawGetBlockMeta,
  getVillages as rawGetVillages,
  getVillageMeta as rawGetVillageMeta,
  getDistrictCoordinates as rawGetDistrictCoordinates,
} from "@/data/locations";

export const BUSINESS_CATEGORIES = [
  "Flour Mill",
  "Dairy Farm",
  "Poultry Farm",
  "Mobile Repair Shop",
  "Grocery Store",
  "Tailoring Unit",
  "Oil Mill",
  "Agarbatti Making",
  "Papad Making",
  "Brick Kiln",
] as const;

// Create Record<string, Record<string, string[]>> mapping for fast cascading lookups
export const LOCATIONS: Record<string, Record<string, string[]>> = Object.fromEntries(
  Object.entries(RAW_LOCATIONS).map(([state, districts]) => [
    state,
    Object.fromEntries(
      Object.entries(districts as Record<string, Record<string, unknown>>).map(
        ([district, blocks]) => [
          district,
          Object.keys(blocks).filter((k) => k !== "lat" && k !== "lng"),
        ]
      )
    ),
  ])
);

export const STATES = RAW_STATES;
export const DISTRICT_COORDINATES = RAW_DISTRICT_COORDINATES;

export const getDistricts = rawGetDistricts;
export const getBlocks = rawGetBlocks;
export const getBlockMeta = rawGetBlockMeta;
export const getVillages = rawGetVillages;
export const getVillageMeta = rawGetVillageMeta;
export const getDistrictCoordinates = rawGetDistrictCoordinates;

