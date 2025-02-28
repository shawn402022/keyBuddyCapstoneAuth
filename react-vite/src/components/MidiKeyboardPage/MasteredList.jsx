
import './MasteredList.css';

const MasteredList = ({ items }) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="mastered-list">
      <div className="mastered-title">Learning Progress:</div>
      {items.map((item, index) => (
        <div
          key={index}
          className={`mastered-item ${item.color}`}
          style={{ color: item.color }}
        >
          {item.name}
        </div>
      ))}
    </div>
  );
};

export default MasteredList;
