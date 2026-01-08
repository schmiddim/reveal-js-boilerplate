import "reveal.js/dist/reveal.css";
import "reveal.js/dist/theme/black.css";
import "reveal.js/plugin/highlight/monokai.css";
import Reveal from "reveal.js";
import RevealMarkdown from "reveal.js/plugin/markdown/markdown.esm.js";
import RevealHighlight from "reveal.js/plugin/highlight/highlight.esm.js";
import RevealNotes from "reveal.js/plugin/notes/notes.esm.js";
import mermaid from "mermaid";

Reveal.initialize({
  hash: true,
  slideNumber: true,
  controls: true,
  progress: true,
  plugins: [RevealMarkdown, RevealHighlight, RevealNotes],
});

mermaid.initialize({ startOnLoad: false });

const renderMermaid = () => {
  const nodes = Array.from(document.querySelectorAll(".mermaid"));
  if (nodes.length === 0) return;

  mermaid.run({ nodes });
};

Reveal.on("ready", renderMermaid);
Reveal.on("slidechanged", renderMermaid);
