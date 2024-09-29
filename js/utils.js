function handleLinkActiveState() {
  const links = document.querySelectorAll('.navlink');

  links.forEach(el => {
    el.addEventListener('click', ev => {
      links.forEach(el => el.classList.remove('active'));
      ev.target.classList.add('active');
      sessionStorage.setItem('activeLink', ev.target.id);
    });
  });

  const activeLinkId = sessionStorage.getItem('activeLink');

  if (activeLinkId) {
    const activeLink = document.querySelector(`#${activeLinkId}`);

    if (activeLink)
      activeLink.classList.add('active');
  }
}

function createParkingActionsCell() {
  const actionsCell = document.createElement('td');
  const actionsDiv = document.createElement('div');

  actionsDiv.classList.add('actions');

  const editIcon = document.createElement('i');

  editIcon.classList.add('exit', 'action-button', 'fa-solid', 'fa-door-closed');
  actionsDiv.appendChild(editIcon);

  const deleteIcon = document.createElement('i');

  deleteIcon.classList.add('delete', 'action-button', 'fa-solid', 'fa-ban');
  actionsDiv.appendChild(deleteIcon);
  actionsCell.appendChild(actionsDiv);

  return actionsCell;
}

function createActionsCell() {
  const actionsCell = document.createElement('td');
  const actionsDiv = document.createElement('div');

  actionsDiv.classList.add('actions');

  const editIcon = document.createElement('i');

  editIcon.classList.add('edit', 'action-button', 'fa-solid', 'fa-pen-to-square');
  editIcon.setAttribute('data-bs-toggle', 'modal');
  editIcon.setAttribute('data-bs-target', '#addModal');
  actionsDiv.appendChild(editIcon);

  const deleteIcon = document.createElement('i');

  deleteIcon.classList.add('delete', 'action-button', 'fa-solid', 'fa-ban');
  actionsDiv.appendChild(deleteIcon);
  actionsCell.appendChild(actionsDiv);

  return actionsCell;
}

function formatLicensePlate(licensePlate) {
  return licensePlate.slice(0, 3) + '-' + licensePlate.slice(3);
}

function formatParkingDateTime(dateTime) {
  const date = new Date(dateTime);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const time = date.toTimeString().split(' ')[0];

  return dateTime === null
    ? '--'
    : `${month}/${day}/${year} ${time}`;
}

function formatFareDateTime(dateTime) {
  const date = new Date(dateTime);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return dateTime == null
    ? '--'
    : `${month}/${day}/${year}`;
}

function reformatFareDateTime(dateTime) {
  if (dateTime === '')
    return null;

  const [month, day, year] = dateTime.split('/')
    .map(Number);
  const date = new Date(year, month - 1, day);

  return date.toISOString().split('.')[0];
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

function formatVehicleSize(size) {
  switch (size) {
    case 1:
      return 'Small';

    case 2:
      return 'Medium';

    case 3:
      return 'Large';

    default:
      return 'Unknown';
  }
}

function formatBoolValue(bool) {
  return bool
    ? 'Yes'
    : 'No';
}

function printToast(message) {
  const toast = document.querySelector('#msg-toast');
  const toastBody = document.querySelector("#toast-body");

  toastBody.textContent = message;

  const liveToast = bootstrap.Toast.getOrCreateInstance(toast);

  liveToast.show()
}

function selectVehicleFormFields() {
  return [
    { key: 'licensePlate', element: document.querySelector('#plate-input') },
    { key: 'size', element: document.querySelector('#size-input') },
    { key: 'brand', element: document.querySelector('#brand-input') },
    { key: 'model', element: document.querySelector('#model-input') },
    { key: 'color', element: document.querySelector('#color-input') }
  ];
}

function selectFareFormFields() {
  return [
    { key: 'startDate', element: document.querySelector('#start-input') },
    { key: 'endDate', element: document.querySelector('#end-input') },
    { key: 'pricePerHour', element: document.querySelector('#price-input') }
  ];
}
