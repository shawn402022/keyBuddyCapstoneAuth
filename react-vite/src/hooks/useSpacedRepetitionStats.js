import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectMasteredItems } from '../redux/spacedRepetition';

export function useSpacedRepetitionStats() {
  const masteredItems = useSelector(selectMasteredItems);
  const [stats, setStats] = useState({
    total: 0,
    mastered: 0,
    percentComplete: 0,
    averageTimeToMastery: 0
  });

  useEffect(() => {
    if (!masteredItems || masteredItems.length === 0) return;

    const total = masteredItems.length;
    const mastered = masteredItems.filter(item => item.mastered).length;
    const percentComplete = Math.round((mastered / total) * 100);

    setStats({
      total,
      mastered,
      percentComplete,
      averageTimeToMastery: 0 // You could calculate this if you track time data
    });
  }, [masteredItems]);

  return stats;
}
