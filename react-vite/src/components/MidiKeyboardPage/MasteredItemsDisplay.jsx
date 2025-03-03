
import { useSelector } from 'react-redux';
import { selectMasteredItems } from '../../redux/spacedRepetition';
import './MasteredItemsDisplay.css';

const MasteredItemsDisplay = () => {
  const masteredItems = useSelector(selectMasteredItems);

  if (!masteredItems || masteredItems.length === 0) {
    return null;
  }

  return (
    <div className="mastered-items-container">
      <h3>Mastered Items:</h3>
      <div className="mastered-items-list">
        {masteredItems.map((item, index) => (
          <span
            key={index}
            className="mastered-item"
            style={{ color: item.mastered ? 'red' : 'lightgrey' }}
          >
            {item.name}
          </span>
        ))}
      </div>
    </div>
  );
};

export default MasteredItemsDisplay;
