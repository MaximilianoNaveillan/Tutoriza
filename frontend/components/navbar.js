class Navbar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.title = this.getAttribute("title") || "Dashboard";
    this.primaryButtonLabel =
      this.getAttribute("primary-button-label") || "Solicitar Acceso";
    this.primaryButtonLink = this.getAttribute("primary-button-link") || "#";
    this.render();
    this.addEventListeners();
    this.checkToken();
  }

  render() {
    this.shadowRoot.innerHTML = `
            <style>
                header {
                    background-color: #007bff;
                    color: white;
                    padding: 15px 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
                }
                header h1 {
                    margin: 0;
                    font-size: 1.5rem;
                    font-weight: bold;
                }
                .button-group {
                    display: flex;
                    gap: 10px;
                }
                button {
                    background-color: white;
                    color: #007bff;
                    border: 2px solid #007bff;
                    padding: 10px 15px;
                    border-radius: 25px;
                    font-size: 0.9rem;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.3s ease-in-out;
                }
                button:hover {
                    background-color: #0056b3;
                    color: white;
                    border-color: #0056b3;
                    transform: translateY(-3px);
                    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
                }
                button:active {
                    transform: translateY(2px);
                    box-shadow: none;
                }
            </style>
            <header>
                <h1 id="user-name">${this.title}</h1>
                <div class="button-group">
                    <button id="primary-button">${this.primaryButtonLabel}</button>
                    <button id="logout">Cerrar Sesión</button>
                </div>
            </header>
        `;
  }

  addEventListeners() {
    const logoutButton = this.shadowRoot.querySelector("#logout");
    const primaryButton = this.shadowRoot.querySelector("#primary-button");

    logoutButton.addEventListener("click", this.logout.bind(this));
    primaryButton.addEventListener("click", () => {
      window.location.href = this.primaryButtonLink;
    });
  }

  checkToken() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      window.location.href = "/index.html";
    }
  }

  logout() {
    localStorage.clear();
    window.location.href = "/index.html";
  }
}

customElements.define("app-navbar", Navbar);
