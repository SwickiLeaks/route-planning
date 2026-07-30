import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React from "react";

export interface VehicleSelectProps {}

export function PlatormSelect(): React.JSX.Element {
  //Hard coded for now
  const MH47G: string = "MH-47G";
  const AH6: string = "AH-6";
  const MH6: string = "MH-6";
  const UH60: string = "UH-60";
  const MH60L: string = "MH-60L";
  const MH60LDAP: string = "MH-60L DAP";
  const MH60M: string = "MH-60M";
  const MQ1C: string = "MQ-1C";

  const selectedVehicle: string = UH60;

  const allVehicles: string[] = [
    MH47G,
    AH6,
    MH6,
    UH60,
    MH60L,
    MH60LDAP,
    MH60M,
    MQ1C,
  ];
  return (
    <FormControl fullWidth size="small">
      <InputLabel id="platform-select-label">Platform</InputLabel>
      <Select
        size="small"
        labelId="platform-select-label"
        id="demo-simple-select"
        value={selectedVehicle}
        label="Platform"
      >
        {allVehicles.map((vehicle) => (
          <MenuItem value={vehicle}>{vehicle}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
