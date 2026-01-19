## When to Write a Kubernetes Operator  
### and How to Do It Right

---
## The trap
> “Writing a Kubernetes Operator sounds great…”

…but often:
- YAML would have been enough
- complexity sneaks in
- maintenance cost explodes

Note:
Set expectations. This is a warning, not a sales pitch.
---

## So when *does* an Operator make sense?

When you need:
- relationships between resources
- invariants (“if X exists, Y must exist”)
- lifecycle & cleanup
- continuous enforcement

Note:
This is the core decision slide.
---

## When you *don’t* need one

If it’s:
- static resources
- one-off generation
- simple templating

➡️ **Just use YAML.**

Note:
Say this explicitly. It builds trust.

---

### What an Operator really is
### No magic. Just a loop.
<div class="mermaid">
graph TD;
  DS[Desired State] --> RL[Reconcile];
  RL --> AS[Actual State];
  AS --> ST[Status];
  ST --> DS;
</diV>
Note:
Keep it high-level.
No controller-runtime internals.
---
## What makes a good Operator?

- simple reconciliation logic
- idempotent behavior
- clear, meaningful status
- boring, predictable outcomes

Note:
“Boring” is a feature.
---
### What the Operator does not do

- no workflows

- no step-by-step logic

- no hidden state

**It only:**

- reads the world

- enforces a contract

Note:
This separates Operators from scripts.

---
## The line to draw
**You declare**
- What you want with YAML

**The Operator handles**
- All relationships
- Complete Lifecycle
- Keeps everything in desired state

Note:
This answers the CFP (Call for Paper) promise directly.

“Here’s the line I try to draw.
If you’re managing a single resource, YAML is great.

The moment you introduce relationships between resources —
‘if this exists, that must exist too’ — YAML starts to hurt.

And as soon as time, lifecycle, or invariants are involved,
you’re already writing an Operator — just not in the cluster yet.

---
#### Let's scaffold an operator...
1. Install Go
2. Install a Kubernetes Distribution
3. Get the Operator SDK
---
#### Let's scaffold an operator...
```shell
operator-sdk init --domain "$DOMAIN" --repo "$REPO"
```  

Note:
This just creates the skeleton — no logic yet.
---
### ... And Create a Resources and a Controller
```shell
operator-sdk create api \
  --group kitchen \
  --version v1alpha1 \
  --kind Teapot \
  --resource \
  --controller
```

Note:
From here on, everything interesting happens in code.
---
### Reconcile is the Operator
```go
func (r *TeapotReconciler) Reconcile(ctx context.Context, req ctrl.Request) (ctrl.Result, error) {
    // read current state
    // check dependencies
    // update status
    return ctrl.Result{}, nil
}
```
Note:
This function is the Operator. Everything else is scaffolding.
---

### Demo


Note:
- Show YAML first
- kubectl delete  leave,teapot,water --all
- apply teapot without operator
- start operator add rest
- curl -w "\nStatus: %{http_code}\n" localhost:8082
- k8s-port-forward.sh
---
## Takeaways
- Operators are powerful - and expensive
- Write them - and code in general - rarely
- Keep them small
- Make status your UX
---
## Links
<img src="assets/qrcode.svg" width="250" alt="QR Code">

- [Presentation](https://github.com/schmiddim/reveal-js-boilerplate/blob/master/slides.pdf)
- [Golang](https://go.dev/doc/install) 
- [Operator SDK](https://sdk.operatorframework.io/)
- [Tea Pot Operator](https://github.com/schmiddim/teapot-operator) 
- [My LinkedIn](https://www.linkedin.com/in/michael-schmitt-ist-cool/) 
