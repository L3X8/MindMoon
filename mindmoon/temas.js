// temas.js
document.addEventListener("DOMContentLoaded", () => {
  const themeDots = document.querySelectorAll(".theme-dot");
  const rootElement = document.documentElement;

  // Si en alguna página no pones los botones, el código no se romperá
  if (!themeDots || themeDots.length === 0) {
    // Aún así aplicamos el tema guardado para que la página no cambie de color
    const savedTheme = localStorage.getItem("material3-theme") || "lavender";
    rootElement.setAttribute("data-theme", savedTheme);
    return; 
  }

  const savedTheme = localStorage.getItem("material3-theme") || "lavender";
  applyTheme(savedTheme);

  themeDots.forEach(dot => {
    dot.addEventListener("click", () => {
      const selectedTheme = dot.getAttribute("data-set-theme");
      applyTheme(selectedTheme);
      localStorage.setItem("material3-theme", selectedTheme);
    });
  });

  function applyTheme(themeName) {
    rootElement.setAttribute("data-theme", themeName);
    
    themeDots.forEach(dot => {
      if (dot.getAttribute("data-set-theme") === themeName) {
        dot.classList.add("active");
      } else {
        dot.classList.remove("active");
      }
    });
  }
});