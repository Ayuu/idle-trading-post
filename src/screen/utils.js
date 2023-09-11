class Component {
  constructor() {
    this.shouldShow = this.shouldShow.bind(this)
  }

  shouldShow() {
    return true
  }
}

export class Button extends Component {
  constructor(text, onClick, shouldShow, expand) {
    super()
    this.text = text
    this.onClick = onClick
    if (shouldShow) {
      this.shouldShow = shouldShow
    }
    this.expand = expand
  }

  generate() {
    if (!this.shouldShow()) {
      return
    }

    const button = document.createElement("button")
    button.textContent = this.text
    button.classList.add("btn", "btn-menu")
    if (this.expand) {
      button.classList.add("expand")
    }

    button.onclick = this.onClick

    return button
  }
}

export class Row extends Component {
  constructor(components) {
    super()
    this.components = components
  }

  generate() {
    const container = document.createElement("div")
    container.classList.add("cb-row")

    for (const component of this.components) {
      const generatedComponents = component.generate()
      if (generatedComponents) {
        container.appendChild(generatedComponents)
      }
    }

    return container
  }
}

export class Title extends Component {
  constructor(text) {
    super()
    this.text = text
  }

  generate() {
    const title = document.createElement("h1")
    title.textContent = this.text

    return title
  }
}

export class GameDropdown extends Component {
  constructor(componentId, options, extras = {}) {
    super()
    this.id = componentId
    this.options = options
    const { placeholder, onChange } = extras
    this.placeholder = placeholder
    this.onChange = onChange
  }

  generate() {
    const dropdown = document.createElement("select")
    dropdown.id = this.id

    const placeholderOption = document.createElement("option")
    placeholderOption.disabled = true
    placeholderOption.selected = true
    placeholderOption.textContent = this.placeholder
    dropdown.appendChild(placeholderOption)
    dropdown.onchange = this.onChange

    this.options.forEach((option) => {
      const optionElement = document.createElement("option")
      optionElement.value = option.value
      optionElement.textContent = option.text
      dropdown.appendChild(optionElement)
    })

    return dropdown
  }
}
