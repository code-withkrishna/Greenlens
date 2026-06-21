export const SCORE_REQUIRED_FIELDS = [
  'grade',
  'overall_score',
  'co2_score',
  'water_score',
  'packaging_score',
  'reasons',
  'greener_swaps',
];

const VALID_GRADES = ['A', 'B', 'C', 'D', 'E', 'F'];

/** Returns validation error messages (empty array = valid). */
export function getScoreSchemaErrors(data) {
  const errors = [];

  for (const field of SCORE_REQUIRED_FIELDS) {
    if (!(field in data)) errors.push(`missing field "${field}"`);
  }

  if (data.grade && !VALID_GRADES.includes(data.grade)) {
    errors.push(`invalid grade "${data.grade}"`);
  }

  if (
    typeof data.overall_score !== 'number' ||
    data.overall_score < 0 ||
    data.overall_score > 100
  ) {
    errors.push('overall_score must be 0-100');
  }

  return errors;
}

/** Client-side guard — throws if the API response is incomplete. */
export function assertValidScoreResponse(data) {
  for (const field of SCORE_REQUIRED_FIELDS) {
    if (!(field in data)) {
      throw new Error(`Invalid response: missing field "${field}"`);
    }
  }
  return data;
}
