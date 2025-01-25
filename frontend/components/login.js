class LoginForm extends HTMLElement {
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
              <form id="loginForm">
                  <div class="input-group">
                      <label for="log-email">E-mail:</label>
                      <input type="log-email" id="email" name="email" required />
                  </div>
                  <div class="input-group">
                      <label for="log-password">Contraseña:</label>
                      <input type="log-password" id="password" name="password" required />
                  </div>
                  <button type="submit" class="button">Iniciar sesión</button>
              </form>
          </div>
          `;
  }

  addEventListeners() {
    const form = this.shadowRoot.querySelector("#loginForm");
    form.addEventListener("submit", this.handleSubmit.bind(this));
  }

  handleSubmit(event) {
    event.preventDefault(); // Evitar que se recargue la página al enviar el formulario

    // Obtener los valores de los campos
    const email = this.shadowRoot.querySelector("#email").value;
    const password = this.shadowRoot.querySelector("#password").value;

    // Validación simple del correo electrónico
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!email.match(emailPattern)) {
      alert("Por favor, ingresa un correo electrónico válido.");
      return;
    }

    // Llamada a la función loginUser para enviar los datos al backend
    this.loginUser(email, password);
  }

  // Función para enviar los datos al backend para hacer el login
  loginUser(email, password) {
    fetch(`${baseUrl}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Inicio de sesión exitoso") {
          // Guardar los datos del usuario y el token en el localStorage
          localStorage.setItem("user", JSON.stringify(data.user));
          // Asumiendo que el backend devuelve un token

          // Redirigir al dashboard
          window.location.href = "dashboard.html";
        } else {
          alert(data.message);
        }
      })
      .catch((error) => {
        alert("Error al intentar iniciar sesión");
      });
  }
}

customElements.define("login-form", LoginForm);
