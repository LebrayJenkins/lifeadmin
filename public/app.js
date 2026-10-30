const agreementsTable = document.querySelector("#agreements-table");
const agreementForm = document.querySelector("#agreement-form");

// Skapa och visa ett avtal i tabellen
function addAgreementToTable(agreement) {
  const row = document.createElement("tr");

  const nameCell = document.createElement("td");
  nameCell.textContent = agreement.name;
  row.appendChild(nameCell);

  const referenceCell = document.createElement("td");
  referenceCell.textContent = agreement.reference_number;
  row.appendChild(referenceCell);

  const costCell = document.createElement("td");
  costCell.textContent = `${agreement.monthly_cost} kr`;
  row.appendChild(costCell);

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Radera";

  deleteButton.addEventListener("click", () => {
    fetch(`/api/agreements/${agreement.id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          row.remove();
        } else {
          alert("Det gick inte att radera avtalet.");
        }
      })
      .catch((error) => {
        console.error("Nätverksfel:", error);
        alert("Kunde inte kontakta servern.");
      });
  });

  const actionCell = document.createElement("td");
  actionCell.appendChild(deleteButton);
  row.appendChild(actionCell);

  agreementsTable.appendChild(row);
}

// GET - Hämta och visa alla avtal
fetch("/api/agreements")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Kunde inte hämta avtalen");
    }

    return response.json();
  })
  .then((agreements) => {
    console.log("Antal avtal:", agreements.length);

    agreements.forEach((agreement) => {
      addAgreementToTable(agreement);
    });
  })
  .catch((error) => {
    console.error("Fel vid hämtning:", error);
    alert("Kunde inte hämta avtalen.");
  });

// POST - Registrera nytt avtal
agreementForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.querySelector("#agreement-name").value;
  const monthlyCost = Number(document.querySelector("#monthly-cost").value);
  const referenceNumber = document.querySelector("#reference-number").value;
  const description = document.querySelector("#description").value;

  const newAgreement = {
    name,
    monthlyCost,
    referenceNumber,
    description,
  };

  console.log("Avtalsnamn:", name);
  console.log("Månadskostnad:", monthlyCost);
  console.log("Referensnummer:", referenceNumber);
  console.log("Beskrivning:", description);

  fetch("/api/agreements", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newAgreement),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Kunde inte registrera avtalet");
      }

      return response.json();
    })
    .then((savedAgreement) => {
      console.log("Sparat avtal:", savedAgreement);

      const agreement = {
        id: savedAgreement.id,
        name: savedAgreement.name,
        monthly_cost: savedAgreement.monthlyCost,
        reference_number: savedAgreement.referenceNumber,
      };

      addAgreementToTable(agreement);
      agreementForm.reset();
    })
    .catch((error) => {
      console.error("Fel vid registrering:", error);
      alert("Det gick inte att registrera avtalet.");
    });
});
