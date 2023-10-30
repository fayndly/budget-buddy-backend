export default function sortByDateInRange(array, startDate, endDate) {
  const filteredArray = array.filter(function (item) {
    const date = new Date(item.time);
    return date >= startDate && date <= endDate;
  });
  filteredArray.sort(function (a, b) {
    const dateA = new Date(a.time);
    const dateB = new Date(b.time);
    return dateB - dateA;
  });
  return filteredArray;
}
