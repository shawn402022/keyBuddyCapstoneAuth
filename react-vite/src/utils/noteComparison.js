export const compareNotes = (playedNotes, targetNotes) => {
    if (!playedNotes || !targetNotes) return false;
    const playedSet = new Set(playedNotes.map(note => note.key));
    const targetSet = new Set(targetNotes);
    return playedSet.size === targetSet.size &&
           [...playedSet].every(note => targetSet.has(note));
};
