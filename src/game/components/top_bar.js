import { COMPONENT_NAMES } from "../constants"

const GUILD_COMPONENTS = {
  COINS: "guild-coins",
  NAME: "guild-name",
  RESEARCH: "guild-research",
}

export default class TopBar {
  constructor(engine) {
    this.engine = engine
    this.guild = engine.gameState.guild
  }

  update() {
    this.nameContainer.innerHTML = `Guild name: ${this.guild.name}`
    this.coinsContainer.innerHTML = `&#x1F4B0; ${this.guild.coins}`
  }

  create() {
    // create the top bar to display the information
    this.container = this.engine.addComponent(
      COMPONENT_NAMES.TOP,
      "div",
      COMPONENT_NAMES.CONTAINER
    )
    this.nameContainer = this.engine.addComponent(
      GUILD_COMPONENTS.NAME,
      "div",
      this.container.id
    )
    this.coinsContainer = this.engine.addComponent(
      GUILD_COMPONENTS.COINS,
      "div",
      this.container.id
    )

    this.update()
  }
}
