import { CLIMATE_EMOJI } from "../../constants"

export const LEFT_COMPONENT_NAMES = {
  CREATE_BASE: "Y3JlYXRlLWJhc2UtMTYzNjc3MDcxMA=="
}

// This will display the list of base + the create base button
export default class LeftBar {
  constructor(engine) {
    this.engine = engine
    this.buttons = {}
    this.expanded = window.screen.width > 425
  }

  updateBase(baseId) {
    if (this.currentBase) {
      this.currentBase.classList.remove("active")
    }
    this.currentBase = this.buttons[baseId]
    this.currentBase.classList.add("active")
  }

  updateButtonContent() {
    if (this.expanded) {
      this.collapseButton.textContent = "<"
      this.container.classList.add("expand")
      for (const base of Object.values(this.engine.gameState.bases)) {
        if (!base || !this.buttons[base.id]) {
          continue
        }
        this.buttons[base.id].textContent = base.name
      }
      this.buttons[LEFT_COMPONENT_NAMES.CREATE_BASE].textContent = "+ New Base"
    } else {
      this.collapseButton.textContent = ">"
      this.container.classList.remove("expand")
      for (const base of Object.values(this.engine.gameState.bases)) {
        if (!base || !this.buttons[base.id]) {
          continue
        }
        this.buttons[base.id].textContent = CLIMATE_EMOJI[base.climate]
      }
      this.buttons[LEFT_COMPONENT_NAMES.CREATE_BASE].textContent = "+ \u{26FA}"
    }
  }

  addCollapseButton() {
    this.collapseButton = this.engine.addComponent(
      "left-bar-collapse",
      "button",
      this.container.id
    )

    const toggleExpand = () => {
      this.expanded = !this.expanded
      this.updateButtonContent()
    }

    this.collapseButton.classList.add("btn")
    this.collapseButton.onclick = toggleExpand
  }

  addButton(base) {
    const newButton = this.engine.addComponent(
      `btn-${base.id}`,
      "button",
      this.container.id
    )
    newButton.classList.add("btn")
    newButton.textContent =
      !base.climate || this.expanded ? base.name : CLIMATE_EMOJI[base.climate]
    newButton.onclick = () => {
      this.updateBase(base.id)
      this.engine.gameDisplay.updateBase(base.id)
    }
    this.buttons[base.id] = newButton
  }

  create(container) {
    this.container = container
    this.addCollapseButton()
    this.addButton({ id: LEFT_COMPONENT_NAMES.CREATE_BASE, name: "+ New Base" })
    for (const base of Object.values(this.engine.gameState.bases)) {
      if (!base) {
        continue
      }
      this.addButton(base)
    }
    this.currentBase = this.buttons[this.engine.gameState.currentBase]
    this.currentBase.classList.add("active")
    this.updateButtonContent()
  }
}
