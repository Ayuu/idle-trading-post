import { COMPONENT_NAMES } from "../../constants"
import BaseDisplay from "./base_display"
import CreateBaseDisplay from "./create_base_display"
import LeftBar, { LEFT_COMPONENT_NAMES } from "./left_bar"
import MarketDisplay from "./market_display"

const GAME_COMPONENT_NAMES = {
  LEFTBAR: "game-leftbar",
  RIGHTCONTAINER: "game-right-container"
}

export default class GameDisplay {
  constructor(engine) {
    this.engine = engine
    this.leftBar = new LeftBar(this.engine)
    this.baseDisplay = new BaseDisplay(this.engine)
    this.createBaseDisplay = new CreateBaseDisplay(this.engine)
  }

  addBase(base) {
    this.leftBar.addButton(base)
    this.leftBar.updateBase(base.id)
    this.baseDisplay.updateBase(base)
    this.updateBase(base.id)
  }

  updateBase(name) {
    this.rightContainer.innerHTML = ""

    if (name === LEFT_COMPONENT_NAMES.CREATE_BASE) {
      const createBase = this.createBaseDisplay.create()
      this.rightContainer.appendChild(createBase)
    } else {
      const base = this.engine.gameState.bases[name]
      this.rightContainer.appendChild(this.baseDisplay.updateBase(base))
    }

    this.engine.gameState.currentBase = name
  }

  render() {
    if (
      this.engine.gameState.currentBase !== LEFT_COMPONENT_NAMES.CREATE_BASE
    ) {
      this.baseDisplay.render()
    }
  }

  remove() {
    this.container.innerHTML = ""
  }

  create() {
    this.container = this.engine.components[COMPONENT_NAMES.GAME_MAIN]

    this.leftBar.create(
      this.engine.addComponent(
        GAME_COMPONENT_NAMES.LEFTBAR,
        "div",
        this.container.id
      )
    )

    this.rightContainer = this.engine.addComponent(
      GAME_COMPONENT_NAMES.RIGHTCONTAINER,
      "div",
      this.container.id
    )

    this.updateBase(this.engine.gameState.currentBase)
  }
}
