(function () {
  "use strict";

  /* ---------- Menu mobile ---------- */

  var body = document.body;
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("nav-menu");
  var fundo = document.querySelectorAll("main, footer");

  /* Com o painel aberto, o conteúdo atrás fica fora da ordem de tabulação */
  function tornarInerte(inerte) {
    fundo.forEach(function (el) {
      el.inert = inerte;
    });
  }

  function abrirMenu() {
    body.classList.add("menu-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Fechar menu");
    tornarInerte(true);
  }

  function fecharMenu() {
    if (!body.classList.contains("menu-open")) return;
    body.classList.remove("menu-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menu");
    tornarInerte(false);
  }

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      if (body.classList.contains("menu-open")) {
        fecharMenu();
      } else {
        abrirMenu();
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && body.classList.contains("menu-open")) {
        fecharMenu();
        toggle.focus();
      }
    });

    /* Clique fora dos links (no fundo do painel) fecha o menu */
    menu.addEventListener("click", function (e) {
      if (e.target === menu) fecharMenu();
    });

    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", fecharMenu);
    });

    /* Rotating to landscape can cross the breakpoint with the panel open. The CSS hides
       the panel, but `inert` is a JS property no media query undoes, so the page would
       stay untabbable. Mirrors the 819px breakpoint in style.css.
       Both listeners on purpose: matchMedia alone does not fire in every environment. */
    var desktop = window.matchMedia("(min-width: 820px)");

    function fecharSeDesktop() {
      if (desktop.matches) fecharMenu();
    }

    desktop.addEventListener("change", fecharSeDesktop);
    window.addEventListener("resize", fecharSeDesktop);
  }

  /* ---------- Revelação das seções (única animação do site) ---------- */

  var reduzido = window.matchMedia("(prefers-reduced-motion: reduce)");
  var alvos = document.querySelectorAll("[data-reveal]");

  if (!reduzido.matches && "IntersectionObserver" in window && alvos.length) {
    var observador = new IntersectionObserver(
      function (entradas) {
        entradas.forEach(function (entrada) {
          if (entrada.isIntersecting) {
            entrada.target.classList.add("is-visible");
            observador.unobserve(entrada.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    alvos.forEach(function (el) {
      el.classList.add("reveal");
      observador.observe(el);
    });
  }
})();
