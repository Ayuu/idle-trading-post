export const defaultdict = defaultValue => {
  const target = {}

  const proxy = new Proxy(target, {
    get: (target, prop) => {
      if (!(prop in target)) {
        target[prop] =
          typeof defaultValue === "function" ? defaultValue() : defaultValue
      }
      return target[prop]
    }
  })

  target.toJSON = function() {
    return { ...this }
  }

  return proxy
}

// generate float between min and max
export const randomFloat = (min, max) => {
  const random = Math.random() * (max - min) + min
  return parseFloat(random.toFixed(6))
}

// generate random location x and y coordinates for a base
// latitude is between -90 and 90
// longitude is between -180 and 180
export const generateLocation = () => {
  return {
    y: randomFloat(-90, 90),
    x: randomFloat(-180, 180)
  }
}

export const generateRandomName = () => {
  const length = Math.floor(Math.random() * 8) + 3
  let name = ""
  const characters = "abcdefghijklmnopqrstuvwxyz"

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    const randomChar = characters.charAt(randomIndex)
    name += randomChar
  }

  return name
}

export const formatTime = seconds => {
  const time = {
    d: Math.floor(seconds / (24 * 3600)),
    h: Math.floor((seconds % (24 * 3600)) / 3600),
    m: Math.floor((seconds % 3600) / 60),
    s: seconds % 60
  }

  return Object.entries(time)
    .filter(([unit, value]) => value > 0)
    .map(([unit, value]) => `${value}${unit}`)
    .join(" ")
}

export const formatScientificNotation = number => {
  if (number < 1000) {
    return number
  }

  const suffixes = [
    "",
    "k",
    "M",
    "B",
    "T",
    "Q",
    "Qu",
    "S",
    "Se",
    "O",
    "N",
    "D",
    "Ud",
    "Dd",
    "Td",
    "Qd",
    "Qid",
    "Sd",
    "Spd",
    "Od",
    "Nd",
    "V",
    "Uv",
    "Dv",
    "Tv",
    "Tt",
    "Qit",
    "Sit",
    "Sp",
    "O",
    "No",
    "C",
    "Uc",
    "Dc",
    "Tc",
    "Qic",
    "Sic",
    "Sc",
    "Oc",
    "Noc",
    "Ic",
    "U",
    "Du",
    "Tu",
    "Qua",
    "Qi",
    "Si",
    "Se",
    "Oc",
    "No",
    "Vi",
    "Uvi",
    "Dvi",
    "Ti",
    "Tt",
    "Qit",
    "S",
    "Sp",
    "O",
    "No",
    "C",
    "Uc",
    "Dc",
    "Tc",
    "Qic",
    "Sic",
    "Ct",
    "Oc",
    "Noc",
    "Ic",
    "U",
    "Du",
    "Tu",
    "Qua",
    "Qi",
    "Si",
    "S",
    "O",
    "No",
    "V",
    "Uv",
    "Dv",
    "Tv",
    "Tt",
    "Qit",
    "Si",
    "Sp",
    "Oc",
    "Noc",
    "Ic",
    "U",
    "Du",
    "Tu",
    "Qua",
    "Qi",
    "Si"
  ]

  const absNumber = Math.abs(number)
  const sign = Math.sign(number)
  const magnitude = Math.floor(Math.log10(absNumber) / 3)
  const scaledNumber = absNumber / Math.pow(10, magnitude * 3)
  const formattedNumber = scaledNumber.toFixed(3)

  return sign * formattedNumber + suffixes[magnitude]
}
