const baseUrl = window.location.origin;
class DashboardGrid extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    await this.loadData(); // Cargar los datos desde el backend
  }

  async loadData() {
    try {
      const response = await fetch(`${baseUrl}/asesorias`); // Solicitud al backend para obtener los datos
      const data = await response.json(); // Convertimos la respuesta a formato JSON

      if (response.ok) {
        this.render(data); // Renderizamos los datos si la solicitud fue exitosa
      } else {
        console.error("Error al obtener los datos del backend:", data);
        this.render([]); // En caso de error, mostramos un array vacío
      }
    } catch (error) {
      console.error("Error al hacer la solicitud:", error);
      this.render([]); // En caso de error en la solicitud
    }
  }

  render(data) {
    if (data.length === 0) {
      this.shadowRoot.innerHTML = `<p>No hay asesorías disponibles.</p>`;
      return;
    }

    this.shadowRoot.innerHTML = `
        <style>
          main {
            display: flex;
            justify-content: center;
            align-items: center;
            
            padding: 20px;
            box-sizing: border-box;
          }
  
          .grid-container {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
            max-width: 1200px;
            width: 100%;
          }
  
          .card {
            background-color: #f9f9f9;
            border: 1px solid #ddd;
            border-radius: 10px;
            padding: 16px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
  
          .card-header {
            font-weight: bold;
            margin-bottom: 8px;
          }
  
          .card-details {
            margin-bottom: 16px;
            font-size: 0.9em;
          }
  
          .buttons {
            display: flex;
            justify-content: space-between;
          }
  
          .button {
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: background-color 0.3s;
          }
  
          .button:hover {
            background-color: #0056b3;
          }
  
          .button svg {
            width: 20px;
            height: 20px;
          }
  
          .card-header span {
            display: block;
            font-weight: normal;
            margin-top: 4px;
            color: #555;
          }
        </style>
  
        <main>
          <div class="grid-container">
            ${data
              .map(
                (item) => `
              <div class="card" data-id="${item.id}">
                <div class="card-header">
                  ${item.tema}
                  <span>${item.fecha}</span>
                </div>
                <div class="card-details">
                  Solicitante: ${item.usuario}<br />
                  Duración: ${item.horas} horas
                </div>
                <div class="buttons">
                  <button class="button" title="Ver" data-action="view">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="15.9" y1="8.1" x2="19" y2="5"/></svg>
                  </button>
                  <button class="button" title="Editar" data-action="edit">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                  </button>
                  <button class="button" title="Eliminar" data-action="delete">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a3 3 0 0 1 6 0v2"/></svg>
                  </button>
                </div>
              </div>
            `
              )
              .join("")}
          </div>
        </main>
      `;

    this.addEventListeners();
  }

  addEventListeners() {
    const buttons = this.shadowRoot.querySelectorAll(".button");
    buttons.forEach((button) => {
      button.addEventListener("click", (event) => {
        const action = event.target.closest("button").dataset.action;
        const card = event.target.closest(".card");
        const id = card.dataset.id;

        switch (action) {
          case "view":
            this.handleView(id);
            break;
          case "edit":
            this.handleEdit(id);
            break;
          case "delete":
            this.handleDelete(id);
            break;
          default:
            console.log("Acción no válida");
        }
      });
    });
  }

  handleView(id) {
    window.location.href = `/ver.html?asesoriaId=${id}`;
  }

  handleEdit(id) {
    console.log("Editar asesoría con ID:", id);
    window.location.href = `/nueva.html?asesoriaId=${id}`;
  }

  handleDelete(id) {
    console.log("Eliminar asesoría con ID:", id);

    // Confirmar la eliminación
    if (confirm("¿Estás seguro de que deseas eliminar esta asesoría?")) {
      // Realizar la solicitud DELETE
      fetch(`${baseUrl}/asesoria/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Si es necesario, agregar el token
        },
      })
        .then((response) => {
          if (response.ok) {
            console.log("Asesoría eliminada con éxito");
            // Eliminar el elemento del DOM
            const card = this.shadowRoot.querySelector(
              `.card[data-id='${id}']`
            );
            card.remove();
          } else {
            console.error("Error al eliminar la asesoría");
            alert("Hubo un error al eliminar la asesoría.");
          }
        })
        .catch((error) => {
          console.error("Error al hacer la solicitud:", error);
          alert("Hubo un error al eliminar la asesoría.");
        });
    }
  }
}

customElements.define("dashboard-grid", DashboardGrid);
