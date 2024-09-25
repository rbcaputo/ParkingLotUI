function printAllParkings(data) {
  const table = document.querySelector('#table');
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

async function getVehicleByLicensePlateAsync(licensePlate) {
  try {
    const response = await fetch(`${ENDPOINT}/vehicle/licensePlate/${licensePlate}`);

    if (!response.ok) {
      throw new Error(`Http error: status ${response.status}.`);
    }

    return await response.json();
  }
  catch (er) {
    console.error('Error while retrieving vehicle', er.message);
  }
}

function printVehicle(data) {
  const info = document.querySelector('#vehicle-info');
  const body = document.querySelector('#vehicle-body');
  body.innerHTML = '';

  const fields = [
    { key: 'size', get: el => formatVehicleSize(el.size) },
    { key: 'brand', get: el => el.brand },
    { key: 'model', get: el => el.model },
    { key: 'color', get: el => el.color }
  ];

  const header = document.createElement('div');
  header.classList.add('card-header');
  header.textContent = formatLicensePlate(data.licensePlate);

  const list = document.createElement('ul');
  list.classList.add('list-group', 'list-group-flush');

  fields.forEach(el => {
    const item = document.createElement('li');
    item.classList.add('list-group-item');
    item.textContent = el.get(data);

    list.appendChild(item);
  });


  body.appendChild(header);
  body.appendChild(list);
  info.appendChild(body);
}

async function addNewParkingAsync(licensePlate) {
  try {
    const parking = {
      licensePlate: licensePlate
    }

    const response = await fetch(`${ENDPOINT}/parking`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(parking)
    });

    const message = await response.text();
    printToast(message);
  }
  catch (er) {
    console.error('Error while adding new parking:', er.message)
  }
}

document.querySelector('#submit')
  .addEventListener('click', async () => {
    const input = document.querySelector('#plate-input');
    await addNewParkingAsync(input.value.trim());

    input.value = '';
    // refresh data
  });

(async function init() {
  const parkings = await getAllDataAsync('parking');

  if (parkings)
    printAllParkings(parkings);
  else {
    const alert = document.querySelector('#alert');
    alert.classList.remove('invisible');
  }

  const vehicleInfo = document.querySelector('#plate-button');
  vehicleInfo.addEventListener('click', async ev => {
    const vehicle = await getVehicleByLicensePlateAsync(ev.target.textContent);
    printVehicle(vehicle);
  });
})();
