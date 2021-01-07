import 'alpinejs';

window.app = () => {
  return {
    confetti() {
      import('canvas-confetti')
        .then(({default: confetti}) => confetti());
    }
  }
};