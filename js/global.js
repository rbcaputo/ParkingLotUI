const ENDPOINT = 'http://localhost:5269';

async function getMenuAsync() {
  const menu = document.querySelector('#menu');

  try {
    const response = await fetch('../html/modules/menu.html');

    if (!response.ok)
      throw new Error(`Http error: status ${response.status}.`);

    menu.innerHTML = await response.text();

    handleLinkActiveState();
  }
  catch (er) {
    console.error('Error while retrieving menu module:', er.message);
  }
}

async function getToastAsync() {
  const toast = document.querySelector('#toast');

  try {
    const response = await fetch('../html/modules/toast.html');

    if (!response.ok)
      throw new Error(`Http error: status ${response.status}.`);

    toast.innerHTML = await response.text();
  }
  catch (er) {
    console.error('Error while retrieving toast module:', er.message);
  }
}

async function getAllDataAsync(resource) {
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
