const baseUrl = window.location.origin;
class AsesorForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.addEventListeners();
    this.checkAsesoriaId();
  }

  async checkAsesoriaId() {
    const urlParams = new URLSearchParams(window.location.search);
    const asesoriaId = urlParams.get("asesoriaId");

    if (asesoriaId) {
      try {
        const response = await fetch(`${baseUrl}/asesoria/${asesoriaId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Error al obtener los datos de la asesoría.");
        }

        const data = await response.json();
        this.fillFormWithData(data);
      } catch (error) {
        console.error("Error al cargar la asesoría para editar:", error);
        alert("Hubo un error al cargar los datos de la asesoría.");
      }
    }
  }

  fillFormWithData(data) {
    this.shadowRoot.querySelector("#tema").value = data.tema;
    this.shadowRoot.querySelector("#fecha").value = data.fecha;
    this.shadowRoot.querySelector("#hora").value = data.hora;
    this.shadowRoot.querySelector("#notas").value = data.notas;
    this.shadowRoot.querySelector("#tutor").value = data.tutor;
  }

  render() {
    this.shadowRoot.innerHTML = `
        <style>
            .form-container {
                display: flex;
                flex-direction: column;
                width: 300px;
                margin: auto;
                background: #f9f9f9;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
            .input-group {
                margin-bottom: 15px;
            }
            .input-group label {
                display: block;
                margin-bottom: 5px;
                font-weight: bold;
            }
            .input-group input,
            .input-group textarea,
            .input-group select {
                width: 100%;
                padding: 8px;
                box-sizing: border-box;
                border: 1px solid #ddd;
                border-radius: 5px;
            }
            .input-group textarea {
                resize: none;
            }
            .button {
                background-color: #007bff;
                color: white;
                padding: 10px;
                border: none;
                cursor: pointer;
                width: 100%;
                border-radius: 5px;
                font-weight: bold;
                transition: background-color 0.3s;
                text-align: center;
            }
            .button:hover {
                background-color: #0056b3;
            }
            .error {
                color: red;
                font-size: 12px;
            }
        </style>
        <div class="form-container">
            <form id="asesorForm">
                <div class="input-group">
                    <label for="tema">Tema:</label>
                    <input type="text" id="tema" name="tema" required />
                </div>
                <div class="input-group">
                    <label for="fecha">Fecha:</label>
                    <input type="date" id="fecha" name="fecha" required />
                </div>
                <div class="input-group">
                    <label for="hora">Horas:</label>
                    <input type="number" id="hora" name="hora" min="1" max="8" required />
                </div>
                <div class="input-group">
                    <label for="notas">Notas (máx. 50 caracteres):</label>
                    <textarea id="notas" name="notas" maxlength="50"></textarea>
                </div>
                <div class="input-group">
                    <label for="tutor">Tutor:</label>
                    <select id="tutor" name="tutor" required>
                        <option value="Juan">Juan</option>
                        <option value="Rosa">Rosa</option>
                        <option value="Pedro">Pedro</option>
                        <option value="Ana">Ana</option>
                        <option value="Javier">Javier</option>
                    </select>
                </div>
                <button type="submit" class="button">Guardar</button>
            </form>
        </div>
      `;
  }

  addEventListeners() {
    const form = this.shadowRoot.querySelector("#asesorForm");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const tema = this.shadowRoot.querySelector("#tema").value.trim();
      const fecha = this.shadowRoot.querySelector("#fecha").value;
      const hora = this.shadowRoot.querySelector("#hora").value;
      const notas = this.shadowRoot.querySelector("#notas").value.trim();
      const tutor = this.shadowRoot.querySelector("#tutor").value;

      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) {
        alert(
          "No se pudo obtener el nombre del usuario. Por favor, inicie sesión nuevamente."
        );
        window.location.href = "index.html";
        return;
      }

      if (!tema || !fecha || !hora || !tutor) {
        alert("Por favor, complete todos los campos.");
        return;
      }
      if (notas.length > 50) {
        alert("Las notas no pueden superar los 50 caracteres.");
        return;
      }
      if (hora < 1 || hora > 8) {
        alert("Las horas deben estar entre 1 y 8.");
        return;
      }

      const usuario = user.nombre;
      const data = { tema, fecha, hora, notas, tutor, usuario };

      const urlParams = new URLSearchParams(window.location.search);
      const asesoriaId = urlParams.get("asesoriaId");

      try {
        let response;
        if (asesoriaId) {
          // Editar la asesoría
          response = await fetch(`${baseUrl}/asesoria/${asesoriaId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(data),
          });
        } else {
          // Crear nueva asesoría
          response = await fetch(`${baseUrl}/solicitar-asesoria`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(data),
          });
        }

        if (!response.ok) {
          throw new Error(`Error en el servidor: ${response.statusText}`);
        }

        const result = await response.json();
        alert(
          asesoriaId
            ? "Asesoría actualizada con éxito."
            : "Solicitud guardada con éxito."
        );
        window.location.href = "dashboard.html";
      } catch (error) {
        console.error("Error al guardar la solicitud:", error);
        alert("Hubo un error al guardar la solicitud. Intente nuevamente.");
      }
    });
  }
}

customElements.define("asesor-form", AsesorForm);
