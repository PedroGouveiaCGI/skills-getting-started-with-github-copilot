  try {
  activitiesList.innerHTML = "";
  activitySelect.innerHTML = '<option value="">-- Select an activity --</option>';

  Object.entries(activities).forEach(([name, details]) => {
    const activityCard = document.createElement("div");
    activityCard.className = "activity-card";
    const spotsLeft = details.max_participants - details.participants.length;
    const participants = details.participants || [];

    const participantsList = document.createElement("ul");
    participantsList.className = "participants-list";

    if (participants.length > 0) {
      participants.forEach((participant) => {
        const listItem = document.createElement("li");
        listItem.className = "participant-item";

        const email = document.createElement("span");
        email.className = "participant-email";
        email.textContent = participant;

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "delete-participant";
        deleteButton.setAttribute("aria-label", `Remove ${participant} from ${name}`);
        deleteButton.dataset.activity = name;
        deleteButton.dataset.email = participant;
        deleteButton.innerHTML = `
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1h3a1 1 0 1 1 0 2h-1v11a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V6H5a1 1 0 0 1 0-2h3V3Zm2 1v1h2V4h-2Zm-2 3v9h2v-9H9Zm4 0v9h2v-9h-2Z"/>
          </svg>
        `;

        deleteButton.addEventListener("click", async () => {
          await unregisterParticipant(name, participant);
        });

        listItem.appendChild(email);
        listItem.appendChild(deleteButton);
        participantsList.appendChild(listItem);
      });
    } else {
      const emptyItem = document.createElement("li");
      emptyItem.className = "participant-empty";
      emptyItem.textContent = "No participants yet";
      participantsList.appendChild(emptyItem);
    }

    activityCard.innerHTML = `
      <h4>${name}</h4>
      <p>${details.description}</p>
      <p><strong>Schedule:</strong> ${details.schedule}</p>
      <p><strong>Availability:</strong> ${spotsLeft} spots left</p>
    `;

    const participantsSection = document.createElement("div");
    participantsSection.className = "participants-section";
    participantsSection.innerHTML = "<h5>Participants</h5>";
    participantsSection.appendChild(participantsList);
    activityCard.appendChild(participantsSection);
    activitiesList.appendChild(activityCard);

    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    activitySelect.appendChild(option);
  });
} catch (error) {
  activitiesList.innerHTML = "<p>Failed to load activities. Please try again later.</p>";
  console.error("Error fetching activities:", error);
}