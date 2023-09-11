import Base from "./base"
import GameDisplay from "./components/base_screen/game_display"
import GuildDisplay from "./components/guild_display"
import { LEFT_COMPONENT_NAMES } from "./components/base_screen/left_bar"
import NavBar from "./components/nav_bar"
import {
  COMPONENT_NAMES,
  DIFFICULTY,
  SETTINGS_PER_DIFFICULTY,
} from "./constants"
import Guild from "./guild"
import TopBar from "./components/top_bar"
import StorageManager from "../storage_manager"

export default class GameEngine {
  static fromJson(container, json) {
    const { guild, bases, difficulty, ...gameState } = json.data
    const gameEngine = new GameEngine(container, difficulty)
    Object.assign(gameEngine.gameState, gameState)
    gameEngine.id = json.id
    // Instantiate buildings
    gameEngine.gameState.bases = {}
    for (const [key, value] of Object.entries(bases)) {
      gameEngine.gameState.bases[key] = Base.fromJson(value)
    }
    gameEngine.gameState.guild = Guild.fromJson(guild)

    gameEngine.gameState.createdAt = new Date(gameState.createdAt)
    gameEngine.gameState.lastSync = new Date(gameState.lastSync)
    return gameEngine
  }

  constructor(container, difficulty = DIFFICULTY.EASY) {
    const settings = SETTINGS_PER_DIFFICULTY[difficulty]
    this.id = Math.floor(Date.now() / 1000)
    this.gameState = {
      difficulty,
      settings,
      bases: {
        [LEFT_COMPONENT_NAMES.CREATE_BASE]: undefined,
      },
      guild: new Guild(this.id, settings),
      currentBase: LEFT_COMPONENT_NAMES.CREATE_BASE,
      createdAt: new Date(),
      lastSync: new Date(),
    }
    this.timeElapsed = 0
    this.components = { container }
  }

  addComponent(componentId, componentType, parentComponent) {
    const component = document.createElement(componentType)
    component.id = componentId
    this.components[componentId] = component
    if (parentComponent) {
      this.components[parentComponent].appendChild(component)
    }
    return component
  }

  createNewBase(name, climate, region) {
    const cost = this.gameState.settings.baseCostPerClimate[climate]
    this.gameState.guild.removeCoins(cost, this.topbar)
    const newBase = new Base(
      climate,
      name,
      region,
      this.gameState.settings.protectionDuration
    )
    this.gameState.bases[newBase.id] = newBase
    this.gameDisplay.addBase(newBase)
  }

  updateGame() {
    const now = new Date()
    // compute time elapsed since lastSync
    const timeElapsed = now.getTime() - this.gameState.lastSync.getTime()
    this.timeElapsed += timeElapsed

    for (const base of Object.values(this.gameState.bases)) {
      base && base.update && base.update(timeElapsed)
    }

    // save to local storage every 5 seconds
    if (this.timeElapsed > 5000) {
      this.timeElapsed = 0
      StorageManager.saveGame(this.id, this.gameState)
    }
    this.gameState.lastSync = now
  }

  renderGameState() {
    // this.topbar.render()
    // this.navbar.render()
    // this.guildDisplay.render()
    this.gameDisplay.render()
  }

  switchScreen(screen) {
    switch (screen) {
      case COMPONENT_NAMES.GUILD_SCR:
        this.gameDisplay.remove()
        this.guildDisplay.create()
        break
      case COMPONENT_NAMES.BASE_SCR:
        this.guildDisplay.remove()
        this.gameDisplay.create()
        break
      default:
        break
    }
  }

  start() {
    this.topbar = new TopBar(this)
    this.navbar = new NavBar(this)
    this.guildDisplay = new GuildDisplay(this)
    this.gameDisplay = new GameDisplay(this)

    // top bar
    this.topbar.create()
    // middle section display
    this.addComponent(
      COMPONENT_NAMES.GAME_MAIN,
      "div",
      COMPONENT_NAMES.CONTAINER
    )
    this.gameDisplay.create()
    // bottom bar
    this.navbar.create()

    // Start the game loop
    setInterval(() => {
      this.updateGame()
      this.renderGameState()
    }, 1000 / 60) // Adjust the frame rate as needed
  }
}
