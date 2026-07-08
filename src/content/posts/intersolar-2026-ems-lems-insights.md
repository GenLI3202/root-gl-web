---
title: "From Battery Dispatch to Site Orchestration: Intersolar 2026 Notes"
description: >-
  Notes from Intersolar 2026 on AI data centers, BESS topology, hybrid control,
  and the EMS/LEMS architecture that ties them together.
pubDate: 2026-07-08
locale: "en"
canonicalSlug: "intersolar-2026-ems-lems-insights"
translationKey: "intersolar-2026-ems-lems-insights"
tags: ["energy", "BESS", "EMS", "conference"]
---

I came out of Intersolar 2026 with one sentence written in my notebook:

> The EMS boundary is moving.

That sounds abstract, but the pattern showed up again and again across very different
sessions. AI data centers are creating faster load swings. Battery systems are being
designed around grid-connection constraints, not only energy capacity. EV fleets are
turning parking lots into controllable load portfolios. Residential batteries are scaling
into virtual power plants where the cloud cannot micromanage every device.

The common thread is this: an EMS or LEMS is no longer just the software layer that tells
a battery when to charge and discharge. It is becoming the coordination layer for a site:
topology, grid constraints, batteries, PV, EV charging, power electronics, BMS limits,
tariffs, market events, and local fallback logic.

For my own work on local energy management, that shift is the most important takeaway.

## AI data centers make flexibility a power-quality problem

The strongest opening signal came from the AI data-center sessions. The important point
was not simply that data centers will consume more energy. It was that AI workloads can
move between idle states and short compute peaks extremely quickly, and that fast movement
stresses electrical infrastructure in a different way from a steady industrial load.

That changes how BESS and e-STATCOM assets should be framed. In a classical storage
story, a battery shifts energy across time: charge when power is cheap or abundant, then
discharge when power is expensive or constrained. In the AI data-center story, storage
also becomes part of power quality and resilience. It smooths load, supports voltage and
reactive power, and helps the site ride through transients.

The control problem also becomes layered. A campus-level asset can respond to aggregate
load behavior and grid requirements. A building-level layer can handle ride-through and
UPS coordination. Near-rack or server-level compensation can absorb very fast transients
locally. None of these layers replaces the others. The hard part is coordinating them.

That is why AI data centers are a useful stress test for EMS/LEMS design. If the system
can coordinate grid-facing assets, site-level storage, power electronics, and fast local
buffers under strict uptime requirements, the same architecture is likely to be useful in
less extreme commercial and industrial sites too.

<figure>
  <img
    src="/images/posts/intersolar-2026/aidc-power-fluctuations.png"
    alt="Two presentation charts showing AI data-center power fluctuations at block and GPU workload level."
  />
  <figcaption>
    AI data-center loads are not only larger; they also move on shorter time scales.
  </figcaption>
</figure>

## Topology comes before dispatch

The Arcadis session made a second point very concrete: for grid-constrained data-center
sites, the BESS control problem starts with the connection architecture.

There are several ways to integrate storage into a data-center grid connection. A BESS
can have its own substation, which keeps the data-center and storage assets clearly
separated but increases cost and engineering effort. It can share the data-center
substation through an existing busbar, which improves load proximity and can reduce cost
but creates more intervention in existing assets. It can also connect at medium-voltage
level, which can scale well but may sit further away from the load and introduce more
complexity.

From a pure battery-sizing perspective, these may look like engineering details. From an
EMS perspective, they define the control boundary.

Where the battery connects determines what the EMS can actually control, what it can
measure, which constraints are binding, and who is accountable for grid-service proof. A
dispatch schedule that looks optimal in a spreadsheet may not be feasible once busbar
limits, transformer constraints, metering boundaries, and protection logic are included.

This is one of the cleanest lessons from the conference: topology has to become a first
class input to dispatch.

<figure>
  <img
    src="/images/posts/intersolar-2026/bess-topology-variants.png"
    alt="Comparison of three BESS integration variants for data-center grid connection architecture."
  />
  <figcaption>
    The BESS connection point changes the EMS boundary, not just the electrical drawing.
  </figcaption>
</figure>

<figure>
  <img
    src="/images/posts/intersolar-2026/bess-colocation-site-plan.png"
    alt="Site plan comparing separated and colocated BESS integration for an AI data-center campus."
  />
  <figcaption>
    Site layout and grid connection design shape what dispatch can actually do.
  </figcaption>
</figure>

## Power architecture is becoming a control surface

The Greenscale session extended the same idea from topology into architecture. AI data
centers are pushing power design away from static AC UPS blocks toward more layered and
modular architectures: DC sidecars, TRU or SST-based conversion, DC distribution,
near-rack storage, central BESS, colocated renewables, and grid-facing flexibility.

The important shift is that architecture becomes part of the control surface. Near-rack
storage may handle microsecond-to-millisecond transients. Central energy storage may
buffer minutes-level behavior. Central BESS or grid-side assets may manage capacity,
resilience, tariff exposure, and grid interaction.

That pushes EMS/LEMS beyond battery dispatch. The coordination layer needs to understand
which asset can respond on which time scale, where it sits electrically, what constraints
come from power electronics, and how the site's workload changes the value of each
response.

This is also where AI data centers become relevant beyond their own sector. They are an
extreme case, but the same architectural question appears in commercial sites with PV,
BESS, EV charging, backup generation, and grid import limits. The site is no longer one
load plus one battery. It is a small power system.

<figure>
  <img
    src="/images/posts/intersolar-2026/ai-data-center-power-architecture.png"
    alt="Architecture comparison showing AI data-center power topology evolving from AC power blocks toward layered DC distribution."
  />
  <figcaption>
    As power architecture becomes layered, EMS/LEMS becomes the orchestration layer
    across those layers.
  </figcaption>
</figure>

## There is no single control algorithm

The TU Munich talk on predictive control of modular multi-string BESS was the most
directly relevant control session for me. It framed battery operation as a stack of
decisions across time.

At the fast layer, the system needs robust local control: seconds to minutes, rules, PID,
and safety constraints. At the dispatch layer, it needs predictive decisions across hours
or days: MPC, linear programming, MILP, forecasts, prices, and grid limits. At the asset
life layer, it needs degradation-aware planning: warranty, usable energy, thermal limits,
and lifetime profitability.

The practical answer is not to crown one algorithm as the winner. Rule-based control is
fast, simple, and robust, but it leaves efficiency potential unused. MPC and mathematical
programming are transparent and constraint-aware, but they depend on model quality and
forecast quality. Reinforcement learning can handle complex policies, but it introduces
training effort and trust barriers.

For a real EMS/LEMS, the likely architecture is hybrid: fast local rules for immediate
response, predictive optimization for dispatch, BMS-informed constraints for safe
operation, and long-horizon planning for lifetime value.

<figure>
  <img
    src="/images/posts/intersolar-2026/bess-control-levels.png"
    alt="TU Munich slide showing BESS control levels from short-term system control to long-term lifetime optimization."
  />
  <figcaption>
    BESS control spans seconds, dispatch horizons, and asset lifetime.
  </figcaption>
</figure>

## EV flexibility is the near-term C&I version

The EV grid-integration sessions were less deep technically, but useful as market
evidence. The pattern is already visible: EV charging can be controllable load, flexible
storage, tariff response, and eventually V2G capacity.

For a residential EV user, that may show up as smart charging or a reduced energy bill.
For a fleet, the control problem becomes more site-like: vehicles have schedules,
chargers have power limits, the grid connection has constraints, tariffs create time
windows, and the operator cares about total cost of ownership.

That is why commercial and industrial co-location feels like the near-term application
layer. Put EV charging, BESS, PV, building load, and a constrained grid connection on the
same site, and the EMS/LEMS problem becomes practical immediately. AI data centers are the
extreme version, but fleet depots, logistics sites, campuses, and charging hubs are where
the same logic can be deployed sooner.

## VPP scale requires local autonomy

The Tesla Powerwall session was a useful reminder that scale changes the control
architecture. A virtual power plant with a small number of assets can rely on more
centralized command logic. A VPP with hundreds of thousands or millions of devices cannot
depend on the cloud making every device-level decision in real time.

The better pattern is split control. The cloud coordinates market events, prices, grid
service triggers, and fleet-level objectives. The local edge optimizes against household
load, PV production, state of charge, backup reserve, user preferences, and device
constraints. The edge returns forecasts and telemetry, while the cloud remains the market
coordination layer.

This matters for C&I sites too. A local EMS should be able to operate safely and
economically when communication is slow, incomplete, or temporarily unavailable. The cloud
can coordinate portfolios and markets, but local systems need enough intelligence to make
asset-level decisions under constraints.

That is a design principle, not just a Tesla-specific point: the larger the fleet, the
more valuable distributed optimization becomes.

<figure>
  <img
    src="/images/posts/intersolar-2026/tesla-distributed-vpp-optimization.png"
    alt="Tesla VPP comparison showing centralized cloud optimization versus distributed local optimization."
  />
  <figcaption>
    VPP control scales better when market coordination stays in the cloud and
    constraint-aware decisions move closer to the asset.
  </figcaption>
</figure>

## My working reference architecture

If I reduce the conference notes into an EMS/LEMS reference architecture, I get seven
capabilities:

1. Topology-aware orchestration: model the connection point, busbar, transformer,
   metering, protection, and grid-import boundary.
2. Hybrid control stack: combine fast local rules, predictive dispatch, and lifetime
   planning instead of relying on a single algorithm.
3. Edge/cloud coordination: keep market and portfolio coordination in the cloud, but let
   local systems make fast constraint-aware decisions.
4. Multi-asset co-location control: coordinate BESS, PV, EV charging, site load, backup
   generation, and grid limits as one system.
5. BMS-informed dispatch: expose usable energy, SOH, SOC uncertainty, dynamic power
   limits, safety state, and thermal derating as first-class constraints.
6. Market and VPP interface: connect dispatch to tariffs, grid-service events, bid
   formation, and revenue stacking.
7. Open integration: design around multi-vendor BMS, PCS, chargers, meters, and cloud
   APIs instead of assuming one closed stack.

The practical recommendation is simple to say and hard to implement: build EMS/LEMS for
grid-constrained co-located sites, not just for standalone batteries.

That means topology-aware dispatch, hybrid control, BMS-informed constraints, and
edge/cloud coordination from the beginning. The battery is still central, but it is no
longer the whole story.

<figure>
  <img
    src="/images/posts/intersolar-2026/ems-lems-capability-clusters.png"
    alt="Capability matrix for EMS and LEMS architecture across topology, hybrid control, edge cloud coordination, multi-asset control, BMS dispatch, market interface, and open integration."
  />
  <figcaption>
    A practical EMS/LEMS roadmap starts with topology, hybrid control, BMS constraints,
    and edge/cloud coordination.
  </figcaption>
</figure>
