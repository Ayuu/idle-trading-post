export const defaultdict = (defaultValue) => {
  const target = {}

  const proxy = new Proxy(target, {
    get: (target, prop) => {
      if (!(prop in target)) {
        target[prop] =
          typeof defaultValue === "function" ? defaultValue() : defaultValue
      }
      return target[prop]
    },
  })

  target.toJSON = function () {
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
    x: randomFloat(-180, 180),
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
