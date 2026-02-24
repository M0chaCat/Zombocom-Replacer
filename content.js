(() => {
  const url = chrome.runtime.getURL("custom.html");

  const replaceWithCustomHtml = async () => {
    const response = await fetch(url);
    const html = await response.text();

    const parser = new DOMParser();
    const parsed = parser.parseFromString(html, "text/html");

    document.documentElement.replaceWith(
      document.importNode(parsed.documentElement, true)
    );

    const setupZombo = () => {
      const spinner = document.getElementById("spinner");
      let angle = 0;

      const spin = () => {
        if (!spinner) {
          return;
        }
        angle += 80;
        if (angle > 360) angle -= 360;
        spinner.setAttribute("transform", `rotate(${angle}, 81, 69)`);
        setTimeout(spin, 100);
      };

      const start = () => {
        const looper = document.getElementById("looper");
        if (looper) {
          looper.play().catch(() => {});
        }
        const startContainer = document.getElementById("start_container");
        if (startContainer) {
          startContainer.style.display = "none";
        }
        spin();
        const audio = document.querySelector("audio");
        if (audio) {
          audio.play().catch(() => {});
        }
      };

      const startButton = document.getElementById("start_button");
      if (startButton) {
        startButton.addEventListener("click", start);
      }

      const audio = document.querySelector("audio");
      if (audio) {
        const promise = audio.play();
        if (promise && typeof promise.then === "function") {
          promise
            .then(() => {
              spin();
            })
            .catch(() => {
              const startContainer = document.getElementById("start_container");
              if (startContainer) {
                startContainer.style.display = "block";
              }
            });
        }
      }
    };

    setupZombo();
  };

  replaceWithCustomHtml().catch((error) => {
    console.error("Failed to load custom HTML:", error);
  });
})();
