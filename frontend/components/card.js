const baseUrl = window.location.origin;
class AsesoriaCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const asesoriaId = urlParams.get("asesoriaId");
    if (asesoriaId) {
      await this.loadAsesoria(asesoriaId);
    } else {
      this.shadowRoot.innerHTML =
        "<p>El ID de la asesoría no fue proporcionado.</p>";
    }
  }

  async loadAsesoria(asesoriaId) {
    try {
      const response = await fetch(`${baseUrl}/asesoria/${asesoriaId}`);
      const data = await response.json();

      if (response.ok) {
        this.render(data);
      } else {
        this.shadowRoot.innerHTML = `<p>${data.error}</p>`;
      }
    } catch (error) {
      console.error("Error al hacer la solicitud:", error);
      this.shadowRoot.innerHTML = `<p>Hubo un error al cargar los datos.</p>`;
    }
  }

  render(data) {
    this.shadowRoot.innerHTML = `
        <style>
          /* Estilos para la estructura principal */
          main {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
          }
  
          .container {
            max-width: 500px;
            width: 100%;
            padding: 20px;
          }
  
          /* Estilos para la tarjeta */
          .card {
            background-color: #f9f9f9;
            border: 1px solid #ddd;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            font-family: Arial, sans-serif;
          }
          .card-header {
            font-size: 1.5em;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .card-content {
            font-size: 1em;
            margin-bottom: 20px;
          }
          .card-footer {
            display: flex;
            justify-content: space-between;
          }
          .footer-item {
            font-size: 0.9em;
            color: #555;
          }
          .nota {
            font-style: italic;
            color: #888;
            margin-top: 10px;
          }
        </style>
  
        <main>
          <div class="container">
            <div class="card">
              <div class="card-header">
                ${data.tema}
              </div>
              <div class="card-content">
                <div><strong>Solicitante:</strong> ${data.usuario}</div>
                <div><strong>Fecha:</strong> ${data.fecha}</div>
                <div><strong>Duración:</strong> ${data.horas} horas</div>
                <div class="nota"><strong>Nota:</strong> ${
                  data.notas || "Sin notas"
                }</div>
              </div>
              <div class="card-footer">
                <div class="footer-item"><strong>Tutor:</strong> ${
                  data.usuario
                }</div>
              </div>
            </div>
          </div>
        </main>
      `;
  }
}

customElements.define("asesoria-card", AsesoriaCard);
