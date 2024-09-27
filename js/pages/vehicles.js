async function getAllVehiclesAsync() {
  try {
    const vehicles = await getAllDataAsync('vehicle');
    const alert = document.querySelector('#alert');

    if (vehicles &&
        vehicles.length > 0) {
      alert.classList.add('invisible');

      return vehicles;
    }
    else
      alert.classList.remove('invisible');
  }
  catch (er) {
    console.error('Error while retrieving vehicles:', er.message);
  }
}

async function printAllVehiclesAsync(vehicles) {
  try {
    const table = document.querySelector('#table');

    table.innerHTML = '';

    const fields = [
      { key: 'licensePlate', get: el => formatLicensePlate(el.licensePlate) },
      { key: 'size', get: el => formatVehicleSize(el.size) },
      { key: 'brand', get: el => el.brand },
      { key: 'model', get: el => el.model },
      { key: 'color', get: el => el.color }
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

      row.appendChild(createVehicleActionsCell());
      table.appendChild(row);
    });
  }
  catch (er) {
    console.error('Error while printing vehicle(s):', er.message);
  }
}

async function getVehicleByLicensePlateAsync(licensePlate) {
  try {
    const response = await fetch(`${ENDPOINT}/vehicle/${licensePlate}`);
    const alert = document.querySelector('#alert');

    if (response.ok) {
      alert.classList.add('invisible');
      printAllVehiclesAsync(await response.json());
    }
    else {
      alert.classList.remove('invisible');
      printToast(await response.text());
    }
  }
  catch (er) {
    console.error('Error while retrieving vehicle:', er.message);
  }
}

async function addVehicleAsync(vehicle) {
  try {
    const vehicleDto = {
      licensePlate: vehicle.licensePlate,
      size: vehicle.size,
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
  }
  catch (er) {
    console.error('Error while adding new vehicle:', er.message);
  }
}

async function updateVehicleAsync(vehicle) {
  try {
    const vehicleDto = {
      licensePlate: vehicle.licensePlate,
      size: vehicle.size,
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
  }
  catch (er) {
    console.error('Error while updating vehicle:', er.message);
  }
}

async function removeVehicleAsync(licensePlate) {

  try {
    const response = await fetch(`${ENDPOINT}/vehicle`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'text/plain'
      },
      body: licensePlate
    });

    printToast(await response.text());
  }
  catch (er) {
    console.error('Error while removing vehicle', er.message);
  }
}

document.querySelector('#search-button')
  .addEventListener('click', async () => {
    const licensePlate = document.querySelector('#search-input').value;

    printAllVehiclesAsync(await getVehicleByLicensePlateAsync(licensePlate));
  });

document.querySelector('#refresh')
  .addEventListener('click', async () => {
    try {
      await printAllVehiclesAsync(await getAllVehiclesAsync());
    }
    catch (er) {
      console.error('Error while refreshing parkings:', er.message);
    }
  });

document.querySelector('#submit')
  .addEventListener('click', async () => {
    try {
      const plate = document.querySelector('#plate-input');
      const size = document.querySelector('#size-input');
      const brand = document.querySelector('#brand-input');
      const model = document.querySelector('#model-input');
      const color = document.querySelector('#color-input');

      const vehicle = {
        licensePlate: plate.value.trim(),
        size: size.value.trim(),
        brand: brand.value.trim(),
        model: model.value.trim(),
        color: color.value.trim()
      }

      await addVehicleAsync(vehicle);
      plate.value = '';
      size.value = '';
      brand.value = '';
      model.value = '';
      color.value = '';
      await printAllVehiclesAsync(await getAllVehiclesAsync());
    }
    catch (er) {
      console.error('Error while submitting new vehicle:', er.message);
    }
  });

// document.querySelector('#table')
//   .addEventListener('click', async ev => {
//     const baseVehicle = ev.target;
//     const row = baseVehicle.closest('tr');

//     if (!row)
//       return

//     if (baseVehicle.classList.contains('action-button')) {
//       const vehicle = JSON.parse(row.querySelector('.plate').baseVehicle.dataset.vehicleInfo);

//       if (baseVehicle.classList.contains('edit'))
//         try {
//           await updateVehicleAsync(vehicle);
//         }
//         catch (er) {
//           console.error('Error while updating vehicle:', er.message);
//         }

//       if (baseVehicle.classList.contains('delete'))
//         try {
//           const licensePlate = row.querySelector('.plate').textContent;

//           await removeVehicleAsync(licensePlate);
//         }
//         catch (er) {
//           console.error('Error while removing vehicle:', er.message);
//         }

//       await printAllVehiclesAsync(await getAllVehiclesAsync());
//     }
//   });
