const table = document.querySelector('#table');

function printAllParkings(data) {
  table.innerHTML = '';

  const fields = [
    { key: 'entryTime', get: el => formatDateTime(el.entryTime) },
    { key: 'exitTime', get: el => formatDateTime(el.exitTime) },
    { key: 'duration', get: el => formatDuration(el.duration) },
    { key: 'totalPrice', get: el => formatTotalPrice(el.totalPrice) }
  ];

  data.forEach(el => {
    const row = document.createElement('tr');
    const plateCell = document.createElement('td');
    const plateButton = document.createElement('button');
    plateButton.id = 'plate-button';
    plateButton.classList.add('plate-button');
    plateButton.setAttribute('data-bs-toggle', 'modal');
    plateButton.setAttribute('data-bs-target', '#infoModal');
    plateButton.textContent = formatLicensePlate(el.vehicle.licensePlate);
    plateCell.appendChild(plateButton);
    row.appendChild(plateCell);

    fields.forEach(field => {
      const cell = document.createElement('td');
      cell.textContent = field.get(el);
      row.appendChild(cell);
    });

    row.appendChild(createActionsCell());
    table.appendChild(row);
  });
}

(async function init() {
  const parkings = await getAllData('parking');

  if (parkings)
    printAllParkings(parkings);
  else {
    const alert = document.querySelector('#alert');
    alert.classList.remove('invisible');
  }
})();

