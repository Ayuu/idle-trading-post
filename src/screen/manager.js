import StorageManager, { MAX_SAVED_GAME } from "../storage_manager"
import GameEngine from "../game/engine"
import { Button, Row, Title } from "./utils"
import { COMPONENT_NAMES } from "../game/constants"

export default class ScreenManager {
  constructor(screenContainer) {
    this.screenContainer = screenContainer
  }

  showLanding() {
    this.clearScreen()

    const landingScreen = document.createElement("div")
    landingScreen.className = "landing-screen"

    const components = [
      new Title("Welcome to the Idle Merchant Guild"),
      new Button(
        "Load a game",
        () => this.showGames(),
        () => StorageManager.loadGames().length > 0
      ),
      new Button("Start a new game", () => this.loadGame())
      // new Button("Mute", () => this.toggleMute()),
    ]

    components.forEach(component => {
      if (component.shouldShow()) {
        landingScreen.appendChild(component.generate())
      }
    })

    this.screenContainer.appendChild(landingScreen)
  }

  showGames() {
    this.clearScreen()
    const loadGames = document.createElement("div")
    loadGames.className = "load-games-screen"

    const games = StorageManager.loadGames()

    const components = [
      new Title(`Load a game (${games.length} / ${MAX_SAVED_GAME})`)
    ]

    games.forEach(game => {
      components.push(
        new Row([
          new Button("\u{1F5D1}\u{FE0F}", () => {
            StorageManager.deleteSavedGame(game.id)
            this.showGames()
          }),
          new Button(
            `[${game.updatedAt.toJSON()}] ${game.data.guild.name}`,
            () => this.loadGame(game),
            () => true,
            true
          )
        ])
      )
    })

    components.push(new Button("Back", () => this.showLanding()))

    components.forEach(component => {
      if (component.shouldShow()) {
        loadGames.appendChild(component.generate())
      }
    })

    this.screenContainer.appendChild(loadGames)
  }

  showMenu() {
    this.clearScreen()
    const menuScreen = document.createElement("div")

    const title = new Title("Menu")
    const muteButton = new Button("Mute sound", () => this.toggleMute())
    const returnButton = new Button("Return to game", () => this.returnToGame())

    menuScreen.appendChild(title.generate())
    menuScreen.appendChild(muteButton.generate())
    menuScreen.appendChild(returnButton.generate())

    this.screenContainer.appendChild(menuScreen)
  }

  loadGame(json) {
    this.clearScreen()
    const gameScreen = document.createElement("div")
    gameScreen.id = COMPONENT_NAMES.CONTAINER
    this.screenContainer.appendChild(gameScreen)
    let engine
    if (json) {
      engine = GameEngine.fromJson(gameScreen, json)
    } else {
      engine = new GameEngine(gameScreen)
    }
    engine.start()
  }

  toggleMute() {
    // Code for toggling mute
    console.log("Toggling mute...")
  }

  returnToGame() {
    // Code for returning to the game from the menu
    console.log("Returning to the game...")
    // Transition back to the game screen
    this.showGame()
  }

  clearScreen() {
    this.screenContainer.innerHTML = ""
  }
}
