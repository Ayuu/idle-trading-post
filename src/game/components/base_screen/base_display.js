import { IdleBuilding } from "../../building"
import { IDLE_BUILDING, RESOURCE } from "../../constants"
import { defaultdict, formatScientificNotation, formatTime } from "../../utils"

const GAME_COMPONENT_NAMES = {
  MAIN: "game-base",
  TABS: "game-tabs",
  CONTAINER: "game-container",

  // META Components
  NAME: "game-name",
  LOCATION: "game-location",
  RESOURCES: "game-resources",
  RESEARCH: "game-research",
  MARKET: "game-market",
  TRADE: "game-trade",
  EQUIPMENT: "game-equipment"
}

const TAB = {
  META: "Info",
  BUILDING: "Building",
  // RESEARCH: "Research",
  MARKET: "Market"
  // TRADE: "Trade",
  // EQUIPMENT: "Equipment",
}

const formatResourceListToStr = (
  container,
  resourceList,
  resourceOwned = null
) => {
  if (resourceList.length === 0) {
    return
  }
  const showResource = resourceOwned !== null
  for (const [resourceType, amount] of resourceList) {
    const resource = RESOURCE[resourceType]
    if (resource) {
      const resourceSpan = document.createElement("span")
      resourceSpan.textContent = resource.id
      container.appendChild(resourceSpan)

      const resourceAmountSpan = document.createElement("span")
      resourceAmountSpan.textContent = formatScientificNotation(amount)
      if (
        showResource &&
        (!resourceOwned[resourceType] || resourceOwned[resourceType] < amount)
      ) {
        resourceAmountSpan.classList.add("red")
      }
      container.appendChild(resourceAmountSpan)
    }
  }
}

export default class BaseDisplay {
  constructor(engine, base) {
    this.engine = engine
    this.base = base
    this.buttons = {}
  }

  updateBase(base) {
    this.container && (this.container.innerHTML = "")
    this.base = base
    return this.create()
  }

  createTabs() {
    this.tabs = this.engine.addComponent(
      GAME_COMPONENT_NAMES.TABS,
      "div",
      this.container.id
    )
    this.tabs.classList.add("row")

    Object.entries(TAB).forEach(([name, label]) => {
      const button = this.engine.addComponent(name, "button", this.tabs.id)
      button.classList.add("btn")
      button.classList.add("navbar-button")
      const span = document.createElement("span")
      span.textContent = label
      button.appendChild(span)
      if (this.currentTab === label) {
        button.classList.add("active")
        this
      }
      button.onclick = () => {
        this.buttons[this.currentTab].classList.remove("active")
        this.updateTab(label)
        this.buttons[this.currentTab].classList.add("active")
      }
      this.buttons[label] = button
    })
  }

  updateTab(tab) {
    this.gameContainer.innerHTML = ""
    this.currentTab = tab

    switch (tab) {
      case TAB.META:
        this.showMeta()
        break
      case TAB.BUILDING:
        this.showBuilding()
        break
      case TAB.RESEARCH:
        this.showResearch()
        break
      case TAB.MARKET:
        this.showMarket()
        break
    }
  }

  showMeta() {
    this.name = this.engine.addComponent(
      GAME_COMPONENT_NAMES.NAME,
      "div",
      this.gameContainer.id
    )
    this.name.textContent = `Base: ${this.base.name}`

    this.location = this.engine.addComponent(
      GAME_COMPONENT_NAMES.LOCATION,
      "div",
      this.gameContainer.id
    )
    this.location.textContent = `Location: [latitude: ${this.base.location.y}, longitude: ${this.base.location.x}]`

    this.inventory = this.engine.addComponent(
      GAME_COMPONENT_NAMES.RESOURCES,
      "div",
      this.gameContainer.id
    )
  }

  getBuildingGenerateInfo(container, building) {
    container.innerHTML = ""
    const prefixSpan = document.createElement("span")
    prefixSpan.textContent = `\u{1F9FA} \u{23F3} ${formatTime(
      building.generateRate()
    )}`
    container.appendChild(prefixSpan)

    if (building.level > 0) {
      formatResourceListToStr(container, building.willGenerate())
    }
  }

  getBuildingNextRequirement(container, building, baseResource) {
    container.innerHTML = ""
    const prefixSpan = document.createElement("span")
    prefixSpan.textContent = `\u{1F6E0} \u{23F3} ${formatTime(
      building.getTimeRequiredToBuild()
    )}`
    container.appendChild(prefixSpan)

    const nextRequirement = building.getResourcesNeededForNextLevel()
    if (nextRequirement.length > 0) {
      formatResourceListToStr(container, nextRequirement, baseResource)
    }
    const futureGenerateSpan = document.createElement("span")
    futureGenerateSpan.textContent = " \u{27A1} \u{1F9FA} "
    container.appendChild(futureGenerateSpan)
    formatResourceListToStr(container, building.willGenerate(1))
  }

  showBuilding() {
    this.buildings = defaultdict(() => ({}))
    Object.entries(IDLE_BUILDING).forEach(([name, buildingArgs]) => {
      const button = this.engine.addComponent(
        `add-bld-${name}`,
        "button",
        this.gameContainer.id
      )
      button.classList.add("btn", "btn-upgrade", "btn-progress")
      const label = document.createElement("span")
      this.buildings[name]["label"] = label
      button.appendChild(label)

      const progressContainer = document.createElement("span")
      progressContainer.classList.add("progress-bar")
      button.appendChild(progressContainer)
      this.buildings[name]["progressBar"] = progressContainer

      const resourceGenerated = document.createElement("span")
      this.buildings[name]["resourceGenerated"] = resourceGenerated
      button.appendChild(resourceGenerated)

      const nextLevelRequirements = document.createElement("span")
      this.buildings[name]["nextLevelRequirements"] = nextLevelRequirements
      button.appendChild(nextLevelRequirements)
      button.onclick = () => {
        this.base.upgradeBuilding(new IdleBuilding(...buildingArgs))
      }
      this.buildings[name]["button"] = button
    })
  }

  showResearch() {
    const research = this.engine.addComponent(
      GAME_COMPONENT_NAMES.RESEARCH,
      "div",
      this.gameContainer.id
    )
    research.textContent = "Coming soon..."
  }

  showMarket() {
    const market = this.engine.addComponent(
      GAME_COMPONENT_NAMES.MARKET,
      "div",
      this.gameContainer.id
    )
    market.textContent = "Coming soon..."
  }

  createGameContainer() {
    this.gameContainer = this.engine.addComponent(
      GAME_COMPONENT_NAMES.CONTAINER,
      "div",
      this.container.id
    )
  }

  updateMeta() {
    const res = Object.entries(this.base.resources)
    if (res.length > 0) {
      this.inventory.innerHTML = ""
      const prefixSpan = document.createElement("span")
      prefixSpan.textContent = `Resources: `
      this.inventory.appendChild(prefixSpan)
      formatResourceListToStr(this.inventory, res)
    }
  }

  updateBuilding() {
    Object.entries(this.buildings).forEach(([name, components]) => {
      const buildingArgs = IDLE_BUILDING[name]
      if (!buildingArgs) {
        return
      }
      const built =
        this.base.buildings[name] || new IdleBuilding(...buildingArgs)

      components[
        "label"
      ].textContent = `${name} (${built.level} / ${built.materials.length})`
      this.getBuildingGenerateInfo(components["resourceGenerated"], built)
      this.getBuildingNextRequirement(
        components["nextLevelRequirements"],
        built,
        this.base.resources
      )
      if (built && built.buildStartTime) {
        const maxTime = built.getTimeRequiredToBuild()
        const now = new Date()
        const timeElapsed =
          (now.getTime() - built.buildStartTime.getTime()) / 1000
        components["progressBar"].style.width = `${(timeElapsed / maxTime) *
          100}%`
        components["button"].disabled = true
      } else {
        components["progressBar"].style.width = 0
        components["button"].disabled = built.level === built.materials.length
      }
    })
  }

  render() {
    switch (this.currentTab) {
      case TAB.META:
        this.updateMeta()
        break
      case TAB.BUILDING:
        this.updateBuilding()
        break
    }
  }

  create() {
    this.container = this.engine.addComponent(GAME_COMPONENT_NAMES.MAIN, "div")

    this.currentTab = TAB.META
    this.createTabs()
    this.createGameContainer()
    this.updateTab(this.currentTab)

    return this.container
  }
}
