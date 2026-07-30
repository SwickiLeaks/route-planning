import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  DialogActions,
} from "@mui/material";
import React, { useState } from "react";
import { getWaywpoint } from "@/utils/waypoint-utils";
import type { Waypoint } from "@/types/proto";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

export interface AddWaypointDialogProps {
  isOpen: boolean;
  title: string;
  onAdd: (newWaypoint: Waypoint) => void;
  onClose: () => void;
}

export function AddWaypointDialog(
  props: AddWaypointDialogProps,
): React.JSX.Element {
  const [inputText, setInputText] = useState<string>("");
  const [associatedWaypoint, setAssociatedWaypoint] = useState<Waypoint | null>(
    null,
  );

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement, Element>,
  ) => {
    const newValue: string = event.target.value;
    const foundWaypoint: Waypoint | null = getWaywpoint(newValue);
    if (foundWaypoint) {
      setAssociatedWaypoint(foundWaypoint);
    } else {
      setAssociatedWaypoint(null);
    }
    setInputText(newValue);
  };

  const handleOkClick = () => {
    if (associatedWaypoint) {
      props.onAdd(associatedWaypoint);
    }
    props.onClose();
  };

  const handleCancelClick = () => {
    props.onClose();
  };

  const getHelperText = (): string | undefined => {
    if (associatedWaypoint === null && inputText !== "") {
      return `${inputText} is not a valid ICAO/IATA`;
    }
    return undefined;
  };

  return (
    <Dialog
      open={props.isOpen}
      onClose={props.onClose}
      hideBackdrop
      disableRestoreFocus
    >
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent>
        <TextField
          placeholder="ICAO/IATA code..."
          value={inputText}
          onChange={handleChange}
          error={associatedWaypoint === null && inputText !== ""}
          helperText={getHelperText()}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter" && associatedWaypoint !== null) {
              handleOkClick();
            }
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleOkClick}
          disabled={associatedWaypoint === null}
          variant="contained"
        >
          OK
        </Button>
        <Button onClick={handleCancelClick} variant="outlined">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
