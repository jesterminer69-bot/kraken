async function loadStatus() {
  try {
    const res = await fetch("status.json?t=" + new Date().getTime());

    if (!res.ok) {
      throw new Error("HTTP " + res.status);
    }

    const data = await res.json();

    setText("task1", data.current_task?.[0] || "");
    setText("task2", data.current_task?.[1] || "");
    setText("task3", data.current_task?.[2] || "");

    setText("version", data.version || "");
    setText("mode", data.mode || "");
    setText("phase", data.phase || "");
    setText("runtime", formatRuntime(data.runtime_minutes));
    setText("workers", data.worker_processes ?? "");
    setText(
      "multiprocessing",
      data.multiprocessing_enabled
        ? "Enabled: " + (data.multiprocessing_mode || "")
        : "Disabled"
    );

    setText("updated", data.updated_at || data.generated_at || "");

    renderWebsiteCards(data.website_cards || []);
    renderChampions(data.champions || {});
    renderTestingDetails(data.testing_detail || []);
    renderWarnings(data.warnings || []);

  } catch (err) {
    console.error("Failed to load status:", err);
    setText("updated", "Failed to load status.json");
  }
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.innerText = value;
}

function formatRuntime(minutes) {
  if (minutes === undefined || minutes === null) return "";
  return Number(minutes).toFixed(2) + " minutes";
}

function renderWebsiteCards(cards) {
  const cardsDiv = document.getElementById("cards");
  cardsDiv.innerHTML = "";

  if (!cards.length) {
    cardsDiv.innerHTML = "<em>No status cards available yet.</em>";
    return;
  }

  cards.forEach(card => {
    const div = document.createElement("div");
    div.className = "mini-card";
    div.innerHTML = `
      <div class="mini-label">${escapeHtml(card.label || "")}</div>
      <div class="mini-value">${escapeHtml(card.value || "")}</div>
    `;
    cardsDiv.appendChild(div);
  });
}

function renderChampions(champions) {
  const championsDiv = document.getElementById("champions");
  championsDiv.innerHTML = "";

  const keys = Object.keys(champions);

  if (!keys.length) {
    championsDiv.innerHTML = "<em>No champions available yet.</em>";
    return;
  }

  keys.forEach(key => {
    const champ = champions[key];

    const div = document.createElement("div");
    div.className = "detail";

    div.innerHTML = `
      <strong>${escapeHtml(key.toUpperCase())}</strong><br>
      <strong>Name:</strong> ${escapeHtml(champ.name || "")}<br>
      <strong>Return:</strong> ${formatPct(champ.return_pct)}<br>
      <strong>APR:</strong> ${formatPct(champ.estimated_apr_pct)}<br>
      <strong>Max DD:</strong> ${formatPct(champ.max_drawdown_pct)}<br>
      <strong>Trades:</strong> ${champ.trade_count ?? ""}<br>
      <strong>Win Rate:</strong> ${formatPct(champ.win_rate_pct)}<br>
      <strong>Profit Factor:</strong> ${champ.profit_factor ?? ""}<br>
      <strong>Flags:</strong> ${(champ.flags || []).map(escapeHtml).join(", ")}
      <hr>
    `;

    championsDiv.appendChild(div);
  });
}

function renderTestingDetails(details) {
  const detailsDiv = document.getElementById("details");
  detailsDiv.innerHTML = "";

  if (!details.length) {
    detailsDiv.innerHTML =
      "<em>No active child test details yet. Bot may be in startup, cache loading, or baseline phase.</em>";
    return;
  }

  details.forEach(item => {
    const div = document.createElement("div");
    div.className = "detail";

    div.innerHTML = `
      <strong>Parent:</strong> ${escapeHtml(item.parent || "")}<br>
      <strong>Child:</strong> ${escapeHtml(item.child || "")}<br>
      <strong>Status:</strong> ${escapeHtml(item.status || "")}<br>
      <strong>Reason:</strong> ${escapeHtml(item.reason || "")}<br>
      <strong>Score:</strong> ${item.current_score ?? "n/a"} 
      <strong>Parent:</strong> ${item.parent_score ?? "n/a"}
      <hr>
    `;

    detailsDiv.appendChild(div);
  });
}

function renderWarnings(warnings) {
  const warningsDiv = document.getElementById("warnings");
  warningsDiv.innerHTML = "";

  if (!warnings.length) {
    warningsDiv.innerHTML = "<em>No warnings.</em>";
    return;
  }

  warnings.forEach(warning => {
    const div = document.createElement("div");
    div.className = "warning";
    div.innerText = warning;
    warningsDiv.appendChild(div);
  });
}

function formatPct(value) {
  if (value === undefined || value === null || value === "") return "";
  return Number(value).toFixed(3) + "%";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// Initial load
loadStatus();

// Refresh every 5 minutes
setInterval(loadStatus, 300000);
