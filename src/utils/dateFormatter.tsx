export const formatDate = (timestamp: string | number | Date): string => {
  // Convert String object to primitive string if needed
  const normalizedTimestamp =
    timestamp instanceof String ? timestamp.toString() : timestamp;

  const date = new Date(normalizedTimestamp);

  // Check if date is valid
  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};
