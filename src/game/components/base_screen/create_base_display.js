import { GameDropdown } from "../../../screen/utils"
import { CLIMATE, COMPONENT_NAMES } from "../../constants"

const CB_COMPONENT_NAMES = {
  CLIMATE: "cb-climate",
  NAME: "cb-name",
  COST: "cb-cost",
  SUBMIT: "cb-submit",
}

export default class CreateBaseDisplay {
  constructor(engine) {
    this.engine = engine
    this.container = null
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
      CB_COMPONENT_NAMES.NAME,
      "Name",
      "input",
      this.container.id
    )
    this.name = component
    this.name.onkeypress = () => {
      const value = this.name.value.trim()
      const climate = this.climate.value
      if (value === "" || climate === "Select a climate...") {
        this.submit.disabled = true
        return
      }
      const cost = this.engine.gameState.settings.baseCostPerClimate[climate]
      this.submit.disabled = cost > this.engine.gameState.guild.coins
    }
  }

  addClimateRow() {
    const climateDd = new GameDropdown(
      CB_COMPONENT_NAMES.CLIMATE,
      Object.entries(CLIMATE).map(([text, value]) => ({ text, value })),
      {
        placeholder: "Select a climate...",
        onChange: (e) => {
          const climate = e.target.value
          const climateCost =
            this.engine.gameState.settings.baseCostPerClimate[climate]
          this.cost.innerHTML = `&#x1F4B0; ${climateCost}`
          if (climateCost > this.engine.gameState.guild.coins) {
            this.cost.style.color = "red"
            this.submit.disabled = true
          } else {
            this.cost.style.color = "white"
            this.submit.disabled = this.name.value.trim() === ""
          }
        },
      }
    )
    const [component, container, label] = this.addComponent(
      CB_COMPONENT_NAMES.CLIMATE,
      "Climate",
      climateDd.generate(),
      this.container.id
    )
    this.climate = component
    this.cost = this.engine.addComponent(
      CB_COMPONENT_NAMES.COST,
      "span",
      container.id
    )
  }

  addSubmitButton() {
    const [component, container, label] = this.addComponent(
      CB_COMPONENT_NAMES.SUBMIT,
      "Submit",
      "button",
      this.container.id
    )
    this.submit = component
    this.submit.className = "btn btn-menu"
    this.submit.disabled = true

    this.submit.onclick = () => {
      this.engine.createNewBase(this.name.value, this.climate.value, "")
    }
  }

  create() {
    this.container = this.engine.addComponent(
      COMPONENT_NAMES.CREATE_BASE,
      "div"
    )

    this.addClimateRow()
    this.addNameRow()
    this.addSubmitButton()

    return this.container
  }
}
