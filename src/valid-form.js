import {defaults} from './util'

// toggleInvalidClass

export function toggleInvalidClass (input, invalidClass) {
  input.addEventListener('invalid', function () {
    input.classList.add(invalidClass)
  })

  input.addEventListener('input', function () {
    if (input.validity.valid) {
      input.classList.remove(invalidClass)
    }
  })
}

// handleCustomMessages

const errorProps = [
  'badInput',
  'patternMismatch',
  'rangeOverflow',
  'rangeUnderflow',
  'stepMismatch',
  'tooLong',
  'tooShort',
  'typeMismatch',
  'valueMissing'
]

function getCustomMessage (input, customMessages) {
  customMessages = customMessages || {}
  const localErrorProps = [`${input.type}Mismatch`].concat(errorProps)
  const validity = input.validity

  for (let i = 0; i < localErrorProps.length; i++) {
    const prop = localErrorProps[i]
    if (validity[prop]) {
      return customMessages[prop] || input.getAttribute(`data-${prop}`)
    }
  }
}

export function handleCustomMessages (input, customMessages) {
  function checkValidity () {
    const message = input.validity.valid
      ? null
      : getCustomMessage(input, customMessages)
    input.setCustomValidity(message || '')
  }
  input.addEventListener('input', checkValidity)
  input.addEventListener('invalid', checkValidity)
}

// handleCustomMessageDisplay

export function handleCustomMessageDisplay (input, options) {
  function checkValidity (options) {
    const insertError = options.insertError
    const validationErrorClass = 'validation-error'
    const parentErrorClass = 'has-validation-error'

    const parent = input.parentNode
    const error = parent.querySelector(`.${validationErrorClass}`) || document.createElement('div')

    if (!input.validity.valid && input.validationMessage) {
      error.className = validationErrorClass
      error.textContent = input.validationMessage

      if (insertError) {
        parent.insertBefore(error, input)
        parent.classList.add(parentErrorClass)
      }
    } else {
      parent.classList.remove(parentErrorClass)
      error.remove()
    }
  }
  input.addEventListener('input', function () {
    // We can only update the error or hide it on input.
    // Otherwise it will show when typing.
    checkValidity({insertError: false})
  })
  input.addEventListener('invalid', function (e) {
    e.preventDefault()
    // We can also create the error in invalid.
    checkValidity({insertError: true})
  })
}

const defaultOptions = {
  invalidClass: 'invalid',
  customMessages: {},
  errorPlacement: 'before'
}

// validForm

export default function validForm (input, options) {
  options = defaults(options, defaultOptions)
  const {invalidClass, customMessages} = options
  toggleInvalidClass(input, invalidClass)
  handleCustomMessages(input, customMessages)
  handleCustomMessageDisplay(input, options)
}
