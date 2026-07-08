---
title: "从电池调度到场站协同：Intersolar 2026 观察"
description: >-
  我在 Intersolar 2026 看到的 AI 数据中心、BESS 拓扑、混合控制，
  以及把这些问题串起来的 EMS/LEMS 架构。
pubDate: 2026-07-08
locale: "zh"
canonicalSlug: "intersolar-2026-ems-lems-insights"
translationKey: "intersolar-2026-ems-lems-insights"
tags: ["能源", "BESS", "EMS", "会议"]
---

从 Intersolar 2026 回来，我笔记本上最重要的一句话是：

> EMS 的边界正在外移。

这句话听起来有点抽象，但它在很多完全不同的 session 里反复出现。AI 数据中心带来的是更快的负荷波动。BESS 的设计越来越受并网点、母线、变压器和计量边界约束，而不只是受电池容量约束。EV 车队正在把停车场变成可调度负荷组合。住宅储能则在 VPP 规模化之后暴露出一个很现实的问题：云端不可能实时控制每一台设备。

这些现象背后的共同点是：EMS 或 LEMS 不再只是告诉电池什么时候充放电的软件层。它正在变成场站级的协调层，负责把拓扑、并网约束、电池、PV、EV 充电、功率电子、BMS 限制、电价、市场事件和本地兜底逻辑放在同一个控制框架里。

对我自己的本地能源管理工作来说，这个变化是这次会议最重要的收获。

## AI 数据中心把灵活性变成电能质量问题

最强的信号来自 AI 数据中心相关 session。重点不只是数据中心会消耗更多电，而是 AI workload 可以在空闲状态和短时算力峰值之间快速切换。这个变化对电气基础设施的压力，和一个稳定工业负荷很不一样。

这会改变 BESS 和 e-STATCOM 的定位。传统储能叙事里，电池主要是在时间上搬运能量：便宜或富余时充电，昂贵或受限时放电。但在 AI 数据中心场景里，储能也会成为电能质量和韧性的一部分：平滑负荷、支撑电压和无功功率，并帮助场站穿越快速暂态。

控制问题也会变成分层问题。园区级资产响应总负荷行为和电网要求；楼宇级控制处理 ride-through 和 UPS 协同；近机柜或服务器级补偿吸收更快的局部暂态。没有哪一层能完全替代另一层，难点是把这些层协调起来。

因此，AI 数据中心是 EMS/LEMS 架构的一个很好的压力测试。如果一个系统能在高可用要求下协调并网侧资产、场站级储能、功率电子和快速局部缓冲，那么同样的架构也很可能适用于没有这么极端的 C&I 场站。

<figure>
  <img
    src="/images/posts/intersolar-2026/aidc-power-fluctuations.png"
    alt="AI 数据中心在电力区块和 GPU workload 层面的快速负荷波动图。"
  />
  <figcaption>
    AI 数据中心的负荷不只是更大，也在更短时间尺度上变化。
  </figcaption>
</figure>

## 拓扑先于调度

Arcadis 的 session 把第二个问题讲得很具体：对于并网受限的数据中心场站，BESS 控制问题从接入架构就已经开始了。

储能接入数据中心可以有几种方式。BESS 可以拥有独立变电站，这样数据中心和储能资产之间的边界很清楚，但 CAPEX 和工程复杂度更高。BESS 也可以通过现有母线接入共享变电站，这样更靠近负荷，也可能降低成本，但会增加对既有资产的改造。还有一种方案是在中压侧接入，扩展性不错，但可能离负荷更远，也会带来额外复杂性。

如果只从电池 sizing 看，这些像是电气工程细节。但从 EMS 角度看，它们定义的是控制边界。

电池接在哪里，决定 EMS 实际能控制什么、能测量什么、哪些约束是真正 binding 的，以及谁对 grid-service proof 负责。一个在表格里看起来最优的调度曲线，一旦加入母线限制、变压器约束、计量边界和保护逻辑，就可能不可执行。

这次会议里最清楚的一条结论是：拓扑必须成为调度的一等输入。

<figure>
  <img
    src="/images/posts/intersolar-2026/bess-topology-variants.png"
    alt="三种数据中心 BESS 并网拓扑方案对比。"
  />
  <figcaption>
    BESS 接入点改变的是 EMS 边界，而不只是电气图纸。
  </figcaption>
</figure>

<figure>
  <img
    src="/images/posts/intersolar-2026/bess-colocation-site-plan.png"
    alt="AI 数据中心园区里分离式与共址式 BESS 方案的场站布局对比。"
  />
  <figcaption>
    场站布局和并网设计会决定调度策略到底能做什么。
  </figcaption>
</figure>

## 电力架构正在成为控制界面

Greenscale 的 session 把同一个问题从拓扑推进到了电力架构。AI 数据中心正在把供电设计从静态 AC UPS block 推向更分层、更模块化的架构：DC sidecar、TRU 或 SST 变换、DC distribution、近机柜储能、central BESS、共址新能源，以及面向电网的灵活性。

关键变化是：电力架构本身正在成为控制界面。近机柜储能处理微秒到毫秒级暂态；central energy storage 缓冲分钟级行为；中心化 BESS 或并网侧资产处理容量、韧性、电价暴露和电网交互。

这会把 EMS/LEMS 推到电池调度之外。协调层需要知道每个资产能在哪个时间尺度响应，位于哪个电气位置，受哪些功率电子约束，以及场站 workload 如何改变每个响应的价值。

这也是 AI 数据中心对其他行业有参考意义的原因。它是一个极端场景，但同样的架构问题也会出现在带 PV、BESS、EV 充电、备用发电和并网容量限制的商业与工业场站。场站不再是一个负荷加一块电池，而是一个小型电力系统。

<figure>
  <img
    src="/images/posts/intersolar-2026/ai-data-center-power-architecture.png"
    alt="AI 数据中心电力架构从 AC power block 向分层 DC distribution 演进的对比图。"
  />
  <figcaption>
    当电力架构变得分层，EMS/LEMS 就会成为跨层协同的编排层。
  </figcaption>
</figure>

## 没有一个单一的控制算法

TU Munich 关于 modular multi-string BESS 预测控制的 talk，是最贴近我自己研究方向的一场。它把电池运行描述为一个跨时间尺度的决策栈。

在快速层，系统需要稳健的本地控制：秒到分钟级、规则、PID 和安全约束。在调度层，系统需要面向小时到天的预测决策：MPC、线性规划、MILP、forecast、价格和电网限制。在资产寿命层，系统还需要 degradation-aware planning：质保、可用能量、热限制和全生命周期收益。

实际答案不是选出一个“最佳算法”。Rule-based control 快、简单、稳健，但会放掉一部分效率空间。MPC 和数学规划透明、约束表达能力强，但依赖模型质量和预测质量。强化学习可以处理复杂策略，但训练成本、可解释性和 trust barrier 都不低。

真正的 EMS/LEMS 更可能是混合架构：快速本地规则负责即时响应，预测优化负责调度，BMS-informed constraints 负责安全边界，长周期规划负责 lifetime value。

<figure>
  <img
    src="/images/posts/intersolar-2026/bess-control-levels.png"
    alt="TU Munich 展示的 BESS 控制层级，从短期系统控制到长期寿命优化。"
  />
  <figcaption>
    BESS 控制横跨秒级响应、调度周期和资产寿命。
  </figcaption>
</figure>

## EV 灵活性是近期 C&I 场景

EV grid-integration 的 session 技术深度没有那么强，但它提供了很好的市场证据。趋势已经很明显：EV 充电既可以是可控负荷，也可以是灵活储能、电价响应，未来还可能成为 V2G 容量。

对住宅用户来说，这可能表现为 smart charging 或更低的电费。对车队来说，控制问题会更像一个场站问题：车辆有排班，充电桩有功率上限，并网点有约束，电价有时间窗口，运营方关心总拥有成本。

所以 C&I 共址场景会是近期最现实的应用层。把 EV 充电、BESS、PV、建筑负荷和受限并网容量放在同一场站里，EMS/LEMS 问题马上就变得具体。AI 数据中心是极端版本，但车队 depot、物流场站、园区和充电 hub，可能会更早部署同样的逻辑。

## VPP 规模化需要本地自治

Tesla Powerwall 的 session 提醒我：规模本身会改变控制架构。一个只有少量资产的 VPP 可以更多依赖中心化指令。一个拥有几十万甚至上百万设备的 VPP，不可能让云端实时做每台设备的细粒度决策。

更好的模式是分层控制。云端负责市场事件、价格、grid service trigger 和 fleet-level objective。本地 edge 则根据家庭负荷、PV 出力、SOC、备电预留、用户偏好和设备约束做优化。edge 回传 forecast 和 telemetry，云端保留市场协调角色。

这对 C&I 场站同样重要。本地 EMS 应该能在通信变慢、不完整或暂时中断时，继续安全且经济地运行。云端可以协调组合和市场，本地系统必须有足够智能做资产级约束决策。

这不是 Tesla 特有的问题，而是一个架构原则：fleet 越大，distributed optimization 的价值越高。

<figure>
  <img
    src="/images/posts/intersolar-2026/tesla-distributed-vpp-optimization.png"
    alt="Tesla VPP 中中心化云优化与分布式本地优化的对比。"
  />
  <figcaption>
    VPP 更容易规模化的方式，是让云端做市场协调，让约束感知决策靠近资产。
  </figcaption>
</figure>

## 我的 EMS/LEMS 参考架构

如果把这次会议笔记压缩成一个 EMS/LEMS 参考架构，我会得到七类能力：

1. 拓扑感知编排：建模接入点、母线、变压器、计量、保护和并网容量边界。
2. 混合控制栈：把快速本地规则、预测调度和寿命规划结合起来，而不是押注单一算法。
3. 边缘/云协同：云端负责市场和组合协调，本地系统负责快速的约束感知决策。
4. 多资产共址控制：把 BESS、PV、EV 充电、场站负荷、备用发电和并网限制作为一个系统来协调。
5. BMS-informed dispatch：把可用能量、SOH、SOC 不确定性、动态功率限制、安全状态和热降额作为一等约束。
6. 市场与 VPP 接口：把调度连接到电价、grid-service event、bid formation 和 revenue stacking。
7. 开放集成：面向多供应商 BMS、PCS、充电桩、电表和云 API 设计，而不是假设一个封闭系统。

实际建议可以说得很简单，但实现并不容易：EMS/LEMS 应该面向并网受限的共址场站来设计，而不只是面向独立电池。

这意味着从一开始就要考虑 topology-aware dispatch、hybrid control、BMS-informed constraints 和 edge/cloud coordination。电池仍然是核心资产，但它已经不是全部问题。

<figure>
  <img
    src="/images/posts/intersolar-2026/ems-lems-capability-clusters.png"
    alt="EMS/LEMS 能力矩阵，覆盖拓扑、混合控制、边缘云协同、多资产控制、BMS 调度、市场接口和开放集成。"
  />
  <figcaption>
    实用的 EMS/LEMS roadmap 应从拓扑、混合控制、BMS 约束和边缘/云协同开始。
  </figcaption>
</figure>
