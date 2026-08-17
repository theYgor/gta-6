// OBJETIVO: dar comportamento ao site do GTA VI com JavaScript.

// Passos:
// 1. MENU QUE SOME AO ROLAR
//    - achar o menu no HTML
//    - escutar o evento de rolagem da janela
//    - se a página desceu mais de 50px, adicionar a classe "menu-rolado"
//    - se voltou pro topo, remover a classe

// 2. BLOCOS QUE APARECEM
//    - achar todos os elementos com a classe "aparecer"
//    - avisar quando cada um entrar na tela
//    - ao entrar, adicionar a classe "visivel"

// 3. VÍDEO QUE ANDA COM O SCROLL
//    - achar o vídeo da capa
//    - prender a capa na tela enquanto a pessoa rola
//    - sumir com o conteúdo da capa e revelar o vídeo
//    - avançar o tempo do vídeo conforme o scroll

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

    video.muted = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "true");

    const tocarVideo = function () {
        const playPromise = video.play();

        if (playPromise && typeof playPromise.catch === "function") {
            playPromise.catch(function () {
                // autoplay pode ser bloqueado até o usuário interagir
            });
        }
    };

    const iniciarVideoScroll = function () {
        if (!video.duration || Number.isNaN(video.duration) || !Number.isFinite(video.duration)) {
            return;
        }

        gsap.timeline({
            scrollTrigger: {
                trigger: capa,
                start: "top top",
                end: "+=2200",
                scrub: 1,
                pin: true,
                invalidateOnRefresh: true,
            }
        })
            .to(video, { opacity: 1, ease: "none" }, 0)
            .to(".capa-conteudo, .capa-barra, .capa-seta", {
                opacity: 0,
                y: -40,
                scale: 0.6,
                duration: 0.18,
                ease: "none",
            }, 0.02);

        ScrollTrigger.create({
            trigger: capa,
            start: "top top",
            end: "+=1800",
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: function (self) {
                if (!video.duration || Number.isNaN(video.duration)) {
                    return;
                }

                video.currentTime = self.progress * video.duration;
            }
        });
    };

    if (video.readyState >= 1) {
        tocarVideo();
        iniciarVideoScroll();
    } else {
        video.addEventListener("loadedmetadata", function () {
            tocarVideo();
            iniciarVideoScroll();
        }, { once: true });
    }
}
