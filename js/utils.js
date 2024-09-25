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

function createActionsCell() {
  const actionsCell = document.createElement('td');
  const actionsDiv = document.createElement('div');
  actionsDiv.classList.add('actions');

  const editIcon = document.createElement('i');
  editIcon.id = 'edit';
  editIcon.classList.add('action-button', 'fa-regular', 'fa-pen-to-square');
  actionsDiv.appendChild(editIcon);

  const deleteIcon = document.createElement('i');
  deleteIcon.id = 'delete';
  deleteIcon.classList.add('action-button', 'fa-solid', 'fa-ban');
  actionsDiv.appendChild(deleteIcon);

  actionsCell.appendChild(actionsDiv);

  return actionsCell;
}

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

function printToast(message) {
  const toast = document.querySelector('#msg-toast');
  
  const toastBody = document.querySelector("#toast-body");
  toastBody.textContent = message;

  const liveToast = bootstrap.Toast.getOrCreateInstance(toast);
  liveToast.show()
}

(async function init() {
  await getMenuAsync();
  await getToastAsync();
})();
