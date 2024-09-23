const ENDPOINT = 'http://localhost:5269';

(async function fetchMenu() {
	const menu = document.querySelector('#menu');

	try {
		const response = await fetch('../html/menu.html')

		if (!response.ok)
			throw new Error(`The request to load module "menu" could not be completed: status ${response.status}.`);

		menu.innerHTML = await response.text();
	}
	catch (er) {
		console.error(er.message)
	}
})();

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
