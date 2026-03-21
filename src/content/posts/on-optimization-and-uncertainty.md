---
title: "On Optimization and Uncertainty"
description: "A researcher's reflection on stochastic programming — and why the real world is never as clean as the model."
pubDate: 2026-03-15
tags: ["research", "optimization", "energy"]
featured: true
---

Every model starts with a lie.

Not a malicious one — an honest one. You write down your objective function, your constraints, your decision variables, and you secretly know that none of them perfectly capture the thing you actually care about. The grid topology you assumed is a simplification. The demand forecast is a distribution with fat tails you chose to ignore. The "optimal" solution you hand to the decision-maker will face a reality that didn't read your assumptions.

This is the fundamental tension in applied optimization research: **the model is always wrong, and still worth building**.

## Why Stochastic Programming?

Most classical optimization problems are deterministic — you know the parameters, you find the best solution. But energy systems live in a world of uncertainty: renewable generation fluctuates, demand shifts unexpectedly, equipment fails, prices change.

Stochastic programming is the mathematical framework that takes uncertainty seriously. Instead of assuming a fixed demand, you model it as a set of scenarios. Instead of a single optimal solution, you find a *policy* — a contingent plan that hedges across what the future might bring.

The price you pay is computational. A problem that was tractable in seconds becomes a large-scale MILP that runs for hours. This is why the computational side of operations research matters as much as the mathematical elegance.

## The EV Charging Station Problem

My recent patent work ([WO2025026594](https://patentscope.wipo.int/search/en/detail.jsf?docId=WO2025026594)) dealt with exactly this trade-off. Where should EV charging stations be placed in a city grid, given that future charging demand is uncertain, grid capacity is constrained, and installation costs are significant?

The naive answer: solve the deterministic problem with expected demand. The problem: this systematically underestimates peak loads and places stations in the wrong spots.

The stochastic answer: model demand as a set of scenarios capturing peak/off-peak patterns, weekday/weekend variation, and EV adoption trajectories. Then solve the resulting large-scale MILP — which in our case meant careful problem decomposition and warm-starting from the deterministic solution.

What surprised me most wasn't the mathematical result. It was how much the *framing* of uncertainty affected which solutions were politically feasible. A solution that's "optimal in expectation" is a much harder sell to a city planner than a solution that "performs well in 90% of scenarios." Same math, different communication.

## Models as Arguments

The deeper lesson, after a few years in this field, is that optimization models aren't just computational tools — they're *arguments*. They embody choices about what matters, what's uncertain, what's feasible.

Writing a good model is more like writing a good essay than like running a calculation. The hardest part isn't the solver — it's deciding what goes in the model and what stays out. Every simplification is a bet that the thing you ignored won't matter.

Sometimes you win the bet. Sometimes reality hands you a fat-tailed scenario you told yourself was negligible.

The job, I think, is to be honest about that uncertainty — in the model, and in how you talk about the results.
