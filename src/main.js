import "reveal.js/reveal.css";
import "reveal.js/plugin/highlight/monokai.css";
import "@fontsource/atkinson-hyperlegible/400.css";
import "@fontsource/atkinson-hyperlegible/400-italic.css";
import "@fontsource/atkinson-hyperlegible/700.css";
import "./custom.css";

// Always import black theme as base
import "reveal.js/theme/white.css";

import Reveal from "reveal.js";
import RevealMarkdown from "reveal.js/plugin/markdown";
import RevealHighlight from "reveal.js/plugin/highlight";
import RevealNotes from "reveal.js/plugin/notes";
import mermaid from "mermaid";

if (THEME === 'print') {
  import("reveal.js/theme/white.css");
}

const showNotes = THEME === 'print' ? "separate-page" : false;


Reveal.initialize({
  hash: true,
  slideNumber: 'c/t',
  controls: true,
  progress: true,
  showNotes: showNotes,
  plugins: [RevealMarkdown, RevealHighlight, RevealNotes],
});

mermaid.initialize({ startOnLoad: false, theme: "black" });

const getMermaidNodes = (scope) =>
    Array.from(scope.querySelectorAll(".mermaid"));

const renderMermaid = (scope) => {
  const nodes = getMermaidNodes(scope);
  if (nodes.length === 0) return;

  nodes.forEach((node) => {
    if (!node.dataset.mermaidSrc) {
      const src = node.textContent.trim();
      if (src.length === 0) return;
      node.dataset.mermaidSrc = src;
    }

    node.textContent = node.dataset.mermaidSrc;
    node.removeAttribute("data-processed");
    mermaid.run({ nodes: [node] });
  });
};

Reveal.on("ready", () => {
  const currentSlide = Reveal.getCurrentSlide();
  if (currentSlide) {
    requestAnimationFrame(() => renderMermaid(currentSlide));
  }
});

Reveal.on("slidechanged", (event) => {
  const slide = event?.currentSlide;
  if (slide) {
    requestAnimationFrame(() => renderMermaid(slide));
  }
});
