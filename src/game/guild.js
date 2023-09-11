import { generateRandomName } from "./utils"

export default class Guild {
  static fromJson(json) {
    const guild = new Guild("", {})
    Object.assign(guild, json)
    return guild
  }

  constructor(id, settings) {
    this.name = `${generateRandomName()}-${id}`
    this.coins = settings.coins
    this.research = []
  }

  updateName(name, topbar) {
    this.name = name
    topbar.update()
  }

  removeCoins(coins, topbar) {
    if (coins > this.coins) {
      throw new Error("Insufficient coins")
    }

    this.coins -= coins
    topbar.update()
  }

  addCoins(coins, topbar) {
    this.coins += coins
    topbar.update()
  }
}
