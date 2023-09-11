import { COMPONENT_NAMES } from "../constants"

const GUILD_COMPONENT_NAMES = {
  MAIN: "guild-container",
  COINS: "guild-coins",
  NAME: "guild-name",
  RESEARCH: "guild-research",
  SUBMIT: "guild-submit",
}

export default class GuildDisplay {
  constructor(engine) {
    this.engine = engine
  }

  addComponent(name, label, type, parent) {
    const container = this.engine.addComponent(
      `${name}-container`,
      "div",
      parent
    )
    container.className = "cb-row"
    let labelComp = undefined
    let component
    if (type !== "button") {
      labelComp = this.engine.addComponent(
        `${name}-label`,
        "label",
        container.id
      )
      labelComp.textContent = label
    }
    if (typeof type === "string") {
      component = this.engine.addComponent(name, type, container.id)
    } else {
      component = type
      container.appendChild(component)
    }
    if (type !== "button") {
      labelComp.for = component.id
    } else {
      component.textContent = label
    }
    return [component, container, labelComp]
  }

  addNameRow() {
    const [component, container, label] = this.addComponent(
      GUILD_COMPONENT_NAMES.NAME,
      "Name",
      "input",
      this.guildContainer.id
    )
    this.name = component
    this.name.value = this.engine.gameState.guild.name
    this.name.onkeyup = (e) => {
      const value = e.target.value.trim()
      this.submit.disabled =
        value === "" || this.engine.gameState.guild.name === value
    }
  }

  addSubmitButton() {
    const [component, container, label] = this.addComponent(
      GUILD_COMPONENT_NAMES.SUBMIT,
      "Submit",
      "button",
      this.guildContainer.id
    )
    this.submit = component
    this.submit.className = "btn btn-menu"
    this.submit.disabled = true

    this.submit.onclick = () => {
      this.engine.gameState.guild.updateName(
        this.name.value,
        this.engine.topbar
      )
    }
  }

  remove() {
    this.container.innerHTML = ""
  }

  create() {
    this.container = this.engine.components[COMPONENT_NAMES.GAME_MAIN]

    this.guildContainer = this.engine.addComponent(
      GUILD_COMPONENT_NAMES.MAIN,
      "div",
      this.container.id
    )

    this.addNameRow()
    this.addSubmitButton()
  }
}
