# View reference (generated from the prototype)

Every app and tab of the Dynatrace prototype (live at https://reducetothemax.com/new/, source `site/new/index.html`), extracted from its configuration. Each route links to the view in the live prototype. Use it as a checklist of **what each view shows**, not as a fixed design: column sets, facets and queries are starting points. The DQL is the prototype's illustrative query for the default state; your tuned backend queries win.

Legend: **Explorer** is the inventory pattern (overview panel, facets, table, details panel; see [README § 5.1](README.md#51-explorer-inventory-view--required)). **Table** is the simpler list (facets, table, details panel). **Custom** is a page with its own layout (see [README § 5.6](README.md#56-custom-pages--recommended-layout-your-call-details)). **Scope** lists the global controls that apply: segment, timeframe, live mode. **Phone** marks the read-only phone subset.

Stats chips: the first entry is shown as the count next to the view title, the rest as chips.

## Contents

- **Home:** [Overview](#home--overview), [Business](#home--business)
- **Infrastructure:** [Hosts](#infrastructure--hosts), [Network](#infrastructure--network), [Clouds](#infrastructure--clouds), [Kubernetes](#infrastructure--kubernetes), [Cost](#infrastructure--cost), [Templates](#infrastructure--templates)
- **Applications:** [Services](#applications--services), [Errors](#applications--errors), [Profile & Debug](#applications--profile--debug), [SLOs](#applications--slos), [Templates](#applications--templates)
- **Experience:** [Frontends](#experience--frontends), [Synthetic](#experience--synthetic), [User analytics](#experience--user-analytics), [Feature flags](#experience--feature-flags), [Heatmaps](#experience--heatmaps)
- **Smartscape:** [Smartscape on Grail](#smartscape--smartscape-on-grail), [Around an entity](#smartscape--around-an-entity), [Problem graph](#smartscape--problem-graph), [Infrastructure overview](#smartscape--infrastructure-overview), [Service dependency graph](#smartscape--service-dependency-graph), [Kubernetes overview](#smartscape--kubernetes-overview), [AWS overview](#smartscape--aws-overview), [Azure overview](#smartscape--azure-overview), [AI Observability](#smartscape--ai-observability), [Security problem](#smartscape--security-problem), [Network devices](#smartscape--network-devices)
- **Telemetry:** [Logs](#telemetry--logs), [Metrics](#telemetry--metrics), [Traces](#telemetry--traces), [User sessions](#telemetry--user-sessions), [Events](#telemetry--events), [LLM & Agentic](#telemetry--llm--agentic)
- **Problems:** [Problems](#problems--problems), [Investigations](#problems--investigations), [Recommendations](#problems--recommendations)
- **Security:** [Vulnerabilities](#security--vulnerabilities), [SIEM](#security--siem), [User audits](#security--user-audits), [Detections](#security--detections), [Templates](#security--templates)
- **Documents:** [Dashboards](#documents--dashboards), [Notebooks](#documents--notebooks), [Pages](#documents--pages), [Launchpads](#documents--launchpads)
- **Automate:** [Workflows](#automate--workflows), [Executions](#automate--executions), [Guardians](#automate--guardians)
- **Admin:** [Coverage](#admin--coverage), [Fleet](#admin--fleet), [Hub](#admin--hub), [Access requests](#admin--access-requests), [Settings](#admin--settings)
- **QuickStart:** [QuickStart](#quickstart--quickstart)

## Home

### Home / Overview

- **Route:** [`#/home/overview`](https://reducetothemax.com/new/#/home/overview) · **View:** Custom (`renderHome`) · **Scope:** segment · **Phone:** yes
- **Screenshot:** [01-home](screenshots/01-home.png)

```
fetch dt.davis.problems
| filter event.status == "ACTIVE"
| summarize active = count(), by:{event.category}
| sort active desc
```

### Home / Business

- **Route:** [`#/home/business`](https://reducetothemax.com/new/#/home/business) · **View:** Custom (`renderBusiness`) · **Scope:** segment, timeframe

```
fetch bizevents, from:now()-2h
| makeTimeseries events = count(), interval:1h
```

## Infrastructure

### Infrastructure / Hosts

- **Route:** [`#/infrastructure/hosts`](https://reducetothemax.com/new/#/infrastructure/hosts) · **View:** Explorer · **Scope:** segment
- **Stats chips:** Entities, Critical, Warning, CPU, Memory
- **Chart:** Entities over time, stacked Unhealthy entities / Healthy entities; histogram of CPU usage
- **Facets:** Type, Health, Cloud, OS, CPU (range), Memory (range), Host group [Metadata], Region [Metadata], Monitoring mode [Metadata], Team [Metadata]
- **Columns:** Name, Type, Health, CPU, Memory, Cloud, OS
- **Hidden columns (column chooser):** Host group, IP address, Region, Agent version, CPU cores, Memory total, Disk used, Network in, Processes, Monitoring mode, Team, Tags, First seen
- **Related actions (details panel):** Show problems, Open in Smartscape
- **Screenshot:** [05-explorer-hosts](screenshots/05-explorer-hosts.png)

```
smartscapeNodes "HOST"
| fields entity.name, health.status, cloud.provider, os.type, cpu.usage, memory.usage
| limit 100
```

### Infrastructure / Network

- **Route:** [`#/infrastructure/network`](https://reducetothemax.com/new/#/infrastructure/network) · **View:** Explorer · **Scope:** segment
- **Stats chips:** Entities, Critical, Warning, Utilization, Traffic
- **Chart:** Entities over time, stacked Unhealthy entities / Healthy entities; histogram of Utilization
- **Facets:** Type, Health, Vendor, Site, Utilization (range), Traffic (range), Model [Metadata], SNMP version [Metadata], Team [Metadata]
- **Columns:** Name, Type, Health, Vendor, Traffic (Mbit/s), Utilization, Errors/s, Site
- **Hidden columns (column chooser):** IP address, Model, Firmware, Interfaces, Uptime, Latency, Packet loss, SNMP version, Rack position, Team, Tags
- **Related actions (details panel):** Show problems

```
smartscapeNodes "NETWORK_DEVICE", "NETWORK_INTERFACE"
| fields entity.name, entity.type, health.status, device.vendor, traffic.mbps, utilization, errors
| limit 100
```

### Infrastructure / Clouds

- **Route:** [`#/infrastructure/clouds`](https://reducetothemax.com/new/#/infrastructure/clouds) · **View:** Explorer · **Scope:** segment
- **Stats chips:** Resources, Critical, Warning, Unmonitored, Accounts, Regions
- **Chart:** Resources over time, stacked Unhealthy resources / Healthy resources; histogram of CPU usage
- **Facets:** Cloud, Category, Resource type, Health, Monitoring, CPU (range), Account [Metadata], Region [Metadata], State [Metadata], Environment [Metadata], Team [Metadata]
- **Columns:** Name, Resource type, Cloud, Account, Region, Health, Monitoring, CPU
- **Hidden columns (column chooser):** Category, State, Size or class, Memory, Environment, Team, Tags, Created
- **Related actions (details panel):** Show cost, Show problems, Open in Smartscape

```
smartscapeNodes "AWS_*", "AZURE_*", "GCP_*"
| fields entity.name, entity.type, cloud.provider, cloud.account.id, cloud.region, health.status, monitoring.mode
| sort entity.name asc
| limit 100
```

### Infrastructure / Kubernetes

- **Route:** [`#/infrastructure/kubernetes`](https://reducetothemax.com/new/#/infrastructure/kubernetes) · **View:** Explorer · **Scope:** segment
- **Stats chips:** Entities, Critical, Warning, Pods, CPU
- **Chart:** Entities over time, stacked Unhealthy entities / Healthy entities; histogram of CPU usage
- **Facets:** Type, Health, Cluster, CPU (range), Memory (range), Namespace [Metadata], Version [Metadata], Team [Metadata]
- **Columns:** Name, Type, Health, Cluster, CPU, Memory, Pods
- **Hidden columns (column chooser):** Namespace, Node, Version, Restarts, Ready, CPU requests, Memory requests, Created, Labels, Team
- **Related actions (details panel):** Open in Smartscape

```
smartscapeNodes "KUBERNETES_WORKLOAD"
| fields entity.name, k8s.cluster.name, health.status, cpu.usage, memory.usage, pod.count
| limit 100
```

### Infrastructure / Cost

- **Route:** [`#/infrastructure/cost`](https://reducetothemax.com/new/#/infrastructure/cost) · **View:** Explorer · **Scope:** segment · **Tab badge:** New
- **Stats chips:** Entities, Monthly cost, Potential savings, Idle spend, Unallocated
- **Chart:** Spend per hour ($) over time, stacked Idle spend / Used capacity; histogram of Cost per month
- **Facets:** Type, Cloud, Rightsizing, Cost / month (range), Idle (range), Account [Metadata], Region [Metadata], Team [Metadata], Environment [Metadata], Cost center [Metadata]
- **Columns:** Name, Type, Cloud, Cost / month, vs last month, Idle, Rightsizing
- **Hidden columns (column chooser):** Compute, Storage, Data transfer, Idle spend, Potential saving, CPU, Memory, Account, Region, Team, Environment, Cost center, Tags, First seen
- **Related actions (details panel):** Show host, Open in Smartscape, Show recommendations
- **Screenshot:** [26-cost](screenshots/26-cost.png)

```
fetch dt.cost.entities
| fields entity.name, entity.type, cloud.provider, cost.monthly, cost.idle_share, rightsizing.state, cost.potential_saving
| sort cost.monthly desc
| limit 100
```

### Infrastructure / Templates

- **Route:** [`#/infrastructure/templates`](https://reducetothemax.com/new/#/infrastructure/templates) · **View:** Table · **Scope:** —
- **Facets:** Type, Applies to
- **Columns:** Template, Type, Applies to, Includes

```
fetch dt.system.templates
| fields name, template.type, applies_to, content
| sort name asc
```

## Applications

### Applications / Services

- **Route:** [`#/applications/services`](https://reducetothemax.com/new/#/applications/services) · **View:** Explorer · **Scope:** segment · **Phone:** yes
- **Stats chips:** Services, Critical, Warning, Requests/min, Error rate
- **Chart:** Requests / min over time, stacked Failed requests / Successful requests; histogram of Median response time
- **Facets:** Type, Health, Technology, Error rate (range), Median response (range), Requests/min (range), Namespace [Metadata], Cluster [Metadata], Team [Metadata]
- **Columns:** Name, Type, Health, Error rate, Median response, Requests/min, Version
- **Hidden columns (column chooser):** Technology, Instances, Namespace, Cluster, Response p90, Response p99, Errors, Endpoints, Dependencies, Team, First seen
- **Related actions (details panel):** Show traces, Show logs, Show problems, Open in Smartscape, Show feature flags
- **Screenshot:** [06-explorer-details-dql](screenshots/06-explorer-details-dql.png)

```
smartscapeNodes "SERVICE"
| fields entity.name, service.technology, health.status, failure_rate, response_time.p50
| limit 100
```

### Applications / Errors

- **Route:** [`#/applications/errors`](https://reducetothemax.com/new/#/applications/errors) · **View:** Explorer · **Scope:** segment
- **Stats chips:** Distinct errors, Errors, Affected services, Affected users, New or increasing
- **Chart:** Errors over time, stacked Failed requests / —; histogram of Errors per endpoint
- **Facets:** Failure reason, Request type, Service, Errors (range), Rate (range), HTTP status [Metadata], Exception [Metadata], Trend [Metadata], Team [Metadata]
- **Columns:** Endpoint, Service, Failure reason, Request type, Errors, Rate
- **Hidden columns (column chooser):** First seen, Last seen, Affected users, HTTP status, Exception, Failed traces, Trend, Release, Team
- **Related actions (details panel):** Show service, Show traces, Show logs

```
fetch spans, from:now()-2h
| filter request.is_failed == true
| summarize failures = count(), by:{endpoint.name, service.name, request.failure_reason}
| sort failures desc
| limit 50
```

### Applications / Profile & Debug

- **Route:** [`#/applications/profiling`](https://reducetothemax.com/new/#/applications/profiling) · **View:** Custom (`renderProfiling`) · **Scope:** segment, timeframe · **Tab badge:** New
- **Related actions (details panel):** Show traces, Show services
- **Screenshot:** [14-profile-debug](screenshots/14-profile-debug.png)

```
fetch dt.profiling.samples
| summarize samples = count(), self_time = sum(sample.weight), by:{frame.name, frame.package}
| sort self_time desc
| limit 100
```

### Applications / SLOs

- **Route:** [`#/applications/slos`](https://reducetothemax.com/new/#/applications/slos) · **View:** Table · **Scope:** — · **Tab badge:** count, r
- **Facets:** Status, Service
- **Columns:** SLO, Service, Target, Current, Error budget, Burn rate, Status
- **Related actions (details panel):** Show service, Show problems, Show monitors, Open guardians

```
fetch dt.system.slo_status
| fields slo.name, service.name, target, current, error_budget, burn_rate, status
| sort error_budget asc
| limit 100
```

### Applications / Templates

- **Route:** [`#/applications/templates`](https://reducetothemax.com/new/#/applications/templates) · **View:** Table · **Scope:** —
- **Facets:** Type, Applies to
- **Columns:** Template, Type, Applies to, Includes

```
fetch dt.system.templates
| fields name, template.type, applies_to, content
| sort name asc
```

## Experience

### Experience / Frontends

- **Route:** [`#/experience/frontends`](https://reducetothemax.com/new/#/experience/frontends) · **View:** Explorer · **Scope:** segment
- **Stats chips:** Frontends, Without RUM, Apdex, Load time, User actions
- **Chart:** User actions over time, stacked Frustrated actions / Satisfied actions; histogram of Load time
- **Facets:** Kind, Real user monitoring, Apdex (range), Load time (range), Region [Metadata], Host [Metadata], Team [Metadata]
- **Columns:** Frontend, Kind, Real user monitoring, Apdex, Load time, User actions
- **Hidden columns (column chooser):** Sessions, Users, JavaScript errors, Bounce rate, Conversion rate, Version, Host, Region, Team
- **Related actions (details panel):** Show user sessions, Show errors, Show monitors, Show feature flags
- **Screenshot:** [27-dark-theme](screenshots/27-dark-theme.png)

```
smartscapeNodes "APPLICATION"
| fields entity.name, application.type, rum.enabled, apdex, load_time
| limit 100
```

### Experience / Synthetic

- **Route:** [`#/experience/synthetic`](https://reducetothemax.com/new/#/experience/synthetic) · **View:** Explorer · **Scope:** segment · **Tab badge:** count, r
- **Stats chips:** Monitors, Failing, Availability, Duration, Locations
- **Chart:** Runs over time, stacked Failed runs / Successful runs; histogram of Duration
- **Facets:** Type, Status, Frequency, Location, Availability (range), Duration (range), Team [Metadata]
- **Columns:** Monitor, Type, Status, Availability, Duration, Frequency, Location
- **Hidden columns (column chooser):** Steps, Last run, Runs (24 h), Failed runs (24 h), Duration p95, Assertions, Certificate expires in, Team, Tags, Created
- **Related actions (details panel):** Show SLOs, Show problems, Show frontends

```
smartscapeNodes "SYNTHETIC_TEST"
| fields entity.name, monitor.type, monitor.status, availability, duration
| limit 100
```

### Experience / User analytics

- **Route:** [`#/experience/user-analytics`](https://reducetothemax.com/new/#/experience/user-analytics) · **View:** Explorer · **Scope:** segment
- **Modes:** Users, Pages, Journeys
- **Stats chips:** Users, Frustrated, New users, Sessions, Avg session, Converted
- **Chart:** Sessions over time, stacked Frustrated sessions / Satisfied sessions; histogram of Avg session duration
- **Facets:** Experience, Segment, Country, Browser or OS, Frontend, Sessions (range), Errors (range), Converted [Metadata], Referrer [Metadata], City [Metadata]
- **Columns:** User, Country, Browser or OS, Frontend, Segment, Sessions, Experience, Last seen
- **Hidden columns (column chooser):** City, First seen, Page views, User actions, JavaScript errors, Rage clicks, Avg session, Avg LCP, Referrer, Entry page, Converted
- **Related actions (details panel):** Show user sessions, Show frontends, Show heatmaps
- **Screenshot:** [16-user-analytics](screenshots/16-user-analytics.png)

```
fetch user.sessions
| summarize sessions = count(), views = sum(view.count), errors = sum(error.count), by:{user.id, geo.country.name, browser.name}
| sort sessions desc
| limit 100
```

### Experience / Feature flags

- **Route:** [`#/experience/feature-flags`](https://reducetothemax.com/new/#/experience/feature-flags) · **View:** Explorer · **Scope:** —
- **Stats chips:** Flags, Live, In development, Unused, Evaluations (24 h)
- **Chart:** Evaluations / min over time, stacked Evaluation errors / Evaluations; histogram of Evaluations per flag (24 h)
- **Facets:** Status, Type, Staleness, Environments, Creator, Evaluations (24 h) (range), Service [Metadata], Team [Metadata], Approval [Metadata]
- **Columns:** Feature, Type, Status, Environments, Tags, Staleness, Evaluations (24 h), Creator, Last updated
- **Hidden columns (column chooser):** Service, Key, Variants, Production rollout, Evaluation errors, Last evaluated, Team, Approval, Ticket
- **Primary action:** Create feature flag
- **Screenshot:** [18-feature-flags-board](screenshots/18-feature-flags-board.png)

```
fetch events, from:now()-24h
| filter event.type == "feature_flag.config"
| fields flag.name, flag.key, flag.type, flag.status, flag.environments, flag.tags, evaluations
| sort timestamp desc
| limit 100
```

### Experience / Heatmaps

- **Route:** [`#/experience/heatmaps`](https://reducetothemax.com/new/#/experience/heatmaps) · **View:** Custom (`renderHeatmaps`) · **Scope:** segment, timeframe · **Tab badge:** New
- **Related actions (details panel):** Show frontends, Show user sessions
- **Screenshot:** [15-heatmaps](screenshots/15-heatmaps.png)

```
fetch user.events
| filter characteristics.has_click == true
| summarize clicks = count(), rage = countIf(characteristics.has_rage_click == true), dead = countIf(characteristics.has_dead_click == true), by:{ui_element.name, ui_element.selector}
| sort clicks desc
| limit 100
```

## Smartscape

### Smartscape / Smartscape on Grail

- **Route:** [`#/smartscape/grail`](https://reducetothemax.com/new/#/smartscape/grail) · **View:** Custom (`renderSmartscape`) · **Scope:** segment
- **Screenshot:** [12-smartscape-grail](screenshots/12-smartscape-grail.png)

```
smartscapeNodes "*"
| summarize nodes = count(), by:{type}
| sort nodes desc
```

### Smartscape / Around an entity

- **Route:** [`#/smartscape/around`](https://reducetothemax.com/new/#/smartscape/around) · **View:** Custom (`renderSmartscape`) · **Scope:** segment
- **Screenshot:** [11-smartscape-around](screenshots/11-smartscape-around.png)

```
smartscapeNodes "SERVICE"
| filter name == "billing"
| traverse "calls", "SERVICE"
| fields id, name, type
```

### Smartscape / Problem graph

- **Route:** [`#/smartscape/problem`](https://reducetothemax.com/new/#/smartscape/problem) · **View:** Custom (`renderSmartscape`) · **Scope:** segment
- **Screenshot:** [13-problem-graph](screenshots/13-problem-graph.png)

```
fetch dt.davis.problems
| filter display_id == "P-2403"
| fields display_id, event.name, root_cause_entity_id, affected_entity_ids
| expand affected_entity_ids
| lookup [smartscapeNodes "*"], sourceField:affected_entity_ids, lookupField:id, fields:{name, type}
```

### Smartscape / Infrastructure overview

- **Route:** [`#/smartscape/infra`](https://reducetothemax.com/new/#/smartscape/infra) · **View:** Custom (`renderSmartscape`) · **Scope:** segment

```
smartscapeNodes "HOST", "PROCESS_GROUP_INSTANCE", "CONTAINER_GROUP_INSTANCE"
| traverse "runs_on", "PROCESS_GROUP_INSTANCE"
| fields id, name, type
```

### Smartscape / Service dependency graph

- **Route:** [`#/smartscape/service`](https://reducetothemax.com/new/#/smartscape/service) · **View:** Custom (`renderSmartscape`) · **Scope:** segment

```
smartscapeEdges "calls"
| filter source_type == "SERVICE" and target_type == "SERVICE"
| summarize calls = count(), by:{source_id, target_id}
```

### Smartscape / Kubernetes overview

- **Route:** [`#/smartscape/k8s`](https://reducetothemax.com/new/#/smartscape/k8s) · **View:** Custom (`renderSmartscape`) · **Scope:** segment

```
smartscapeNodes "KUBERNETES_CLUSTER", "KUBERNETES_NODE", "KUBERNETES_NAMESPACE", "KUBERNETES_WORKLOAD", "KUBERNETES_POD"
| fields id, name, type
```

### Smartscape / AWS overview

- **Route:** [`#/smartscape/aws`](https://reducetothemax.com/new/#/smartscape/aws) · **View:** Custom (`renderSmartscape`) · **Scope:** segment

```
smartscapeNodes "AWS_*"
| summarize resources = count(), by:{type}
| sort resources desc
```

### Smartscape / Azure overview

- **Route:** [`#/smartscape/azure`](https://reducetothemax.com/new/#/smartscape/azure) · **View:** Custom (`renderSmartscape`) · **Scope:** segment

```
smartscapeNodes "AZURE_*"
| summarize resources = count(), by:{type}
| sort resources desc
```

### Smartscape / AI Observability

- **Route:** [`#/smartscape/ai`](https://reducetothemax.com/new/#/smartscape/ai) · **View:** Custom (`renderSmartscape`) · **Scope:** segment

```
smartscapeNodes "LLM_MODEL", "AGENT", "VECTOR_DATABASE"
| traverse "calls", "SERVICE", direction:backward
| fields id, name, type
```

### Smartscape / Security problem

- **Route:** [`#/smartscape/security`](https://reducetothemax.com/new/#/smartscape/security) · **View:** Custom (`renderSmartscape`) · **Scope:** segment

```
smartscapeNodes "VULNERABILITY"
| traverse "affects", "PROCESS_GROUP_INSTANCE"
| traverse "runs_in", "SERVICE"
| fields id, name, type
```

### Smartscape / Network devices

- **Route:** [`#/smartscape/network`](https://reducetothemax.com/new/#/smartscape/network) · **View:** Custom (`renderSmartscape`) · **Scope:** segment

```
smartscapeNodes "NETWORK_DEVICE", "NETWORK_INTERFACE"
| traverse "has", "NETWORK_INTERFACE"
| fields id, name, type
```

## Telemetry

### Telemetry / Logs

- **Route:** [`#/telemetry/logs`](https://reducetothemax.com/new/#/telemetry/logs) · **View:** Explorer · **Scope:** segment, timeframe, live · **Phone:** yes
- **Stats chips:** Log lines, Error, Warn, Sources, Namespaces
- **Chart:** Log lines over time, stacked Errors / Other log lines
- **Facets:** Level, Source, Namespace, Cluster, Environment [Metadata], Process [Metadata], Deployment [Metadata]
- **Columns:** Time, Level, Source, Namespace, Message
- **Hidden columns (column chooser):** Host, Pod, Container, Process, Logger, Thread, Deployment, Environment, Size
- **Related actions (details panel):** Show service, Show traces
- **Screenshot:** [07-kv-search](screenshots/07-kv-search.png)

```
fetch logs, from:now()-2h
| fields timestamp, loglevel, service.name, k8s.namespace.name, content
| sort timestamp desc
| limit 100
```

### Telemetry / Metrics

- **Route:** [`#/telemetry/metrics`](https://reducetothemax.com/new/#/telemetry/metrics) · **View:** Explorer · **Scope:** —
- **Stats chips:** Metrics, Built in, Custom and extensions, Series, Data points / min
- **Chart:** Data points over time, stacked — / Data points; histogram of Series per metric
- **Facets:** Domain, Type, Unit, Source, Aggregations [Metadata], Retention (days) [Metadata], Team [Metadata]
- **Columns:** Metric, Description, Domain, Type, Unit, Last value, Source
- **Hidden columns (column chooser):** Dimensions, Series, Data points / min, Retention, Aggregations, Team, Last ingest, Created

```
metrics
| fields metric.key, description, domain, metric.type, unit
| sort metric.key asc
| limit 100
```

### Telemetry / Traces

- **Route:** [`#/telemetry/traces`](https://reducetothemax.com/new/#/telemetry/traces) · **View:** Explorer · **Scope:** segment, timeframe
- **Stats chips:** Traces, Failed, Duration, Services, Spans
- **Chart:** Requests over time, stacked Failed requests / Successful requests; histogram of Duration
- **Facets:** Status, Service, Duration (range), Spans (range), HTTP method [Metadata], HTTP status [Metadata], Kubernetes namespace [Metadata], Request type [Metadata]
- **Columns:** Trace ID, Root request, Service, Duration, Spans, Status
- **Hidden columns (column chooser):** Start time, HTTP method, HTTP status, Kubernetes workload, Kubernetes namespace, Host, Failed spans, Request type, User, Client IP
- **Related actions (details panel):** Show service, Show logs
- **Screenshot:** [08-explorer-histogram](screenshots/08-explorer-histogram.png)

```
fetch spans, from:now()-2h
| filter isNull(span.parent_id)
| fields start_time, trace.id, span.name, service.name, duration, request.is_failed
| sort start_time desc
| limit 100
```

### Telemetry / User sessions

- **Route:** [`#/telemetry/user-sessions`](https://reducetothemax.com/new/#/telemetry/user-sessions) · **View:** Explorer · **Scope:** segment, timeframe
- **Stats chips:** Sessions, Frustrated, Tolerating, Duration, Errors
- **Chart:** Sessions over time, stacked Frustrated sessions / Satisfied sessions; histogram of Session duration
- **Facets:** Frontend, Country, Browser or OS, Experience, Duration (range), Errors (range), City [Metadata], Referrer [Metadata], Bounced [Metadata]
- **Columns:** Session, User, Frontend, Country, Browser or OS, Duration, Actions, Errors, Experience, Started
- **Hidden columns (column chooser):** Browser version, Operating system, City, Page views, Rage clicks, JavaScript errors, Entry page, Referrer, App version, Bounced, Client IP
- **Related actions (details panel):** Show frontend

```
fetch user.sessions, from:now()-2h
| fields start_time, dt.rum.session.id, user.id, frontend.name, geo.country.name, browser.name, duration, navigation_count, error.count
| sort start_time desc
| limit 100
```

### Telemetry / Events

- **Route:** [`#/telemetry/business-events`](https://reducetothemax.com/new/#/telemetry/business-events) · **View:** Explorer · **Scope:** segment
- **Stats chips:** Event types, Events, Active, Providers, Categories
- **Chart:** Events over time, stacked — / Events; histogram of Events per type
- **Facets:** Category, Status, Provider, Bucket [Metadata], Source [Metadata], Schema [Metadata], Team [Metadata]
- **Columns:** Event type, Category, Provider, Events, Status
- **Hidden columns (column chooser):** Last seen, Average size, Size p95, Bucket, Source, Schema, Retention, Team, Created

```
fetch bizevents, from:now()-2h
| summarize events = count(), by:{event.type, event.provider}
| sort events desc
```

### Telemetry / LLM & Agentic

- **Route:** [`#/telemetry/ai`](https://reducetothemax.com/new/#/telemetry/ai) · **View:** Table · **Scope:** segment, timeframe
- **Facets:** Application, Model, Quality, Flag
- **Columns:** Conversation, Application, Model, Turns, Latency, Cost, Groundedness, Relevance, Quality, Flag, Started
- **Related actions (details panel):** Open in Smartscape

```
fetch spans, from:now()-2h
| filter isNotNull(gen_ai.request.model)
| summarize turns = count(), tokens = sum(gen_ai.usage.total_tokens), latency = median(duration), by:{gen_ai.conversation.id, service.name, gen_ai.request.model}
| sort turns desc
| limit 100
```

## Problems

### Problems / Problems

- **Route:** [`#/issues/problems`](https://reducetothemax.com/new/#/issues/problems) · **View:** Table · **Scope:** segment, timeframe · **Phone:** yes · **Tab badge:** count, r
- **Facets:** Status, Category, Impact
- **Columns:** ID, Problem, Root cause, Status, Affected entity, Started
- **Related actions (details panel):** Investigate, Problem graph, Show affected entity, Show logs
- **Screenshot:** [02-problems](screenshots/02-problems.png)

```
fetch dt.davis.problems, from:now()-2h
| filter event.status == "ACTIVE"
| fields display_id, event.name, event.status, event.category, affected_entity_ids, event.start
| sort event.start desc
| limit 100
```

### Problems / Investigations

- **Route:** [`#/issues/investigations`](https://reducetothemax.com/new/#/issues/investigations) · **View:** Custom (`renderInvestigations`) · **Scope:** — · **Phone:** yes
- **Facets:** Status, Root cause, Trigger, Sharing
- **Columns:** Investigation, Status, Root cause, Trigger, Sharing, Created
- **Primary action:** New investigation
- **Screenshot:** [04-investigation](screenshots/04-investigation.png)

```
fetch dt.system.investigations
| fields id, title, status, root_cause.verdict, trigger, created_at
| sort created_at desc
| limit 50
```

### Problems / Recommendations

- **Route:** [`#/issues/recommendations`](https://reducetothemax.com/new/#/issues/recommendations) · **View:** Table · **Scope:** — · **Tab badge:** count, p
- **Facets:** Source, Priority, Category
- **Columns:** Recommendation, Source, Priority, Category

```
fetch dt.system.recommendations
| sort priority asc
| limit 50
```

## Security

### Security / Vulnerabilities

- **Route:** [`#/security/vulnerabilities`](https://reducetothemax.com/new/#/security/vulnerabilities) · **View:** Explorer · **Scope:** — · **Tab badge:** count, r
- **Modes:** Prioritization, Findings
- **Stats chips:** Vulnerabilities, Critical, High, Open, Avg score
- **Chart:** Vulnerabilities over time, stacked Critical and high / Medium and low; histogram of Security score
- **Facets:** Severity, Status, Type, Security score (range), Affected entities (range), Exploit [Metadata], Library [Metadata], Runtime [Metadata], Team [Metadata], Ticket [Metadata]
- **Columns:** ID, Vulnerability, Security score, Severity, Type, Affected entities, Status
- **Hidden columns (column chooser):** Published, First seen, Exploit, Library, Library version, Runtime, Affected process groups, Exploit probability, Davis security score, Fix, Team, Ticket
- **Related actions (details panel):** Show affected services, Open SIEM
- **Screenshot:** [28-vulnerabilities](screenshots/28-vulnerabilities.png)

```
fetch security.events, from:now()-2h
| filter event.type == "VULNERABILITY_STATE_REPORT_EVENT"
| dedup vulnerability.id
| sort vulnerability.davis_assessment.score desc
| fields vulnerability.id, vulnerability.title, vulnerability.davis_assessment.score, vulnerability.davis_assessment.level, vulnerability.resolution.status
| limit 100
```

### Security / SIEM

- **Route:** [`#/security/siem`](https://reducetothemax.com/new/#/security/siem) · **View:** Custom (`renderSecurity`) · **Scope:** — · **Tab badge:** New
- **Screenshot:** [17-siem](screenshots/17-siem.png)

```
fetch dt.system.detection_rules
| summarize rules = count(), active = countIf(enabled == true), by:{mitre.tactic, mitre.technique.id}
| sort mitre.tactic asc
```

### Security / User audits

- **Route:** [`#/security/user-audits`](https://reducetothemax.com/new/#/security/user-audits) · **View:** Table · **Scope:** timeframe
- **Facets:** Action, Result, Risk, Method, User
- **Columns:** Time, User, Event, Action, Result, Risk, Method, Source IP, Location
- **Related actions (details panel):** Show user sessions, Open detections

```
fetch dt.system.audit_events, from:now()-2h
| fields timestamp, user.email, event.action, event.summary, event.result, risk.level, client.ip, geo.country
| sort timestamp desc
| limit 100
```

### Security / Detections

- **Route:** [`#/security/detectors`](https://reducetothemax.com/new/#/security/detectors) · **View:** Custom (`renderDetectors`) · **Scope:** —

```
fetch dt.system.detections
| fields id, title, enabled, schedule.interval, analysis.window, run_as
| sort title asc
```

### Security / Templates

- **Route:** [`#/security/templates`](https://reducetothemax.com/new/#/security/templates) · **View:** Table · **Scope:** —
- **Facets:** Type, Applies to
- **Columns:** Template, Type, Applies to, Includes

```
fetch dt.system.templates
| filter domain == "security"
| fields name, template.type, applies_to, content
| sort name asc
```

## Documents

### Documents / Dashboards

- **Route:** [`#/documents/dashboards`](https://reducetothemax.com/new/#/documents/dashboards) · **View:** Table · **Scope:** —
- **Columns:** Name, Owner, Category, Modified
- **Scope chips:** All, Mine, Shared with me, Ready-made, Favorites, Trash
- **Primary action:** Create dashboard
- **Screenshot:** [19-documents](screenshots/19-documents.png)

```
fetch dt.system.documents
| filter type == "dashboard"
| filter isDeleted == false
| fields id, name, owner, modificationInfo.lastModifiedTime
| sort modificationInfo.lastModifiedTime desc
| limit 100
```

### Documents / Notebooks

- **Route:** [`#/documents/notebooks`](https://reducetothemax.com/new/#/documents/notebooks) · **View:** Table · **Scope:** —
- **Columns:** Name, Owner, Category, Modified
- **Scope chips:** All, Mine, Shared with me, Ready-made, Favorites, Trash
- **Primary action:** Create notebook

```
fetch dt.system.documents
| filter type == "notebook"
| filter isDeleted == false
| fields id, name, owner, modificationInfo.lastModifiedTime
| sort modificationInfo.lastModifiedTime desc
| limit 100
```

### Documents / Pages

- **Route:** [`#/documents/pages`](https://reducetothemax.com/new/#/documents/pages) · **View:** Table · **Scope:** —
- **Columns:** Name, Owner, Category, Modified
- **Scope chips:** All, Mine, Shared with me, Ready-made, Favorites, Trash
- **Primary action:** Create page

```
fetch dt.system.documents
| filter type == "page"
| filter isDeleted == false
| fields id, name, owner, modificationInfo.lastModifiedTime
| sort modificationInfo.lastModifiedTime desc
| limit 100
```

### Documents / Launchpads

- **Route:** [`#/documents/launchpads`](https://reducetothemax.com/new/#/documents/launchpads) · **View:** Table · **Scope:** —
- **Columns:** Name, Owner, Category, Modified
- **Scope chips:** All, Mine, Shared with me, Ready-made, Favorites, Trash
- **Primary action:** Create launchpad

```
fetch dt.system.documents
| filter type == "launchpad"
| filter isDeleted == false
| fields id, name, owner, modificationInfo.lastModifiedTime
| sort modificationInfo.lastModifiedTime desc
| limit 100
```

## Automate

### Automate / Workflows

- **Route:** [`#/automate/workflows`](https://reducetothemax.com/new/#/automate/workflows) · **View:** Table · **Scope:** — · **Tab badge:** count, r
- **Facets:** Trigger, Status, Owner
- **Columns:** Workflow, Trigger, Status, Owner, Last run, Success rate
- **Scope chips:** All, Mine, Trash
- **Primary action:** Create workflow
- **Related actions (details panel):** Show executions

```
fetch dt.system.workflows
| filter isDeleted == false
| fields id, title, trigger.type, state, owner, lastExecution.time
| sort lastExecution.time desc
| limit 100
```

### Automate / Executions

- **Route:** [`#/automate/executions`](https://reducetothemax.com/new/#/automate/executions) · **View:** Table · **Scope:** timeframe
- **Facets:** State, Trigger
- **Columns:** Run, Workflow, Trigger, State, Started, Duration
- **Related actions (details panel):** Show workflow

```
fetch dt.system.workflow_executions, from:now()-2h
| fields execution.id, workflow.title, trigger.type, state, started_at, duration
| sort started_at desc
| limit 100
```

### Automate / Guardians

- **Route:** [`#/automate/guardians`](https://reducetothemax.com/new/#/automate/guardians) · **View:** Table · **Scope:** — · **Tab badge:** count, r
- **Facets:** Status, Tag
- **Columns:** Guardian, Status, Objectives, Application, Tag, Last validation
- **Related actions (details panel):** Show SLOs

```
fetch bizevents
| filter event.type == "guardian.validation.finished"
| summarize last_run = max(timestamp), by:{guardian.name, validation.status}
| sort last_run desc
```

## Admin

### Admin / Coverage

- **Route:** [`#/admin/coverage`](https://reducetothemax.com/new/#/admin/coverage) · **View:** Table · **Scope:** —
- **Facets:** Area, Status
- **Columns:** Name, Area, Status, Reason
- **Related actions (details panel):** Show fleet

```
smartscapeNodes "HOST", "NETWORK_DEVICE", "SERVICE"
| filter coverage.status == "GAP"
| fieldsAdd coverage.status = if(isNull(agent.version), "GAP", else:"MONITORED")
| fields entity.name, entity.type, coverage.status
| limit 100
```

### Admin / Fleet

- **Route:** [`#/admin/fleet`](https://reducetothemax.com/new/#/admin/fleet) · **View:** Table · **Scope:** —
- **Facets:** Type, Health
- **Columns:** Name, Type, Version, Health, Assigned
- **Related actions (details panel):** Show coverage

```
smartscapeNodes "ONEAGENT", "ACTIVEGATE", "SYNTHETIC_ENGINE"
| fields entity.name, entity.type, agent.version, health.status
| limit 100
```

### Admin / Hub

- **Route:** [`#/admin/apps`](https://reducetothemax.com/new/#/admin/apps) · **View:** Table · **Scope:** —
- **Modes:** Installed, Discover
- **Facets:** Status
- **Columns:** App, Type, Version, Last update, Status

```
fetch dt.system.apps
| filter installed == true
| fields id, name, version, installed_at
| sort name asc
```

### Admin / Access requests

- **Route:** [`#/admin/access`](https://reducetothemax.com/new/#/admin/access) · **View:** Table · **Scope:** — · **Tab badge:** count, p
- **Facets:** Status, Access, Scope
- **Columns:** Request, Requester, Access, Scope, Requested, Status

```
fetch dt.system.access_requests
| filter status == "PENDING"
| fields id, requester, requested_role, scope, status, created_at
| sort created_at desc
| limit 100
```

### Admin / Settings

- **Route:** [`#/admin/settings`](https://reducetothemax.com/new/#/admin/settings) · **View:** Table · **Scope:** —
- **Facets:** Section, Scope
- **Columns:** Setting, Section, Scope, Description

```
fetch dt.system.settings_schemas
| fields schemaId, displayName, category, scope
| sort category asc
| limit 100
```

## QuickStart

### QuickStart / QuickStart

- **Route:** [`#/quickstart/landing`](https://reducetothemax.com/new/#/quickstart/landing) · **View:** Custom (`renderQuickStart`) · **Scope:** segment, timeframe
- **Screenshot:** [20-quickstart](screenshots/20-quickstart.png)

```
timeseries { throughput = sum(dt.service.request.count, rate:1m), response_time = avg(dt.service.request.response_time), failure_rate = avg(dt.service.request.failure_rate) }, by:{dt.entity.service}, from:now()-2h
```

