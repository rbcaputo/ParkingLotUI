async function getAllFaresAsync() {
  try {
    const fares = await getAllDataAsync('fare');
    const alert = document.querySelector('#alert');

    if (fares && fares.length > 0) {
      alert.classList.add('invisible');

      return fares;
    }

    alert.classList.remove('invisible');
  } catch (er) {
    console.error('Error while retrieving fares:', er.message);
  }
}

function printAllFares(fares) {
  const table = document.querySelector('#table');

  table.innerHTML = '';

  const fields = [
    { key: 'startDate', get: el => formatFareDateTime(el.startDate) },
    { key: 'originalStartDate', get: el => el.startDate },
    { key: 'endDate', get: el => formatFareDateTime(el.endDate) },
    { key: 'pricePerHour', get: el => el.pricePerHour.toFixed(2) },
    { key: 'isCurrent', get: el => formatBoolValue(el.isCurrent) }
  ];

  fares.forEach(el => {
    const row = document.createElement('tr');

    fields.forEach(field => {
      const cell = document.createElement('td');

      if (field.key === 'pricePerHour') {
        cell.classList.add('price-hour');
        cell.dataset.fareInfo = JSON.stringify(el);
      }

      if (field.key === 'originalStartDate')
        cell.classList.add('start-date', 'invisible');

      cell.textContent = field.get(el);
      row.appendChild(cell);
    });

    row.appendChild(createActionsCell());
    table.appendChild(row);
  });
}

async function addFareAsync(fare) {
  try {
    const fareDto = {
      startDate: reformatFareDateTime(fare.startDate),
      endDate: reformatFareDateTime(fare.endDate),
      pricePerHour: fare.pricePerHour
    };

    const response = await fetch(`${ENDPOINT}/fare`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(fareDto)
    });

    printToast(await response.text());
  } catch (er) {
    console.error('Error while adding new fare:', er.message);
  }
}

async function updateCurrentFareAsync(fare) {
  try {
    const fareDto = {
      startDate: reformatFareDateTime(fare.startDate),
      endDate: reformatFareDateTime(fare.endDate),
      pricePerHour: fare.pricePerHour
    };

    const response = await fetch(`${ENDPOINT}/fare`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(fareDto)
    });

    printToast(await response.text());
  } catch (er) {
    console.error('Error while updating fare:', er.message);
  }
}

async function removeFareAsync(startDate) {
  try {
    const response = await fetch(`${ENDPOINT}/fare`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(startDate)
    });

    printToast(await response.text());
  } catch (er) {
    console.error('Error while removing fare:', er.message);
  }
}

const submit = document.querySelector('#submit');
let isEdit;

async function handleSubmit(ev) {
  ev.preventDefault();

  try {
    const fields = selectFareFormFields();
    const fare = {};

    fields.forEach(({ key, element }) => {
      fare[key] = element.value.trim();
    });

    isEdit
      ? await updateCurrentFareAsync(fare)
      : await addFareAsync(fare);

    fields.forEach(({ element }) => element.value = '');
    printAllFares(await getAllFaresAsync());
  } catch (er) {
    console.error(`Error while ${isEdit ? 'updating' : 'adding'} fare:`, er.message);
  }
}

document.querySelector('#search')
  .addEventListener('click', async () => {
    try {
      const query = document.querySelector('#search-input').value.trim();
      const decimal = /^(0[0-9]{1}|[1-9][0-9]?)(\.[0-9]{2})?$/;

      if (decimal.test(query)) {
        const data = await getAllFaresAsync();
        const queryNum = parseFloat(query);
        const epsilon = 0.001;
        const fares = data.filter(el => Math.abs(el.pricePerHour - queryNum) < epsilon);

        printAllFares(fares);
      }
    } catch (er) {
      console.error('Error while searching fares:', er.message);
    }
  });

document.querySelector('#refresh')
  .addEventListener('click', async () => {
    try {
      printAllFares(await getAllFaresAsync());
    } catch (er) {
      console.error('Error while refreshing fares:', er.message);
    }
  });


document.querySelector('#add')
  .addEventListener('click', () => {
    const fields = selectFareFormFields();

    fields.forEach(({ element }) => element.value = '');
    isEdit = false;
  });

document.querySelector('#table')
  .addEventListener('click', async ev => {
    const target = ev.target;
    const row = target.closest('tr');

    if (target.classList.contains('action-button')) {
      const fareInfoData = row.querySelector('.price-hour').dataset.fareInfo;
      const fareInfo = JSON.parse(fareInfoData);

      isEdit = target.classList.contains('edit');

      try {
        const fields = selectFareFormFields();

        if (isEdit) {
          fields.forEach(({ key, element }) => {
            if (fareInfo.hasOwnProperty(key)) {
              if (key === 'startDate' || key === 'endDate') {
                if (fareInfo[key] === null)
                  element.value = '';
                else
                  element.value = formatFareDateTime(fareInfo[key]);
              } else if (key === 'pricePerHour') {
                element.value = fareInfo[key].toFixed(2);
              } else {
                element.value = fareInfo[key];
              }
            }
          });
        }

        submit.removeEventListener('click', handleSubmit);
        submit.addEventListener('click', handleSubmit);

        if (target.classList.contains('delete')) {
          const startDate = row.querySelector('.start-date').textContent;

          await removeFareAsync(startDate);
          printAllFares(await getAllFaresAsync());
        }
      } catch (er) {
        console.error('Error while parsing fare info:', er.message);
      }
    }
  });

(async function init() {
  try {
    printAllFares(await getAllFaresAsync());
  } catch (er) {
    console.error('Error while loading fares:', er.message);
  }
})();