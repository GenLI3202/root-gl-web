---
title: "BESS Field Notes: A Living Wiki"
description: "A continuously-updated working glossary of battery energy storage concepts I run into on the job — maintained by a daily agent that distills my questions into entries."
pubDate: 2026-06-15
updatedDate: 2026-06-15
tags: ["bess", "energy-storage", "wiki", "reference"]
featured: true
---

<!--
  ┌─────────────────────────────────────────────────────────────────────┐
  │  AGENT MAINTENANCE CONTRACT — read before editing                    │
  │                                                                       │
  │  This file is auto-maintained by a daily summarisation workflow.     │
  │  When adding or revising an entry:                                    │
  │   1. Each term is a `### Term (Acronym)` heading under its category.  │
  │   2. Keep definitions 1–4 sentences. Plain language first, then the  │
  │      precise/technical nuance. Add units where relevant.             │
  │   3. Put new terms in the right `## Category` section, alphabetical. │
  │   4. If a category doesn't exist yet, add it (keep the TOC in sync). │
  │   5. Bump `updatedDate` in the frontmatter to the run date.          │
  │   6. Append a one-line entry to the Changelog at the bottom.         │
  │   7. Never delete a human-edited entry; refine in place instead.     │
  └─────────────────────────────────────────────────────────────────────┘
-->

This is a **living reference** — a glossary of battery energy storage (BESS) concepts I keep bumping into at work. Rather than maintaining it by hand, I ask questions in an ongoing chat session whenever a term trips me up, and a daily agent distills those exchanges into the entries below. So it grows in the direction of whatever I happened to be confused about that week. Corrections welcome; treat any single entry as "good enough to be useful," not gospel.

*Last refreshed: 15 Jun 2026.*

## Contents

- [Fundamentals & Units](#fundamentals--units)
- [Cells, Chemistry & Hardware](#cells-chemistry--hardware)
- [System & Power Electronics](#system--power-electronics)
- [Grid Services & Applications](#grid-services--applications)
- [Markets & Economics](#markets--economics)
- [Safety & Standards](#safety--standards)

---

## Fundamentals & Units

### Power vs. Energy (MW vs. MWh)
The two numbers that define a battery. **Power (MW)** is how fast it can charge or discharge — the size of the "tap." **Energy (MWh)** is how much it can store in total — the size of the "tank." A 50 MW / 200 MWh system can deliver 50 MW for 4 hours. Conflating the two is the most common beginner mistake in storage.

### Duration (Energy-to-Power Ratio)
Energy divided by power, in hours. A 100 MWh / 25 MW battery is a "4-hour" system. Duration is the single most useful shorthand for what a battery is *for*: ~1 hr systems chase fast frequency services, 2–4 hr systems do daily arbitrage and capacity, 8+ hr systems target longer shifts.

### C-rate
The charge/discharge rate expressed relative to capacity. 1C fully discharges the rated energy in one hour; 0.5C takes two hours; 2C takes 30 minutes. A 4-hour battery operates at 0.25C. Higher C-rates stress cells more and accelerate degradation.

### Round-Trip Efficiency (RTE)
Energy out divided by energy in, over a full charge–discharge cycle. Modern Li-ion BESS land around 85–92% AC-to-AC, with losses split between the cells, the PCS, and auxiliary loads (HVAC especially). RTE directly eats into arbitrage margins.

### State of Charge (SoC)
How full the battery is right now, as a percentage of usable capacity. The BMS rarely lets SoC swing the full 0–100%; a protective buffer at each end protects cell life.

### Depth of Discharge (DoD)
How much of the capacity a cycle actually uses. An 80% DoD cycle goes from 90% to 10% SoC. Shallower cycling generally extends cycle life — a key lever in degradation modelling.

### State of Health (SoH)
Present usable capacity (or power) as a fraction of the original rating. A battery at 80% SoH has lost a fifth of its capacity. SoH is the headline number for warranty and augmentation planning.

### Degradation
The slow loss of capacity and power over time. Split into **cycle ageing** (driven by throughput, DoD, C-rate, temperature) and **calendar ageing** (driven by time, SoC, and temperature, even when idle). Most warranties guarantee an SoH floor (e.g. 70%) at a given year/cycle count.

### Throughput
Total energy moved through the battery over its life, often in MWh or "equivalent full cycles." Many tolling and warranty contracts are denominated in throughput because it tracks wear better than calendar time alone.

---

## Cells, Chemistry & Hardware

### Li-ion
The dominant BESS chemistry family. Within it, the two relevant sub-types for stationary storage are LFP and NMC (below). "Li-ion" alone is too vague to be useful in a spec sheet.

### LFP (Lithium Iron Phosphate)
The current default for stationary storage. Lower energy density than NMC but cheaper, more thermally stable (higher thermal-runaway onset), longer cycle life, and cobalt-free. The footprint penalty matters far less for a stationary container than for a car.

### NMC (Nickel Manganese Cobalt)
Higher energy density, so historically favoured where space/weight is tight (EVs). In stationary storage it has largely ceded ground to LFP on cost and safety, though it still appears in older or space-constrained projects.

### Cell → Module → Rack → Container
The packaging hierarchy. **Cells** are wired into **modules**, modules stack into **racks** (often with rack-level BMS and DC bus), and racks fill a **container** (typically ~20 ft, a few MWh). Understanding the level a spec refers to avoids order-of-magnitude errors.

### BMS (Battery Management System)
The electronics that keep cells safe and balanced: monitoring voltage/current/temperature per cell or module, enforcing SoC limits, balancing cells, and tripping protection on faults. The BMS is the source of truth for SoC and SoH estimates.

### Thermal Management (HVAC / Liquid Cooling)
Keeping cells in their happy temperature band (~15–35 °C). Older designs use air conditioning; modern high-density containers increasingly use liquid cooling for tighter, more uniform control. Thermal management is a major chunk of the auxiliary load that drags down RTE.

### Thermal Runaway
The failure mode everyone designs against: a cell overheats, drives an exothermic reaction, heats its neighbours, and the fault propagates. Containment (cell spacing, barriers, venting, deflagration panels) aims to stop one bad cell from taking out a container. LFP's higher onset temperature is a big part of its safety case.

---

## System & Power Electronics

### PCS (Power Conversion System)
The bidirectional inverter between the battery's DC and the grid's AC. It sets how fast and in what mode the battery charges/discharges, and is where a large share of conversion losses (and the grid-forming/following behaviour) live.

### AC-Coupled vs. DC-Coupled
How storage ties into co-located generation (usually solar). **AC-coupled**: battery and PV have separate inverters and meet on the AC bus — simpler, more modular. **DC-coupled**: they share a DC bus and inverter — higher efficiency and lets the battery capture otherwise-clipped solar, at the cost of tighter design coupling.

### EMS (Energy Management System)
The decision-making brain above the PCS and BMS. It decides *when* to charge/discharge to chase market signals, service obligations, and constraints — turning price forecasts and dispatch instructions into setpoints. The optimisation problems it solves are where storage economics are won or lost.

### Augmentation
Adding cells/racks (or replacing degraded ones) over a project's life to hold rated energy as the battery degrades. Projects are often over-built on day one or have augmentation scheduled at set years to meet a guaranteed capacity profile.

### Auxiliary / Parasitic Load
The power the site consumes for itself — HVAC, controls, lighting — rather than delivering to the grid. It directly reduces net efficiency and is a non-trivial line in any energy balance, especially in hot climates.

### Grid-Forming vs. Grid-Following
**Grid-following** inverters sync to an existing grid voltage/frequency (the historical default). **Grid-forming** inverters can establish voltage and frequency themselves, providing synthetic inertia and enabling black start and operation in weak or islanded grids. Increasingly required as inverter-based resources displace synchronous generators.

---

## Grid Services & Applications

### Energy Arbitrage
The bread-and-butter use case: charge when power is cheap, discharge when it's expensive. Margin is the price spread times throughput, minus RTE losses and degradation cost. Spreads are driven by the daily renewables/demand shape (the "duck curve").

### Peak Shaving
Discharging during demand peaks to cut a customer's (or system's) peak draw — valuable where networks charge heavily for peak demand (demand charges) or where it defers grid upgrades.

### Frequency Regulation (FCR / aFRR / FFR)
Fast services that keep grid frequency at its nominal value (50/60 Hz) by injecting or absorbing power in seconds. Naming is region-specific — **FCR** (primary/containment) and **aFRR** (secondary/restoration) in Europe, **FFR** (fast frequency response) elsewhere. Batteries excel here because of millisecond response.

### Capacity Market
Payments for *being available* to deliver power when the system needs it, separate from energy actually sold. A core revenue stream for storage; the duration a system must sustain to qualify (the "de-rating" of short-duration assets) is a key design driver.

### Ancillary Services
The umbrella term for grid-stability services bought by the system operator — frequency response, reserves, voltage support, black start. Batteries are well suited to the fast, short-duration end of this menu.

### Black Start
Restarting the grid from a total blackout without relying on external power. Traditionally done by specific generators; grid-forming BESS is an emerging provider.

### Inertia / Synthetic Inertia
Real inertia is the stored rotational energy in spinning generators that resists sudden frequency change. As they retire, **synthetic inertia** from grid-forming inverters emulates that response electronically — a fast-growing requirement on low-carbon grids.

### Revenue Stacking
Earning from several of the above at once (e.g. capacity payments + arbitrage + frequency response), subject to the physical constraint that you can't promise the same MW/MWh to two services at the same instant. Optimising the stack is the EMS's hardest job.

---

## Markets & Economics

### LCOS (Levelized Cost of Storage)
The storage analogue of LCOE: lifetime cost (capex + opex + charging energy + degradation) divided by lifetime energy discharged, giving a $/MWh figure. Useful for comparing technologies, but sensitive to assumed cycles, RTE, and lifetime — read the assumptions before trusting the number.

### Merchant vs. Contracted
**Merchant** assets earn from live market prices — higher upside, higher risk. **Contracted** assets (e.g. a tolling deal) trade that upside for revenue certainty, which is usually what gets a project financed.

### Tolling Agreement
A contract where an offtaker pays a fixed fee for the *right to dispatch* the battery (its capacity and throughput), taking on the market risk and optimisation. The owner gets predictable, financeable cash flow.

### Capex / Opex Split
Storage economics are capex-heavy (cells, PCS, BoP, EPC) with comparatively light opex (O&M, augmentation, warranty, charging energy). Falling cell prices are the dominant trend pushing project economics over time.

---

## Safety & Standards

### UL 9540 / UL 9540A
**UL 9540** is the North American safety standard for energy storage systems as a whole. **UL 9540A** is the *test method* for thermal-runaway fire propagation — its results feed the spacing, siting, and fire-protection requirements that authorities and insurers demand.

### NFPA 855
The US installation standard for stationary storage — governing siting, separation distances, ventilation, fire detection/suppression, and explosion control. Often the binding constraint on how a site is laid out.

### IEC 62619
The international safety standard for secondary lithium cells/batteries in industrial (including stationary) applications — the rough international counterpart to the UL-led North American framework.

---

## Changelog

<!-- Newest first. Format: `- YYYY-MM-DD — what changed (source: chat session)` -->

- 2026-06-15 — Initial seed of the wiki: ~35 entries across 6 categories (Fundamentals, Hardware, Power Electronics, Grid Services, Markets, Safety).
