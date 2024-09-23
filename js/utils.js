function formatLicensePlate(licensePlate) {
  return licensePlate.slice(0, 3) + '-' + licensePlate.slice(3);
}

function formatDateTime(dateTime) {
  const date = new Date(dateTime);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const time = date.toTimeString().split(' ')[0];

  return dateTime === null
    ? '--'
    : `${month}/${day}/${year} ${time}`;
}

function formatDuration(duration) {
  return duration === null
    ? '--'
    : duration.split('.')[0];
}

function formatTotalPrice(price) {
  return price === null
    ? '--'
    : `$ ${parseFloat(price).toFixed(2)}`;
}