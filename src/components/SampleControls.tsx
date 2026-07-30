import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import MenuItem from "@mui/material/MenuItem";
import Slider from "@mui/material/Slider";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import { useState } from "react";

const AIRCRAFT = ["UH-60", "MH-60", "HH-60"];

const SampleControls = () => {
  const [layer, setLayer] = useState("T1");
  const [aircraft, setAircraft] = useState("UH-60");
  const [altitude, setAltitude] = useState(1500);

  return (
    <Stack spacing={1.5} sx={{ p: 0.5 }}>
      <Stack
        direction="row"
        spacing={1}
        useFlexGap
        sx={{ alignItems: "center", flexWrap: "wrap" }}
      >
        <Button variant="contained" color="primary">
          Primary
        </Button>
        <Button variant="outlined" color="secondary">
          Secondary
        </Button>
        <Button variant="contained" color="maroon">
          Contained
        </Button>
        <Button variant="outlined" color="error">
          Outlined
        </Button>
        <Button variant="text">Text</Button>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        <Chip label="WARNING" color="warning" variant="outlined" />
        <Chip label="SUCCESS" color="success" />
        <Chip label="GO" color="maroon" />
      </Stack>

      <Divider />

      {/* Inputs Section  */}
      <Stack
        direction="row"
        spacing={2}
        useFlexGap
        sx={{ alignItems: "center", flexWrap: "wrap" }}
      >
        <ToggleButtonGroup
          exclusive
          value={layer}
          onChange={(_event, value: string | null) =>
            value != null && setLayer(value)
          }
          aria-label="Base layer"
        >
          <ToggleButton value="T1">Tog 1</ToggleButton>
          <ToggleButton value="T2">Tog 2</ToggleButton>
          <ToggleButton value="T3">Tog 3</ToggleButton>
        </ToggleButtonGroup>

        <TextField
          label="Sample Textfield"
          defaultValue="Sample Value"
          sx={{ width: "10rem" }}
        />

        <TextField
          select
          label="Aircraft"
          value={aircraft}
          onChange={(event) => setAircraft(event.target.value)}
          sx={{ width: "8rem" }}
        >
          {AIRCRAFT.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </TextField>

        <FormControlLabel
          control={<Switch defaultChecked />}
          label={<Typography variant="body2">Switch</Typography>}
        />

        <Box sx={{ width: "14rem", px: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Altitude — {altitude.toLocaleString()} ft
          </Typography>
          <Slider
            size="small"
            min={500}
            max={10000}
            step={100}
            value={altitude}
            onChange={(_event, value) => setAltitude(value as number)}
            aria-label="Altitude"
          />
        </Box>
      </Stack>
    </Stack>
  );
};

export default SampleControls;
