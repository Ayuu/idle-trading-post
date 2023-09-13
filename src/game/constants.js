import Resource from "./resource"
import { Weapon, Armor, Shield } from "./equipment"
import { Building } from "./building"
import { Animal } from "./farm"

export const DIFFICULTY = {
  EASY: 1,
  MEDIUM: 2,
  HARD: 3
}

export const CLIMATE = {
  Temperate: 3,
  Tropical: 1,
  Arid: 2,
  Cold: 4,
  Mountain: 5
}

// emoji unicode per climate
export const CLIMATE_EMOJI = {
  [CLIMATE.Temperate]: "\u{1F331}",
  [CLIMATE.Tropical]: "\u{1F334}",
  [CLIMATE.Arid]: "\u{1F3DC}\u{FE0F}",
  [CLIMATE.Cold]: "\u{2744}\u{FE0F}",
  [CLIMATE.Mountain]: "\u{1F3D4}\u{FE0F}"
}

export const SETTINGS_PER_DIFFICULTY = {
  [DIFFICULTY.EASY]: {
    coins: 5000,
    resourceModifier: 2,
    protectionDuration: 10,
    baseCostPerClimate: {
      [CLIMATE.Temperate]: 2500,
      [CLIMATE.Tropical]: 2500,
      [CLIMATE.Arid]: 15000,
      [CLIMATE.Cold]: 20000,
      [CLIMATE.Mountain]: 25000
    }
  },
  [DIFFICULTY.MEDIUM]: {
    coins: 2500,
    resourceModifier: 1,
    protectionDuration: 5,
    baseCostPerClimate: {
      [CLIMATE.Temperate]: 2500,
      [CLIMATE.Tropical]: 2500,
      [CLIMATE.Arid]: 15000,
      [CLIMATE.Cold]: 20000,
      [CLIMATE.Mountain]: 25000
    }
  },
  [DIFFICULTY.HARD]: {
    coins: 1000,
    resourceModifier: 0.5,
    protectionDuration: 0,
    baseCostPerClimate: {
      [CLIMATE.Temperate]: 1000,
      [CLIMATE.Tropical]: 1000,
      [CLIMATE.Arid]: 1000,
      [CLIMATE.Cold]: 1000,
      [CLIMATE.Mountain]: 1000
    }
  }
}

export const REGION = {
  Europe: 1,
  Asia: 2,
  "Middle East": 3,
  Africa: 4
}

export const RESOURCE_TYPE = {
  wood: 1,
  stone: 2,
  iron: 3,
  copper: 4,
  hide: 5,
  leather: 6,
  silk: 7,
  rice: 8,
  gold: 9,
  wheat: 10,
  milk: 11
}

export const RESOURCE = {
  [RESOURCE_TYPE.wood]: new Resource("\u{1F332}", "wood", [1, 3], {
    climates: [CLIMATE.Temperate, CLIMATE.Cold]
  }),
  [RESOURCE_TYPE.leather]: new Resource("\u{1F9E4}", "leather", [1, 3]),
  [RESOURCE_TYPE.stone]: new Resource("\u{1F9F1}", "stone", [1, 3]),
  [RESOURCE_TYPE.iron]: new Resource("i", "iron", [1, 3]),
  [RESOURCE_TYPE.copper]: new Resource("c", "copper", [1, 3]),
  [RESOURCE_TYPE.gold]: new Resource("g", "gold", [1, 3]),
  [RESOURCE_TYPE.silk]: new Resource("s", "silk", [1, 3]),

  // animal product
  [RESOURCE_TYPE.wool]: new Resource("w", "wool", [1, 3]),
  [RESOURCE_TYPE.hide]: new Resource("h", "hide", [1, 3]),

  // 13th century food
  [RESOURCE_TYPE.rice]: new Resource("\u{1F35A}", "rice", [3, 5]),
  [RESOURCE_TYPE.wheat]: new Resource("\u{1F33E}", "wheat", [3, 5]),
  [RESOURCE_TYPE.milk]: new Resource("\u{1F95B}", "milk", [5, 10])
}

export const ANIMAL = {
  cow: new Animal(
    "cow",
    3 * 60,
    {
      [RESOURCE_TYPE.milk]: 1
    },
    {
      [RESOURCE_TYPE.meat]: 3,
      [RESOURCE_TYPE.hide]: 5
    }
  ),
  sheep: new Animal(
    "sheep",
    10 * 60,
    {
      [RESOURCE_TYPE.wool]: 3
    },
    {
      [RESOURCE_TYPE.meat]: 2,
      [RESOURCE_TYPE.hide]: 3
    }
  ),
  pig: new Animal(
    "pig",
    0,
    {},
    {
      [RESOURCE_TYPE.meat]: 1
    }
  )
}

export const IDLE_BUILDING = {}
const rawResources = [
  [RESOURCE_TYPE.wood, "Lumbermill"],
  [RESOURCE_TYPE.stone, "Stonemason"]
]
rawResources.forEach(([res, name]) => {
  IDLE_BUILDING[name] = [
    name,
    [
      {},
      {
        [RESOURCE_TYPE.wood]: 30
      },
      {
        [RESOURCE_TYPE.wood]: 60,
        [RESOURCE_TYPE.stone]: 30
      },
      {
        [RESOURCE_TYPE.wood]: 1000,
        [RESOURCE_TYPE.stone]: 1000
      },
      {
        [RESOURCE_TYPE.wood]: 2500,
        [RESOURCE_TYPE.stone]: 2500
      },
      {
        [RESOURCE_TYPE.wood]: 5000,
        [RESOURCE_TYPE.stone]: 5000
      },
      {
        [RESOURCE_TYPE.wood]: 10000,
        [RESOURCE_TYPE.stone]: 10000
      },
      {
        [RESOURCE_TYPE.wood]: 50000,
        [RESOURCE_TYPE.stone]: 50000
      }
    ],
    2,
    {
      [res]: 10
    },
    5
  ]
})

const basicResources = [
  [RESOURCE_TYPE.rice, "Rice Farm"],
  [RESOURCE_TYPE.wheat, "Wheat Farm"]
]
basicResources.forEach(([res, name]) => {
  IDLE_BUILDING[name] = [
    name,
    [
      {
        [RESOURCE_TYPE.wood]: 30,
        [RESOURCE_TYPE.stone]: 10
      },
      {
        [RESOURCE_TYPE.wood]: 120,
        [RESOURCE_TYPE.stone]: 90
      }
    ],
    10,
    {
      [res]: 50
    },
    30
  ]
})

export const BUILDING = {
  tannery: new Building(
    "tannery",
    {
      [RESOURCE_TYPE.wood]: 150,
      [RESOURCE_TYPE.stone]: 100
    },
    {
      [RESOURCE.leather]: 1
    },
    {
      [RESOURCE_TYPE.hide]: 3
    }
  )
}

export const EQUIPMENT = {
  woodSword: new Weapon("woodSword", 2, [[RESOURCE_TYPE.wood, 100]]),
  stoneSword: new Weapon("stoneSword", 2.5, [[RESOURCE_TYPE.stone, 100]]),
  goldSword: new Weapon("goldSword", 2, [[RESOURCE_TYPE.gold, 100]]),
  ironSword: new Weapon("ironSword", 3, [[RESOURCE_TYPE.iron, 100]]),

  leatherArmor: new Armor("leatherArmor", 0.28, [[RESOURCE_TYPE.leather, 75]]),
  goldArmor: new Armor("goldArmor", 0.44, [[RESOURCE_TYPE.gold, 75]]),
  ironArmor: new Armor("ironArmor", 0.6, [[RESOURCE_TYPE.silk, 75]]),

  woodShield: new Shield("woodShield", 0.02, [[RESOURCE_TYPE.wood, 25]]),
  stoneShield: new Shield("stoneShield", 0.06, [[RESOURCE_TYPE.stone, 25]]),
  goldShield: new Shield("goldShield", 0.11, [[RESOURCE_TYPE.gold, 25]]),
  ironShield: new Shield("ironShield", 0.2, [[RESOURCE_TYPE.iron, 25]])
}

// Spices were primarily grown in tropical regions of the world, where the climate is warm and humid.
// Silk was produced in regions of China and other parts of Asia where the climate was suitable for the growth of mulberry trees, which are the primary food source for silkworms.
// Gold was found in many parts of the world but was particularly abundant in West Africa.
// Jewels such as diamonds were found in India and other parts of Asia.
// Leather goods and animal skins were produced in many parts of the world but were particularly abundant in regions with large populations of livestock such as cattle and sheep.
// Luxury textiles such as silk and linen were produced in regions with suitable climates for growing the raw materials such as mulberry trees and flax plants.
// Unspun cotton was grown in warm climates such as India and other parts of Asia.
// Salt was produced in many parts of the world but was particularly abundant in regions with large salt deposits or saltwater lakes.
// Rice was grown in warm and wet climates such as Southeast Asia.
// Porcelain was produced in China where the climate was suitable for growing kaolin clay.
// Iron, steel, and other metals were found in many parts of the world but were particularly abundant in regions with large deposits of iron ore.
// Gunpowder was invented in China and its production required a variety of raw materials such as saltpeter, sulfur, and charcoal that could be found in many parts of the world.
// Paper was invented in China and its production required raw materials such as bamboo or rags that could be found in many parts of the world

export const COMPONENT_NAMES = {
  CONTAINER: "container",
  TOP: "topbar",
  NAVBAR: "navbar",
  LEFTBAR: "leftbar",

  CREATE_BASE: "create-base-container",

  GAME_MAIN: "game-main",

  // view for guild settings / research
  GUILD_SCR: "guild-scr",
  // view for base / stats
  BASE_SCR: "base-scr"
}
