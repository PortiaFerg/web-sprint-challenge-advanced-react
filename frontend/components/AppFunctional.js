import React, {useState} from 'react'
import axios from 'axios'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

export default function AppFunctional(props) {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  const [message, setMessage] = useState(initialMessage);
  const [email, setEmail] = useState(initialEmail);
  const [steps, setSteps] = useState(initialSteps);
  const [index, setIndex] = useState(initialIndex);

  const getXY = () => {
    const x = (index % 3) + 1;
    const y = Math.floor(index / 3) + 1;
    return [x, y];
  };

  const getXYMessage = () => {
    const [x, y] = getXY();
    return `Coordinates (${x}, ${y})`;
  };

  const reset = () => {
    setMessage(initialMessage);
    setEmail(initialEmail);
    setSteps(initialSteps);
    setIndex(initialIndex);
  };

    const move = (evt) => {
    const direction = evt.target.id;
      const newIndex = getNextIndex(direction);
    if (newIndex !== index) {
      setIndex(newIndex);
      setSteps(steps + 1);
      setMessage('');
    } else {
      setMessage(`You can't go ${direction}`);
    }
    };
    const getNextIndex = (direction) => {
      const col = index % 3;
      const row = Math.floor(index / 3);
      if (direction === 'left' && col > 0) return index - 1;
      if (direction === 'right' && col < 2) return index + 1;
      if (direction === 'up' && row > 0) return index - 3;
      if (direction === 'down' && row < 2) return index + 3;
      return index;
    };

  const onChange = (evt) => {
    setEmail(evt.target.value);
  };

  const onSubmit = async (evt) => {
    evt.preventDefault();
    const [x, y] = getXY();
    const payload = { x, y, steps, email };

    try {
      const response = await axios.post('http://localhost:9000/api/result', payload);
      setMessage(response.data.message || 'Success!');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An error occurred';
      setMessage(errorMessage);
    }

    setEmail(initialEmail);
  };

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage()}</h3>
        <h3 id="steps">You moved {steps} time{steps === 1 ? '' : 's' }</h3>
      </div>
      <div id="grid">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
          <div key={idx}
            data-testid={`square-${idx}`}
            className={`square${idx === index ? ' active' : ''}`}>
            {idx === index ? 'B' : null}
          </div>
        ))}
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={move}>LEFT</button>
        <button id="up" onClick={move}>UP</button>
        <button id="right" onClick={move}>RIGHT</button>
        <button id="down" onClick={move}>DOWN</button>
        <button id="reset" onClick={reset}>reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input id="email" type="email" placeholder="type email" value={email} onChange={onChange} />
        <input id="submit" type="submit" />
      </form>
    </div>
  );
}
