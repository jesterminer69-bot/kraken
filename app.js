async function loadStatus() {
  try {
    const statusUrl = "GITHUB_STATUS_PAYLOAD.json?t=" + new Date().getTime();

    const res = await fetch(statusUrl);
    const data = await res.json();

    // Task
    const task = data.current_task || [];
    document.getElementById("task1").innerText = task[0] || "";
    document.getElementById("task2").innerText = task[1] || "";

    // APR
    document.getElementById("apr").innerText =
      data.average_expected_apr || data.website_cards?.find(c => c.label === "Expected APR")?.value || "";

    // Updated
    document.getElementById("updated").innerText =
      data.updated_at || data.generated_at || "";

    // Details
    const detailsDiv = document.getElementById("details");
    detailsDiv.innerHTML = "";

    const testingDetail = data.testing_detail || [];

    testingDetail.forEach(item => {
      const div = document.createElement("div");
      div.className = "detail";

      div.innerHTML = `
        <strong>Parent:</strong> ${item.parent ?? ""}<br>
        <strong>Family:</strong> ${item.family ?? ""}<br>
        <strong>Child:</strong> ${item.child ?? ""}<br>
        <strong>Status:</strong> ${item.status ?? ""}<br>
        <strong>Reason:</strong> ${item.reason ?? ""}<br>
        <strong>Return:</strong> ${item.quick_return_pct ?? ""}%<br>
        <strong>Trades:</strong> ${item.quick_trades ?? ""}<br>
        <hr>
      `;

      detailsDiv.appendChild(div);
    });

    // Advanced Metrics
    setText("version", data.version);
    setText("mode", data.mode);
    setText("runtime", data.runtime_minutes ? `${data.runtime_minutes} min` : "");
    setText("childrenTested", data.children_tested);
    setText("viableChildren", data.children_viable);
    setText("childrenPruned", data.children_pruned);
    setText("promotions", data.promotions);
    setText("childrenPerHour", data.children_per_hour);
    setText("workers", data.worker_processes);
    setText("health", data.run_health || data.growth_metrics?.health);
    setText("focus", data.growth_metrics?.suggested_focus || "");
    setText("lastEvent", data.last_event || "");

    // Champions
    const championsDiv = document.getElementById("champions");
    if (championsDiv) {
      championsDiv.innerHTML = "";

      const champions = data.champions || {};
      Object.keys(champions).forEach(key => {
        const c = champions[key];
        const div = document.createElement("div");
        div.className = "detail";

        div.innerHTML = `
          <strong>${key.toUpperCase()}</strong><br>
          <strong>Name:</strong> ${c.name ?? ""}<br>
          <strong>Fitness:</strong> ${c.fitness ?? ""}<br>
          <strong>Return:</strong> ${c.return_pct ?? ""}%<br>
          <strong>APR:</strong> ${c.estimated_apr_pct ?? ""}%<br>
          <strong>Max DD:</strong> ${c.max_drawdown_pct ?? ""}%<br>
          <strong>Trades:</strong> ${c.trade_count ?? ""}<br>
          <strong>Win Rate:</strong> ${c.win_rate_pct ?? ""}%<br>
          <strong>PF:</strong> ${c.profit_factor ?? ""}
          <hr>
        `;

        championsDiv.appendChild(div);
      });
    }

    // Family Scoreboard
    const familiesDiv = document.getElementById("families");
    if (familiesDiv) {
      familiesDiv.innerHTML = "";

      const families = data.family_scoreboard || [];

      families.forEach(f => {
        const div = document.createElement("div");
        div.className = "detail";

        div.innerHTML = `
          <strong>${f.family ?? ""}</strong><br>
          <strong>Tested:</strong> ${f.tested ?? ""}<br>
          <strong>Quick Viable:</strong> ${f.quick_viable ?? ""}<br>
          <strong>Full Tests:</strong> ${f.full_tests ?? ""}<br>
          <strong>Promotions:</strong> ${f.promotions ?? ""}<br>
          <strong>Pruned:</strong> ${f.pruned ?? ""}<br>
          <strong>Last Reason:</strong> ${f.last_reason ?? ""}<br>
          <strong>Viable Rate:</strong> ${f.viable_rate_pct ?? ""}%<br>
          <hr>
        `;

        familiesDiv.appendChild(div);
      });
    }

  } catch (err) {
    console.error("Failed to load status:", err);
  }
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerText = value ?? "";
}

// Initial load
loadStatus();

// Refresh every 5 minutes
setInterval(loadStatus, 600000);
