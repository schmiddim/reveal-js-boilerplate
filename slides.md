## Go Hello World

```go
package main

import "fmt"
// the main function 
func main() {
	fmt.Println("Hello, world!")
}
```

---

## Mermaid Diagram

<div class="mermaid">
graph TD;
  A[Start] --> B{Decision};
  B -->|Yes| C[Do thing];
  B -->|No| D[Stop];
</div>

---

# Mein Vortrag
### reveal.js · Markdown · NixOS

Note:
Begrüßung
Kurz erklären, dass alles aus Markdown kommt.

---

## Agenda
- Motivation
- Setup
- Demo
- Fazit

Note:
Agenda kurz durchgehen, nicht ins Detail.

---

## Motivation
Warum diese Lösung?

- reproduzierbar
- leichtgewichtig
- versionierbar
- kein PowerPoint 😉

Note:
Bezug auf NixOS / Dev-Workflows herstellen.

---

## Setup (kurz)

```bash
nix-shell -p nodejs
npm install reveal.js
python -m http.server
