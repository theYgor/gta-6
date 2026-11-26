const menu = document.getElementById("menu");
const blocos = document.querySelectorAll(".aparecer");
const video = document.querySelector(".capa-video");
const capa = document.querySelector(".capa");
const capaPainel = document.querySelector(".capa-painel");
const capaConteudo = document.querySelector(".capa-conteudo");
const capaBarra = document.querySelector(".capa-barra");
const capaSeta = document.querySelector(".capa-seta");

if (menu) {
    window.addEventListener("scroll", function () {
        if (window.scrollY > 50) {
            menu.classList.add("menu-rolado");
        } else {
            menu.classList.remove("menu-rolado");
        }
    });
}

if (blocos.length) {
    const observador = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (entrada) {
            if (entrada.isIntersecting) {
                entrada.target.classList.add("visivel");
            }
        });
    });

    blocos.forEach(function (bloco) {
        observador.observe(bloco);
    });
}

if (window.gsap && window.ScrollTrigger && video && capa && capaPainel && capaConteudo) {
    gsap.registerPlugin(ScrollTrigger);

function iniciarScrub() {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.capa',
      start: 'top top',
      end: '+=300%',       
      scrub: true,
      pin: '.capa-painel',
      anticipatePin: 1,
      invalidateOnRefresh: true
    }
  });

  tl.fromTo(video, { currentTime: 0 }, { currentTime: video.duration, ease: 'none' });
}

function preparar() {
  video.play().then(() => video.pause()).catch(() => {});
  iniciarScrub();
  ScrollTrigger.refresh();
}

if (video.readyState >= 1) {
  preparar();
} else {
  video.addEventListener('loadedmetadata', preparar, { once: true });
}
}
