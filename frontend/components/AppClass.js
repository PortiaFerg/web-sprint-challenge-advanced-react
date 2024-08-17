// ❗ OPTIONAL, not required to pass the sprint
// ❗ OPTIONAL, not required to pass the sprint
// ❗ OPTIONAL, not required to pass the sprint
import React from 'react'
import axios from 'axios'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

const initialState = {
  message: initialMessage,
  email: initialEmail,
  index: initialIndex,
  steps: initialSteps,
}

export default class AppClass extends React.Component {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  constructor(props) {
    super(props)
    this.state = initialState
  }

  getXY = () => {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    const { index } = this.state
    const x = (index % 3) + 1
    const y = Math.floor(index / 3) + 1
    return [x, y]
  }

  getXYMessage = () => {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
    const [x, y] = this.getXY()
    return `Coordinates (${x}, ${y})`
  }

  reset = () => {
    // Use this helper to reset all states to their initial values.
    this.setState(initialState)
  }

  getNextIndex = (direction) => {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    const { index } = this.state
    const col = index % 3
    const row = Math.floor(index / 3)

    if (direction === 'left' && col > 0) return index - 1
    if (direction === 'right' && col < 2) return index + 1
    if (direction === 'up' && row > 0) return index - 3
    if (direction === 'down' && row < 2) return index + 3
    return index
  }

  move = (evt) => {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    const direction = evt.target.id
    const nextIndex = this.getNextIndex(direction)
    if (nextIndex !== this.state.index) {
      this.setState({
        index: nextIndex,
        steps: this.state.steps + 1,
        message: ''
      })
    } else {
      this.setState({ message: `You can't go ${direction}` })
    }
  }

  onChange = (evt) => {
    // You will need this to update the value of the input.
    this.setState({ email: evt.target.value })
  }

  onSubmit = async (evt) => {
    evt.preventDefault()
    const [x, y] = this.getXY()
    const payload = { x, y, steps: this.state.steps, email: this.state.email }

    try {
      const response = await axios.post('http://localhost:9000/api/result', payload)
      this.setState({ message: response.data.message || 'Success!' })
    } catch (error) {
      this.setState({ message: error.response?.data?.message || 'An error occurred' })
    }

    this.setState({ email: initialEmail })
  }

  render() {
    return (
      <div id="wrapper" className={this.props.className}>
        <div className="info">
          <h3 id="coordinates">{this.getXYMessage()}</h3>
          <h3 id="steps">You moved {this.state.steps} time{this.state.steps === 1 ? '' : 's'}</h3>
        </div>
        <div id="grid">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === this.state.index ? ' active' : ''}`}>
              {idx === this.state.index ? 'B' : null}
            </div>
          ))}
        </div>
        <div className="info">
          <h3 id="message">{this.state.message}</h3>
        </div>
        <div id="keypad">
          <button id="left" onClick={this.move}>LEFT</button>
          <button id="up" onClick={this.move}>UP</button>
          <button id="right" onClick={this.move}>RIGHT</button>
          <button id="down" onClick={this.move}>DOWN</button>
          <button id="reset" onClick={this.reset}>reset</button>
        </div>
        <form onSubmit={this.onSubmit}>
          <input id="email" type="email" placeholder="type email" value={this.state.email} onChange={this.onChange}></input>
          <input id="submit" type="submit"></input>
        </form>
      </div>
    )
  }
}
