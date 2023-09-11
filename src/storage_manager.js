export const MAX_SAVED_GAME = 5
const STORAGE_KEY = "YXl1dS1qc3Ezaw=="

const hashCode = (s) => {
  const encrypt = btoa(JSON.stringify(s))
  let hash = 0
  for (let i = 0; i < encrypt.length; i++) {
    hash = (hash << 5) - hash + encrypt.charCodeAt(i)
  }
  return hash
}

const toLocalStorage = (s) => {
  s.sort((a, b) => b.updatedAt - a.updatedAt)
  localStorage.setItem(STORAGE_KEY, btoa(JSON.stringify(s)))
}

export default class StorageManager {
  static saveGame(id, data) {
    // Get the existing game list from localStorage or initialize it as an empty array
    const gameList = StorageManager.loadGames()

    // Check if the id already exists in the game list
    const existingGameIndex = gameList.findIndex((game) => game.id === id)
    const updatedAt = new Date()
    const gameData = { id, data, updatedAt }
    gameData.hash = hashCode(gameData)
    if (existingGameIndex !== -1) {
      gameList[existingGameIndex].updatedAt = updatedAt
      gameList[existingGameIndex].data = data
      gameList[existingGameIndex].hash = gameData.hash
      console.log(`Game ${id} updated successfully.`)
    } else {
      while (gameList.length >= MAX_SAVED_GAME) {
        gameList.pop()
      }
      gameList.push(gameData)
      console.log(`Game ${id} saved successfully.`)
    }
    toLocalStorage(gameList)
  }

  static loadGames() {
    const s = localStorage.getItem(STORAGE_KEY)
    if (!s) {
      return []
    }
    let gameList = JSON.parse(atob(s)).map((game) => ({
      ...game,
      updatedAt: new Date(game.updatedAt),
    }))
    gameList = gameList.filter(({ hash, ...game }) => {
      const valid = hashCode(game) === hash
      if (!valid) {
        console.log(`Invalid game data for game ${game.id}.`)
      }
      return valid
    })
    return gameList
  }

  static deleteSavedGame(gameId) {
    // Get the game list from localStorage
    const gameList = StorageManager.loadGames()

    // Find the game with the specified gameId in the game list
    const gameIndex = gameList.findIndex((game) => game.id === gameId)

    if (gameIndex !== -1) {
      // Remove the game from the game list
      gameList.splice(gameIndex, 1)
      console.log(`Saved game data deleted for game ${gameId}.`)
      toLocalStorage(gameList)
    } else {
      console.log(`No saved game data found for game ${gameId}.`)
    }
  }
}
