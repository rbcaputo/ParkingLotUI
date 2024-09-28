async function getAllVehiclesAsync() {
  try {
    const vehicles = await getAllDataAsync('vehicle');
    const alert = document.querySelector('#alert');

    if (vehicles &&
      vehicles.length > 0) {
      alert.classList.add('invisible');

      return vehicles;
    }

    alert.classList.remove('invisible');
  } catch (er) {
    console.error('Error while retrieving vehicles:', er.message);
  }
}

function printAllVehicles(vehicles) {
  try {
    const table = document.querySelector('#table');

    table.innerHTML = '';

    const fields = [
      { key: 'licensePlate', get: el => formatLicensePlate(el.licensePlate) },
      { key: 'size', get: el => formatVehicleSize(el.size) },
      { key: 'brand', get: el => el.brand },
      { key: 'model', get: el => el.model },
      { key: 'color', get: el => el.color },
      { key: 'isParked', get: el => formatIsParked(el.isParked) }
    ];

    vehicles.forEach(el => {
      const row = document.createElement('tr');

      fields.forEach(field => {
        const cell = document.createElement('td');

        if (field.key === 'licensePlate') {
          cell.classList.add('plate');
          cell.dataset.vehicleInfo = JSON.stringify(el);
        }

        cell.textContent = field.get(el);
        row.appendChild(cell);
      });

      row.appendChild(createActionsCell());
      table.appendChild(row);
    });
  } catch (er) {
    console.error('Error while printing vehicle(s):', er.message);
  }
}

async function getVehicleByLicensePlateAsync(licensePlate) {
  try {
    const response = await fetch(`${ENDPOINT}/vehicle/${licensePlate}`);
    const alert = document.querySelector('#alert');

    if (response.ok) {
      alert.classList.add('invisible');
      printAllVehicles(await response.json());
    }
    else {
      alert.classList.remove('invisible');
      printToast(await response.text());
    }
  } catch (er) {
    console.error('Error while retrieving vehicle:', er.message);
  }
}

async function addVehicleAsync(vehicle) {
  try {
    const vehicleDto = {
      licensePlate: vehicle.licensePlate,
      size: parseInt(vehicle.size),
      brand: vehicle.brand,
      model: vehicle.model,
      color: vehicle.color
    };

    const response = await fetch(`${ENDPOINT}/vehicle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(vehicleDto)
    });

    printToast(await response.text());
  } catch (er) {
    console.error('Error while adding new vehicle:', er.message);
  }
}

async function updateVehicleAsync(vehicle) {
  try {
    const vehicleDto = {
      licensePlate: vehicle.licensePlate,
      size: parseInt(vehicle.size),
      brand: vehicle.brand,
      model: vehicle.model,
      color: vehicle.color
    };

    const response = await fetch(`${ENDPOINT}/vehicle`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(vehicleDto)
    });

    printToast(await response.text());
  } catch (er) {
    console.error('Error while updating vehicle:', er.message);
  }
}

async function removeVehicleAsync(licensePlate) {
  try {
    const response = await fetch(`${ENDPOINT}/vehicle`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(licensePlate)
    });

    printToast(await response.text());
  } catch (er) {
    console.error('Error while removing vehicle', er.message);
  }
}

const submit = document.querySelector('#submit');
let isEdit;

async function handleSubmit(ev) {
  ev.preventDefault();

  try {
    const fields = selectVehicleFormFields();
    const vehicle = {};

    fields.forEach(({ key, element }) => {
      vehicle[key] = key === 'size'
        ? parseInt(element.value)
        : element.value.trim();
    });

    isEdit
      ? await updateVehicleAsync(vehicle)
      : await addVehicleAsync(vehicle);

    fields.forEach(({ element }) => element.value = '');
    printAllVehicles(await getAllVehiclesAsync());
  } catch (er) {
    console.error(`Error while ${isEdit ? 'updating' : 'adding'} vehicle:`, er.message);
  }
}

document.querySelector('#search')
  .addEventListener('click', async () => {
    try {
      const data = await getAllVehiclesAsync();
      const query = document.querySelector('#search-input').value
        .replace(/[^A-Z0-9]g/, '')
        .toUpperCase();
      const vehicle = data.filter(el => el.licensePlate === query);

      printAllVehicles(vehicle);
    } catch (er) {
      console.error('Error while searching parkings:', er.message);
    }
  });

document.querySelector('#refresh')
  .addEventListener('click', async () => {
    try {
      printAllVehicles(await getAllVehiclesAsync());
    } catch (er) {
      console.error('Error while refreshing parkings:', er.message);
    }
  });

document.querySelector('#add')
  .addEventListener('click', () => {
    const fields = selectVehicleFormFields();

    fields.forEach(({ element }) => element.value = '');
    isEdit = false;
  });

document.querySelector('#table').addEventListener('click', async ev => {
  const target = ev.target;
  const row = target.closest('tr');

  if (target.classList.contains('action-button')) {
    const vehicleInfoData = row.querySelector('.plate').dataset.vehicleInfo;
    const vehicleInfo = JSON.parse(vehicleInfoData);

    isEdit = target.classList.contains('edit');

    try {
      const fields = selectVehicleFormFields();

      if (isEdit) {
        fields.forEach(({ key, element }) => {
          if (vehicleInfo.hasOwnProperty(key)) {
            element.value = key === 'size'
              ? parseInt(vehicleInfo[key])
              : vehicleInfo[key];
          }
        });
      }

      submit.removeEventListener('click', handleSubmit);
      submit.addEventListener('click', handleSubmit);

      if (target.classList.contains('delete')) {
        const licensePlate = row.querySelector('.plate').textContent;

        try {
          await removeVehicleAsync(licensePlate);
          printAllVehicles(await getAllVehiclesAsync());
        } catch (er) {
          console.error('Error while removing vehicle:', er.message);
        }
      }
    } catch (er) {
      console.error('Error while serializing form:', er.message);
    }
  }
});

(async function init() {
  try {
    printAllVehicles(await getAllVehiclesAsync());
  } catch (er) {
    console.error('Error while loading vehicles:', er.message);
  }
})();
