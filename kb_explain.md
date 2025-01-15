# KEYBUDDY SCHEMA

## Design
Keybuddy is an companion to kids taking traditional music lessons.
it works by testing you on various aspects of chords, and scales.
it will ask you to play a certain chord,  or a certain scale,  and you have to click the on screen piano keys with your mouse,  or you can play it with a midi keyboard.


## Functionality
>[!NOTE] tables are in highlighted in all caps

`USER`  creates a `COURSE`, each `COURSE` is made out of 1 to 4 `LESSONS` selected by the user based on what they want to learn
- Each `LESSON` has
    - a type field ( indicating wether the lesson/test is on  chords, scales or notes)
    - a key field which is connected to the 'KEY' table. 'KEY' table consists of every playable key/notes in an octave so theres  12)
        - I think omitting that'KEY' table and hardcoding that data may be a better option
    - a songs field that connects to the 'SONGS' table. this table has a key field indicating what key the  given song is.    so through this table you can listen to a song in the key your lesson is in.
    - a chords` field that connects to the `CHORDS` table. this table has a field for chord name and will contain all possible chords.  so Through the lesson I would like the user to be able to see all the chords that are in the key of his lesson.
    - a progression field thats connected to a 'PROGRESSION' table.  this table has a field for progression name, (and possibly style  indicating the style of the progression.. jazz rock etc.)  the progressions is a music theory numbering system in the format 1-4-3-5,, or I-IV-iii-V,  and is used when your transposing notes.   progressions can be applied to any piece of music as the numbering system is universal.  So Through  the lessons table if the user picks a 1-3-4-6 progression and his lesson is in the key of C,  then it should spot out a progression of C-E-Db-F as those notes correspond to those numbers in that key.


>[!NOTE] Alot of these conversions can be done on the front end via  web midi api called tonal.js.. im not sure how to do this. but the api literally does the conversions for you through different methods.
https://github.com/tonaljs/tonal/tree/main/packages/scale
https://github.com/tonaljs/tonal/tree/main/packages/chord
https://github.com/tonaljs/tonal/tree/main/packages/progression


I am going to attach a schema image so you can see how i joined everything  its all many to many.  and ths whats giving me the most problems.  so for the sake of time if we can simplify and omit where we can that would be great.


but through the `KEY`, `SONGS`, `CHORDS` AND `PROGRESSION` table I did want the user to be able to  choose lessons based on  a certain key, song, progression, or chord.

as I said before though.  for the sake of simplicity maybe we can remove it. I still have to do my front end and deploy to render so Im sure Im going to run into more issues.
