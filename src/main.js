import "reveal.js/dist/reveal.css";
import "reveal.js/plugin/highlight/monokai.css";
import "./custom.css";

// Always import black theme as base
import "reveal.js/dist/theme/black.css";

import Reveal from "reveal.js";
import RevealMarkdown from "reveal.js/plugin/markdown/markdown.esm.js";
import RevealHighlight from "reveal.js/plugin/highlight/highlight.esm.js";
import RevealNotes from "reveal.js/plugin/notes/notes.esm.js";
import mermaid from "mermaid";

if (THEME === 'print') {
  import("reveal.js/dist/theme/white.css");
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
