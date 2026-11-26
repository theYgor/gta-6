const menu = document.getElementById("menu");
const blocos = document.querySelectorAll(".aparecer");
const video = document.querySelector(".capa-video");
const capa = document.querySelector(".capa");
const capaPainel = document.querySelector(".capa-painel");
const capaConteudo = document.querySelector(".capa-conteudo");

if (menu) {
    window.addEventListener("scroll", function () {
        if (window.scrollY > 50) {
            menu.classList.add("menu-rolado");
        } else {
            menu.classList.remove("menu-rolado");
        }
    }, { passive: true });
}

if (blocos.length) {
    const observador = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (entrada) {
            if (entrada.isIntersecting) {
                entrada.target.classList.add("visivel");
                observador.unobserve(entrada.target);
            }
        });
    }, { threshold: 0.15 });

    blocos.forEach(function (bloco) {
        observador.observe(bloco);
    });
}

if (window.gsap && window.ScrollTrigger && video && capa && capaPainel && capaConteudo) {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    video.muted = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "true");
    video.pause();

    let iniciado = false;

    const iniciarVideoScroll = function () {
        if (iniciado) return;

        if (!video.duration || !Number.isFinite(video.duration)) {
            return;
        }

        iniciado = true;

        const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
                trigger: capa,
                start: "top top",
                end: "+=2200",
                scrub: 0.5,
                pin: true,
                anticipatePin: 1,
                invalidateOnRefresh: true,
            }
        });

        tl.to(".capa-conteudo, .capa-barra", {
            opacity: 0,
            y: -40,
            scale: 0.6,
            duration: 0.15,
        }, 0);

        tl.to(".capa-seta", { opacity: 0, duration: 0.15 }, 0);

        tl.to(video, { opacity: 1, duration: 0.15 }, 0);

        tl.to(video, {
            currentTime: Math.max(video.duration - 0.05, 0),
            duration: 1,
        }, 0);

        ScrollTrigger.refresh();
    };

    video.addEventListener("error", function () {
        console.error("Erro ao carregar o vídeo:", video.currentSrc || video.src);
    });

    const prepararVideo = function () {
        iniciarVideoScroll();

        const tentativa = video.play();

        if (tentativa && typeof tentativa.then === "function") {
            tentativa
                .then(function () { video.pause(); })
                .catch(function () {});
        } else {
            video.pause();
        }
    };

    if (video.readyState >= 1) {
        prepararVideo();
    } else {
        video.addEventListener("loadedmetadata", prepararVideo, { once: true });
    }

    window.addEventListener("load", function () {
        ScrollTrigger.refresh();
    });
}
