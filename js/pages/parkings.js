async function getAllParkingsAsync() {
  try {
    const parkings = await getAllDataAsync('parking');
    const alert = document.querySelector('#alert');

    if (parkings &&
        parkings.length > 0) {
      alert.classList.add('invisible');

      return parkings;
    }
    else
      alert.classList.remove('invisible');
  }
  catch (er) {
    console.error('Error while retrieving parkings:', er.message);
  }
}

async function getAllParkingsByLicensePlateAsync(licensePlate) {
  try {
    const parkings = fetch(`${ENDPOINT}/parking/${licensePlate}`);
    const alert = document.querySelector('#alert');

    if (parkings) {
      alert.classList.add('invisible');

      return parkings;
    }
    else
      alert.classList.remove('invisible');
  }
  catch (er) {
    console.error('Error while retrieving parkings:', er.message);
  }
}

function printVehicle(vehicle) {
  const info = document.querySelector('#vehicle-info');
  const body = document.querySelector('#vehicle-body');

  body.innerHTML = '';

  const fields = [
    { key: 'licensePlate', get: el => formatLicensePlate(el.licensePlate) },
    { key: 'size', get: el => formatVehicleSize(el.size) },
    { key: 'brand', get: el => el.brand },
    { key: 'model', get: el => el.model },
    { key: 'color', get: el => el.color }
  ];

  const list = document.createElement('ul');

  list.classList.add('list-group', 'list-group-flush');

  fields.forEach(el => {
    if (el.key === 'licensePlate') {
      const header = document.createElement('div');

      header.classList.add('card-header');
      header.textContent = el.get(vehicle);
      body.appendChild(header);

      return;
    }

    const item = document.createElement('li');

    item.classList.add('list-group-item');
    item.textContent = el.get(vehicle);
    list.appendChild(item);
  });

  body.appendChild(list);
  info.appendChild(body);
}

async function printAllParkingsAsync(parkings) {
  try {
    const table = document.querySelector('#table');

    table.innerHTML = '';

    const fields = [
      { key: 'licensePlate', get: el => formatLicensePlate(el.vehicle.licensePlate) },
      { key: 'originalEntryTime', get: el => el.entryTime },
      { key: 'entryTime', get: el => formatDateTime(el.entryTime) },
      { key: 'exitTime', get: el => formatDateTime(el.exitTime) },
      { key: 'duration', get: el => formatDuration(el.duration) },
      { key: 'totalPrice', get: el => formatTotalPrice(el.totalPrice) }
    ];

    parkings.forEach(el => {
      const row = document.createElement('tr');

      fields.forEach(field => {
        const cell = document.createElement('td');

        if (field.key === 'licensePlate') {
          cell.classList.add('plate-button');
          cell.setAttribute('data-bs-toggle', 'modal');
          cell.setAttribute('data-bs-target', '#infoModal');
          cell.dataset.vehicleInfo = JSON.stringify(el.vehicle);
        }

        if (field.key === 'originalEntryTime') {
          cell.classList.add('entry-time', 'invisible');
        }

        cell.textContent = field.get(el);
        row.appendChild(cell);
      });

      row.appendChild(createParkingActionsCell());
      table.appendChild(row);
    });
  }
  catch (er) {
    console.error('Error while printing parking(s):', er.message);
  }
}

async function addParkingAsync(licensePlate) {
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

    printToast(await response.text());
  }
  catch (er) {
    console.error('Error while adding new parking:', er.message)
  }
}

async function updateParkingAsync(licensePlate) {
  try {
    const parking = {
      licensePlate: licensePlate
    };

    const response = await fetch(`${ENDPOINT}/parking`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(parking)
    });

    printToast(await response.text());
  }
  catch (er) {
    console.error('Error while updating parking:', er.message);
  }
}

async function removeParkingAsync(licensePlate, entryTime) {
  try {
    const parking = {
      licensePlate: licensePlate,
      entryTime: entryTime
    };

    const response = await fetch(`${ENDPOINT}/parking`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(parking)
    });

    printToast(await response.text());
  }
  catch (er) {
    console.error('Error while removing parking', er.message);
  }
}

document.querySelector('#search-button')
  .addEventListener('click', async () => {
    const licensePlate = document.querySelector('#search-input').value;

    printAllParkingsAsync(await getAllParkingsByLicensePlateAsync(licensePlate));
  });

document.querySelector('#refresh')
  .addEventListener('click', async () => {
    try {
      await printAllParkingsAsync(await getAllParkingsAsync());
    }
    catch (er) {
      console.error('Error while refreshing parkings:', er.message);
    }
  });

document.querySelector('#submit')
  .addEventListener('click', async () => {
    try {
      const plate = document.querySelector('#plate-input');

      await addParkingAsync(plate.value.trim());
      plate.value = '';
      await printAllParkingsAsync(await getAllParkingsAsync());
    }
    catch (er) {
      console.error('Error while submitting new parking:', er.message);
    }
  });

document.querySelector('#table')
  .addEventListener('click', async ev => {
    const parking = ev.target;
    const row = parking.closest('tr');

    if (!row)
      return

    if (parking.classList.contains('plate-button')) {
      printVehicle(JSON.parse(parking.dataset.vehicleInfo));

      return;
    }

    if (parking.classList.contains('action-button')) {
      const licensePlate = row.querySelector('.plate-button').textContent;

      if (parking.classList.contains('exit'))
        try {
          await updateParkingAsync(licensePlate);
        }
        catch (er) {
          console.error('Error while updating parking:', er.message);
        }

      if (parking.classList.contains('delete'))
        try {
          const entryTime = row.querySelector('.entry-time').textContent;

          await removeParkingAsync(licensePlate, entryTime);
        }
        catch (er) {
          console.error('Error while removing parking:', er.message);
        }

      await printAllParkingsAsync(await getAllParkingsAsync());
    }
  });

(async function init() {
  try {
    const parkings = await getAllParkingsAsync();

    if (parkings)
      await printAllParkingsAsync(parkings);
  }
  catch (er) {
    console.log('Error while loading parkings data:', er.message);
  }
})();
