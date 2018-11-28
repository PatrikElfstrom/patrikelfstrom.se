// Tell the service worker to skip waiting
async function skipWaiting() {
  const reg = await navigator.serviceWorker.getRegistration();

  if (!reg || !reg.waiting) {
    return;
  }

  reg.waiting.postMessage('skip-waiting');
}

// Wait for an installing worker
async function installingWorker(registration) {
  if (registration.installing) {
    return registration.installing;
  }

  return new Promise((resolve) => {
    registration.addEventListener('updatefound', () => resolve(registration.installing), {
      once: true,
    });
  });
}

// Wait a service worker to become waiting
async function updateReady(registration) {
  if (registration.waiting) {
    return undefined;
  }

  const installing = await installingWorker(registration);

  return new Promise((resolve) => {
    installing.addEventListener('statechange', () => {
      if (installing.state === 'installed') {
        resolve();
      }
    });
  });
}

export default async function offliner(showSnack) {
  if (process.env.NODE_ENV === 'production') {
    navigator.serviceWorker.register('/sw.js');
  }

  const hasController = !!navigator.serviceWorker.controller;

  // Look for changes in the controller
  navigator.serviceWorker.addEventListener('controllerchange', async () => {
    // Is it the first install?
    if (!hasController) {
      showSnack('Ready to work offline', { timeout: 10000 });
      return;
    }

    // Otherwise reload (the user will have agreed to this).
    window.location.reload();
  });

  // If we don't have a controller, we don't need to check for updates – we've just loaded from the
  // network.
  if (!hasController) {
    return;
  }

  const reg = await navigator.serviceWorker.getRegistration();
  // Service worker not registered yet.
  if (!reg) {
    return;
  }
  // Look for updates
  await updateReady(reg);

  // Ask the user if they want to update.
  const result = await showSnack('Update available', {
    actions: ['reload', 'dismiss'],
  });

  // Tell the waiting worker to activate, this will change the controller and cause a reload (see
  // 'controllerchange')
  if (result === 'reload') skipWaiting();
}
