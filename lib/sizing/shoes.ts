import type { DirectSizeMap } from "./types";

export const shoesSizing: DirectSizeMap = {
  type: "direct",
  label: "Men's US Size",
  targetLabel: "Women's US Size",
  mappings: [
    { source: "5", target: "6.5 - 7", eu: "37.5 - 38" },
    { source: "5.5", target: "7 - 7.5", eu: "38 - 38.5" },
    { source: "6", target: "7.5 - 8", eu: "38.5 - 39" },
    { source: "6.5", target: "8 - 8.5", eu: "39 - 40" },
    { source: "7", target: "8.5 - 9", eu: "40 - 40.5" },
    { source: "7.5", target: "9 - 9.5", eu: "40.5 - 41" },
    { source: "8", target: "9.5 - 10", eu: "41 - 42" },
    { source: "8.5", target: "10 - 10.5", eu: "42 - 42.5" },
    { source: "9", target: "10.5 - 11", eu: "42.5 - 43" },
    { source: "9.5", target: "11 - 11.5", eu: "43 - 44" },
    { source: "10", target: "11.5 - 12", eu: "44 - 44.5" },
    { source: "10.5", target: "12 - 12.5", eu: "44.5 - 45" },
    { source: "11", target: "12.5 - 13", eu: "45 - 46" },
    { source: "11.5", target: "13 - 13.5", eu: "46 - 46.5" },
    { source: "12", target: "13.5 - 14", eu: "46.5 - 47" },
    { source: "13", target: "14.5 - 15", eu: "48 - 49" },
    { source: "14", target: "15.5 - 16.5", eu: "50 - 51" },
    { source: "15", target: "16.5 - 17.5", eu: "52 - 53" },
  ],
};
