const onRegisterSuccess = ({ scope }) =>
  console.info('Service worker registered', scope)

const onRegisterFailure = (err) =>
  console.warn('Service worker failed to register', err)

const registerServiceWorker = (serviceWorker) =>
  serviceWorker.register('/service-worker.js')
    .then(onRegisterSuccess, onRegisterFailure)

if ('serviceWorker' in navigator) {
  registerServiceWorker(navigator.serviceWorker)
}
