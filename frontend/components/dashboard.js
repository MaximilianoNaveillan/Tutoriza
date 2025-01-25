class Dashboard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.displayUserName();
  }

  render() {
    this.shadowRoot.innerHTML = `
          <style>
              main {
                  padding: 20px;
              }
  
              .container {
                  max-width: 1200px;
                  margin: 0 auto;
                  display: flex;
                  flex-direction: column;
              }
  
              .welcome {
                  font-size: 24px;
                  margin-bottom: 20px;
              }
  
              .actions {
                  display: flex;
                  gap: 10px;
              }
  
              .actions button {
                  padding: 10px 20px;
                  border: none;
                  background-color: #28a745;
                  color: white;
                  cursor: pointer;
              }
  
              .actions button:hover {
                  background-color: #218838;
              }
          </style>
          <main>
              <div class="container">
                  <div class="welcome">
                      <p>Bienvenido , <span id="welcome-user-name"></span>!</p>
                  </div>
              </div>
          </main>
      `;
  }

  displayUserName() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      this.shadowRoot.querySelector("#welcome-user-name").textContent =
        user.nombre;
    }
  }
}

customElements.define("app-dashboard", Dashboard);
