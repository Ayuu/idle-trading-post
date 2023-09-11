// navbar will be added to the bottom of the page
// it will contains a list of button to switch between screen

import { COMPONENT_NAMES } from "../constants"

export default class NavBar {
  constructor(engine) {
    this.engine = engine
    this.buttons = []
    this.activeButton = null

    this.addButton(COMPONENT_NAMES.BASE_SCR, "Base", "26FA", true)
    this.addButton(COMPONENT_NAMES.GUILD_SCR, "Guild", "1F3F0")
  }

  addButton(name, text, icon, active = false) {
    this.buttons.push({ name, text, icon, active })
  }

  create() {
    this.mainContainer = this.engine.components[COMPONENT_NAMES.MAIN]
    const container = this.engine.addComponent(
      COMPONENT_NAMES.NAVBAR,
      "div",
      COMPONENT_NAMES.CONTAINER
    )

    this.buttons.forEach(({ name, text, icon, active, onClick }) => {
      const button = this.engine.addComponent(name, "button", container.id)
      button.onclick = () => {
        if (this.activeButton === button) {
          return
        }

        if (this.activeButton) {
          this.activeButton.active = false
          this.activeButton.classList.remove("active")
          this.activeButton.style = ""
        }
        this.activeButton = button
        this.activeButton.active = true
        this.activeButton.classList.add("active")
        onClick && onClick()
        this.engine.switchScreen(name)
      }

      const buttonText = document.createElement("span")
      buttonText.textContent = text
      button.appendChild(buttonText)

      const iconC = document.createElement("span")
      iconC.textContent = String.fromCodePoint(`0x${icon}`)
      button.appendChild(iconC)

      button.classList.add("navbar-button")
      button.classList.add("btn")
      if (active) {
        this.activeButton = button
        button.classList.add("active")
      }
    })
  }
}
