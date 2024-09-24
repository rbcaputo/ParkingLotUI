const ENDPOINT = 'http://localhost:5269';

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

async function getMenu() {
  const menu = document.querySelector('#menu');

  try {
    const response = await fetch('../html/menu.html')

    if (!response.ok)
      throw new Error(`Http error: status ${response.status}.`);

    menu.innerHTML = await response.text();

    handleLinkActiveState();
  }
  catch (er) {
    console.error('Error while retrieving menu module:', er.message);
  }
}

async function getAllData(resource) {
  try {
    const response = await fetch(`${ENDPOINT}/${resource}`);

    if (!response.ok)
      throw new Error(`Http error: status ${response.status}.`);

    return await response.json();
  }
  catch (er) {
    console.error('Error while retrieving data:', er.message);
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

const control = document.querySelectorAll(".control-button");
const actions = document.querySelectorAll(".action-button");


(async function init() {
  await getMenu();
})();
