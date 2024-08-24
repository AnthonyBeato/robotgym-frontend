import { useEffect, useState } from 'react';
import PropTypes from 'prop-types'; // ES6

const CountdownTimer = ({ endTime }) => {
    const calculateTimeLeft = () => {
      const difference = endTime - new Date();
      let timeLeft = {};
  
      if (difference > 0) {
        timeLeft = {
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      } else {
        timeLeft = { hours: 0, minutes: 0, seconds: 0 };
      }
  
      return timeLeft;
    };
  
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  
    useEffect(() => {
      const timer = setTimeout(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);
  
      return () => clearTimeout(timer);
    });
  
    const formatTime = (time) => String(time).padStart(2, '0');
  
    return (
      <div>
        <b>
            {formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
        </b>
      </div>
    );
  };
  
  CountdownTimer.propTypes = {
    endTime: PropTypes.instanceOf(Date).isRequired,
  };
  
  
  export default CountdownTimer;