(() => {
  const image = document.getElementById('kitsune-animation');
  const canvas = document.getElementById('kitsune-still');
  const button = document.getElementById('portrait-toggle');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const context = canvas.getContext('2d');
  if (!context) return;
  let paused = false;
  let ready = false;
  function setPaused(value) {
    if (!ready) return;
    if (value) {
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      context.drawImage(image, 0, 0);
    }
    paused = value;
    image.hidden = paused;
    canvas.hidden = !paused;
    button.textContent = paused ? 'Resume animation' : 'Pause animation';
    button.setAttribute('aria-pressed', String(paused));
  }
  function initialize() {
    if (ready || !image.naturalWidth) return;
    ready = true;
    button.hidden = false;
    setPaused(reduced.matches);
    image.classList.add('ready');
  }
  image.addEventListener('load', initialize);
  if (image.complete) initialize();
  button.addEventListener('click', () => setPaused(!paused));
  reduced.addEventListener('change', event => setPaused(event.matches));
})();
