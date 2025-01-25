const baseUrl = window.location.origin;
class RegistroForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.addEventListeners();
  }

  render() {
    this.shadowRoot.innerHTML = `
          <style>
              .form-container {
                  display: flex;
                  flex-direction: column;
                  width: 300px;
                  margin: auto;
              }
              .input-group {
                  margin-bottom: 15px;
              }
              .input-group label {
                  display: block;
                  margin-bottom: 5px;
              }
              .input-group input {
                  width: 100%;
                  padding: 8px;
                  box-sizing: border-box;
              }
              .button {
                  background-color: #007bff;
                  color: white;
                  padding: 10px;
                  border: none;
                  cursor: pointer;
                  width: 100%;
                  margin-top: 15px;
                  text-align: center;
              }
              .form-container button {
                  align-self: center;
              }
              .error {
                  color: red;
                  font-size: 12px;
              }
          </style>
          <div class="form-container">
              <form id="registroForm">
                  <div class="input-group">
                      <label for="reg-nombre">Nombre:</label>
                      <input type="text" id="reg-nombre" name="nombre" autocomplete="username" required />
                  </div>
                  <div class="input-group">
                      <label for="reg-apellido">Apellido:</label>
                      <input type="text" id="reg-apellido" name="apellido" required />
                  </div>
                  <div class="input-group">
                      <label for="reg-email">E-mail:</label>
                      <input type="email" id="reg-email" name="email" required autocomplete="useremail" />
                  </div>
                  <div class="input-group">
                      <label for="reg-password">Contraseña:</label>
                      <input type="password" id="reg-password" name="password" autocomplete="new-password" required />
                  </div>
                  <div class="input-group">
                      <label for="reg-confPassword">Confirmar Contraseña:</label>
                      <input type="password" id="reg-confPassword" name="confPassword" autocomplete="new-password" required />
                  </div>
                  <button type="submit" class="button">Registrar</button>
              </form>
          </div>
          `;
  }

  addEventListeners() {
    const form = this.shadowRoot.querySelector("#registroForm");
    form.addEventListener("submit", this.handleSubmit.bind(this));
  }

  async handleSubmit(event) {
    event.preventDefault(); // Evitar que el formulario se recargue

    // Obtener los valores de los campos
    const nombre = this.shadowRoot.querySelector("#reg-nombre").value;
    const apellido = this.shadowRoot.querySelector("#reg-apellido").value;
    const email = this.shadowRoot.querySelector("#reg-email").value;
    const password = this.shadowRoot.querySelector("#reg-password").value;
    const confPassword =
      this.shadowRoot.querySelector("#reg-confPassword").value;

    // Validación simple de los datos
    if (password !== confPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!email.match(emailPattern)) {
      alert("Por favor, ingresa un correo electrónico válido.");
      return;
    }

    // Datos a enviar
    const data = {
      nombre,
      apellido,
      email,
      password,
    };

    try {
      // Enviar solicitud POST al backend (asumimos que la ruta es /register)
      const response = await fetch(`${baseUrl}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      // Verificar la respuesta del backend
      const responseData = await response.json();

      if (response.ok) {
        console.log("Registro exitoso:", responseData);
        alert("¡Registro exitoso!");
      } else {
        console.error("Error al registrar:", responseData.message);
        alert(`Error: ${responseData.message}`);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      alert("Hubo un error al enviar el formulario.");
    }
  }
}

customElements.define("registro-form", RegistroForm);
