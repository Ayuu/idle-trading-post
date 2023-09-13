import { RESOURCE } from "../../constants"
import { defaultdict, formatScientificNotation } from "../../utils"
import { GUILD_COMPONENTS } from "../top_bar"
import { GAME_COMPONENT_NAMES } from "./base_display"

export default class MarketDisplay {
  constructor(engine, base) {
    this.engine = engine
    this.base = base
  }

  refreshMarketDisplayFor(resourceType, reset = true) {
    const resource = RESOURCE[resourceType]
    if (!resource) return
    const components = this.components[resourceType]
    const resourceAmount = this.base.resources[resourceType]
    components.name.textContent = `${resource.name} (${formatScientificNotation(
      resourceAmount,
      2
    )})`
    if (reset) {
      this.updateEstimateTotal(resourceType, 0)
      components.input.value = ""
    }
  }

  generateMarketDisplayFor(resourceType) {
    const resource = RESOURCE[resourceType]
    if (!resource) return
    this.components[resourceType] = defaultdict(() => ({}))
    const c = this.components[resourceType]

    const cell = document.createElement("div")
    cell.classList.add("resource-row")

    const meta = document.createElement("div")
    meta.classList.add("resource-meta")
    const icon = document.createElement("span")
    const name = document.createElement("span")
    icon.textContent = resource.id
    meta.appendChild(icon)
    meta.appendChild(name)
    c.name = name
    cell.appendChild(meta)

    const sellAmountRow = document.createElement("div")
    const inputBox = document.createElement("input")
    c.input = inputBox
    inputBox.type = "number"

    inputBox.onkeyup = e => {
      const resourceAmount = this.base.resources[resourceType]
      try {
        const re = new RegExp("^[0-9]+$")
        if (!re.test(e.target.value)) {
          throw new Exception("invalid input")
        }
        const value = parseInt(e.target.value)
        if (value < 0) {
          e.target.value = 0
        } else if (value > resourceAmount) {
          e.target.value = resourceAmount
        }

        this.updateEstimateTotal(
          resourceType,
          e.target.value * this.base.market.resourcePrice[resourceType]
        )
      } catch (ex) {
        e.target.value = ""
        this.updateEstimateTotal(resourceType, 0)
      }
    }
    sellAmountRow.appendChild(inputBox)

    const maxButton = document.createElement("button")
    maxButton.classList.add("btn")
    maxButton.onclick = () => {
      const resourceAmount = this.base.resources[resourceType]
      inputBox.value = resourceAmount
      this.updateEstimateTotal(resourceType, resourceAmount)
    }
    sellAmountRow.appendChild(maxButton)
    cell.appendChild(sellAmountRow)

    const sellRow = document.createElement("div")
    const sellButton = document.createElement("button")
    sellButton.textContent = "Sell"
    c.sellButton = sellButton
    sellButton.onclick = () => {
      const amount = parseInt(inputBox.value)
      const cost = this.base.market.resourcePrice[resourceType]
      this.engine.gameState.guild.coins += cost * amount
      this.engine.components[
        GUILD_COMPONENTS.COINS
      ].textContent = `\u{1F4B0} ${this.engine.gameState.guild.coins}`
      this.base.resources[resourceType] -= Math.floor(amount)
      this.refreshMarketDisplayFor(resourceType)
    }
    sellButton.classList.add("btn")

    const estimateTotal = document.createElement("span")
    maxButton.textContent = "Max"
    c.estimateTotal = estimateTotal
    sellRow.appendChild(estimateTotal)
    sellRow.appendChild(sellButton)

    cell.appendChild(sellRow)
    this.container.appendChild(cell)

    this.refreshMarketDisplayFor(resourceType)
  }

  updateEstimateTotal(resourceType, resourceAmount) {
    const components = this.components[resourceType]
    components.estimateTotal.textContent = `\u{1F4B0} ${formatScientificNotation(
      (resourceAmount * this.base.market.resourcePrice[resourceType]).toFixed(3)
    )}`
    components.sellButton.disabled = resourceAmount === 0
  }

  showResourceToSell() {
    this.remove()
    for (const resourceType of Object.keys(this.base.resources)) {
      this.generateMarketDisplayFor(resourceType)
    }
  }

  render() {
    for (const resourceType of Object.keys(this.base.resources)) {
      this.refreshMarketDisplayFor(resourceType, false)
    }
  }

  remove() {
    this.container.innerHTML = ""
    this.components = {}
  }

  create() {
    this.container = this.engine.components[GAME_COMPONENT_NAMES.CONTAINER]
    this.components = {}

    this.showResourceToSell()
  }
}
