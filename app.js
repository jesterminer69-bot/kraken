async function loadStatus() {
  try {
    const res = await fetch("status.json?t=" + new Date().getTime());
    const data = await res.json();

    // Task
    document.getElementById("task1").innerText = data.current_task[0];
    document.getElementById("task2").innerText = data.current_task[1];

    // APR
    document.getElementById("apr").innerText = data.average_expected_apr;

    // Updated
    document.getElementById("updated").innerText = data.updated_at;

    // Details
    const detailsDiv = document.getElementById("details");
    detailsDiv.innerHTML = "";

    data.testing_detail.forEach(item => {
      const div = document.createElement("div");
      div.className = "detail";

      div.innerHTML = `
        <strong>Parent:</strong> ${item.parent}<br>
        <strong>Child:</strong> ${item.child}<br>
        <strong>Status:</strong> ${item.status}<br>
        <strong>Reason:</strong> ${item.reason}<br>
        <strong>Score:</strong> ${item.current_score} (parent: ${item.parent_score})
        <hr>
      `;

      detailsDiv.appendChild(div);
    });

  } catch (err) {
    console.error("Failed to load status:", err);
  }
}

// Initial load
loadStatus();

// Refresh every 5 minutes
setInterval(loadStatus, 300000);
