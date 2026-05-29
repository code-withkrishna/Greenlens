export const GRADE_CONFIG = {
  A: {
    color: '#27500A',
    bg: '#EAF3DE',
    barColor: '#3B6D11',
    label: 'Excellent',
    description: 'Outstanding environmental performance',
    range: [85, 100],
  },
  B: {
    color: '#27500A',
    bg: '#C0DD97',
    barColor: '#639922',
    label: 'Good',
    description: 'Above average sustainability',
    range: [70, 84],
  },
  C: {
    color: '#633806',
    bg: '#FAEEDA',
    barColor: '#BA7517',
    label: 'Average',
    description: 'Some environmental concerns',
    range: [50, 69],
  },
  D: {
    color: '#633806',
    bg: '#FAC775',
    barColor: '#EF9F27',
    label: 'Poor',
    description: 'Notable environmental impact',
    range: [30, 49],
  },
  E: {
    color: '#A32D2D',
    bg: '#FCEBEB',
    barColor: '#E24B4A',
    label: 'Very Poor',
    description: 'High environmental harm',
    range: [15, 29],
  },
  F: {
    color: '#791F1F',
    bg: '#F7C1C1',
    barColor: '#A32D2D',
    label: 'Harmful',
    description: 'Severe environmental damage',
    range: [0, 14],
  },
};

export function getGradeConfig(grade) {
  return GRADE_CONFIG[grade] ?? GRADE_CONFIG['F'];
}

export function getBarColor(score) {
  if (score >= 70) return '#3B6D11';
  if (score >= 40) return '#EF9F27';
  return '#E24B4A';
}

export function scoreToGrade(score) {
  for (const [grade, config] of Object.entries(GRADE_CONFIG)) {
    const [min, max] = config.range;
    if (score >= min && score <= max) return grade;
  }
  return 'F';
}
