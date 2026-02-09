## When to Write a Kubernetes Operator  
### and How to Do It Right
#### (featuring: tea)
---
## About Me
Michael Schmitt

Sitereliability Engineer at interhyp.de

**Inter***net* **Hyp***othek* (internet mortgage)


Note:
- We help people getting the best interest rates for their mortgage
- portmanteau word.
---
## The trap
### “Writing a Kubernetes Operator sounds great…”

> …until you have to maintain it.

Note:
- writing is the easy part
- some weeks later: go dependencies, security updates, 
- 3 times a year: Kubernetes API deprecations
- 2 years later: "what does this method do?"

---
## So when *does* an Operator make sense?

When you need:
- relationships between resources
- invariants (“if X exists, Y must exist”)
- lifecycle & cleanup
- continuous enforcement

Note:
**relationships**
- If I deploy a teapot, I also need water 
- YAML can't express that - you'd need a human or a script
 
**invariants**
- "these two things must always exist together"
- if someone deletes one, the other should go too - or be recreated

**continuous enforcement**
- not "run once and done"
- someone deletes your ConfigMap? Operator recreates it
- drift correction, constantly
---
## When you *don’t* need one

If it’s:
- static resources
- one-off generation
- simple templating

➡️ **Just use YAML.**

Note:
**static resources**
- Deployment, Service, ConfigMap that never change

**on-off generation**
- "generate once, apply, done"
- Helm template, Kustomize, a shell script

**simple templating**
- "same thing, different namespace" or "different env vars"
- that's what Helm values are for

**just use YAML**
- say it out loud – *people need permission to keep it simple*
- "you don't need an Operator for this" *builds trust*
---
## No magic. Just a loop.
<div class="mermaid">
%%{init: {'theme': 'dark', 'themeVariables': {'fontSize': '28px'}}}%%
graph TD
  DS[Desired State] --> R[Reconcile]
  R --> AS[Actual State]
  R --> ST[Status]
  AS -.-> R
</div>

<style>
.mermaid .node rect {
  padding: 20px !important;
  rx: 5px;
  ry: 5px;
}
.mermaid .nodeLabel {
  padding: 0 15px !important;
}
</style>
Note:
**walk through the diagram**
- Desired State: what the user wrote in the YAML
- Reconcile: your code – compares desired vs actual
- Actual State: what's really in the cluster
- Status: report back what happened

**the loop**
- this runs constantly – not once
- every few seconds, or on every change
- that's the whole magic: there is none
---
## What makes a good Operator?

- simple reconciliation logic
- idempotent behavior
- clear, meaningful status
- boring, predictable outcomes

Note:
**simple reconciliation logic**
- if you can't explain it in 2 minutes, it's too complex
- one screen of code, ideally - keep this in mind :-)

**idempotent behavior**
- run it once, run it 100 times – same result
- no side effects, no "oops I created 50 ConfigMaps"

**clear, meaningful status**
- status is your UX – the only thing users see
- if something breaks, tell them what and why

**boring, predictable outcomes**
- no surprises
- Dishwasher
- "boring" is a feature, not a bug
---
## What the Operator does not do

- no workflows

- no step-by-step logic

- no hidden state

**It only:**
- observes
- corrects

Note:
**no workflows**
- not "first do A, then B, then C"
- no orchestration, no pipelines

**no step-by-step logic**
- no "if we already did step 2, skip to step 4"
- every reconcile starts fresh

**no hidden state**
- no "remember what we did last time"
- all state lives in the cluster, not in memory

**observes and corrects**
- look at desired, look at actual, fix the diff
- that's it – anything more, and you're building something else
---
## The line to draw
**You declare**
- What you want with YAML

**The Operator handles**
- All relationships
- Complete Lifecycle
- Keeps everything in desired state
- Tells you when it fails

Note:
**you declare what you want**
- just YAML, nothing else
- no scripts, no glue code, no "apply in this order"

**Operator handles the rest**
- creates dependencies automatically
- cleans up when parent is deleted
- corrects drift – someone deletes your ConfigMap? it comes back

**it tells you when it can't deliver**
- status shows: "I can't create this because X is missing"
- kubectl describe tells you exactly what's wrong
- no guessing, no log diving
---
## Let's scaffold an operator...
1. Install Go
2. Install a Kubernetes Distribution
3. Get the Operator SDK

Note:
- Get a current version of go
- Kind, minikube, rancher desktop, colima whatever you have
- Operator SDK: one binary, that's it
- you can do this on your laptop in 10 minutes
---
## Let's scaffold an operator...
```shell
operator-sdk init --domain "$DOMAIN" --repo "$REPO"
```  

Note:
**what this does**
- creates project structure: main.go, go.mod, Makefile
- domain: your company/project (e.g. example.com)
- repo: Go module path

**what you get**
- boilerplate, nothing interesting yet
- no CRD, no controller – just scaffolding
---
### ... And Create a Resource and a Controller
```shell
operator-sdk create api \
  --group kitchen \
  --version v1alpha1 \
  --kind Teapot \
  --resource \
  --controller
```
Note:
**what this creates**
- CRD: your custom resource definition (Teapot)
- controller: the reconcile loop that watches it

**the flags**
- group: API group (kitchen.example.com)
- version: start with v1alpha1 – you can graduate later
- kind: your resource name
- --resource --controller: create both

**now the real work starts**
- types.go: define your spec and status
- controller.go: write your reconcile logic
---
## Reconcile is the Operator
```go
package controller

/** ... **/

func (r *TeapotReconciler) Reconcile(
	    ctx context.Context, 
		req ctrl.Request) (ctrl.Result, error) {
    // read current state
    // check dependencies
    // update status
    return ctrl.Result{}, nil
}
```
Note:
**this is it**
- this function is your entire Operator
- everything else is scaffolding

**what happens here**
- read current state: get the Teapot from the cluster
- check dependencies: does Water exist?
- update status: tell the world what happened

**return values**
- ctrl.Result{}: done, wait for next event
- ctrl.Result{Requeue: true}: run again soon
- error: something went wrong, retry with backoff
---

## Demo


Note:
- Show YAML (water, leafe, teapot)
- kubectl delete  tealeave,teapot,water --all
- apply teapot without operator
- start operator, show state and also deployment and pod
- add rest
- show again
- curl -w "\nStatus: %{http_code}\n" localhost:8082
- delete deployment, delete teapot
- k8s-port-forward.sh

code demo

- teapot_types.go
- api versioning  beispiel zucker

---
## Takeaways
- Operators are powerful - and expensive
- Write them rarely
- Keep them small
- Status is your UX

Note:
**powerful and expensive**
- they solve real problems
- but: build time, testing, maintenance for years

**write them rarely**
- YAML first, Operator only when you hit the wall
- Operator only when relationships and lifecycle force you

**keep them small**
- one job, done well
- if it's growing, split it or rethink it

**status is your UX**
- the only thing users see
- "Ready: false, reason: WaterMissing" – that's your error message

---
## Thank you :-)

<img src="assets/qrcode.svg" width="250" alt="QR Code">

- [Presentation](https://github.com/schmiddim/reveal-js-boilerplate/blob/master/slides.pdf)
- [Golang](https://go.dev/doc/install) 
- [Operator SDK](https://sdk.operatorframework.io/)
- [Tea Pot Operator](https://github.com/schmiddim/teapot-operator) 
- [LinkedIn](https://www.linkedin.com/in/michael-schmitt-ist-cool/) 
