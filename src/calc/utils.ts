export function formatDisplayTime(time_min: number): string {
  const hours = Math.floor(time_min / 60);
  const min = Math.floor(time_min % 60);

  const hoursString = hours < 10 ? `0${hours}` : `${hours}`;
  const minutesString = min < 10 ? `0${min}` : `${min}`;

  return `${hoursString}:${minutesString}`;
}

export function formatDisplayGal(gallons: number): string {
  const roundedDownToTenth: number = Math.floor(gallons * 10) / 10;
  return `${roundedDownToTenth} gal`;
}

export function formatDisplaySpeed(knots: number): string {
  const roundedDownToTenth: number = Math.floor(knots * 10) / 10;
  return `${roundedDownToTenth} KT`;
}

export function formatCourse(degrees: number): string {
  const roundedToWholeDegrees: number = Math.round(degrees);
  return `${roundedToWholeDegrees}\u00B0`;
}

export function convertFuelLbsToGal(fuelInLbs: number): number {
  return fuelInLbs / 6.65;
}

export function formatDisplayDistance(distanceNm: number): string {
  const roundedUpToTenth: number = Math.ceil(distanceNm * 10) / 10;
  return `${roundedUpToTenth} NM`;
}
