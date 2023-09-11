import ScreenManager from "./screen/manager"

// Initial screen generation
const screenManager = new ScreenManager(
  document.getElementById("screen-container")
)
screenManager.showLanding()
