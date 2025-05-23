const chordDefinitionsE = [

    {
        "E,B": "E5",
        "E,A,B#,D#": "EM7#5sus4",
        "E,A,B#,D": "E7#5sus4",
        "E,A,B": "Esus4",
        "E,A,B,D#": "EM7sus4",
        "E,A,B,D": "E7sus4",
        "E,G#,D": "E7no5",
        "E,G#,B#": "Eaug",
        "E,G#,C,D#": "EM7b6",
        "E,G#,B#,D#": "Emaj7#5",
        "E,G#,B#,D": "E7#5",
        "E,G#,D,C": "E7b13",
        "E,G#,B": "EM",
        "E,G#,B,D#": "Emaj7",
        "E,G#,B,D": "E7",
        "E,G#,B,C#": "E6",
        "E,G#,B,D,C#": "E7add6",
        "E,G#,B,C,D": "E7b6",
        "E,G#,Bb": "EMb5",
        "E,G#,Bb,D#": "EM7b5",
        "E,G#,Bb,D": "E7b5",
        "E,G#,B,D#,A#": "Emaj#4",
        "E,G#,B,D,A#": "E7#11",
        "E,G#,B,C#,A#": "EM6#11",
        "E,G#,B,D,A#,C": "E7#11b13",
        "E,G,B#": "Em#5",
        "E,G,C,D#": "Emb6M7",
        "E,G,C,D": "Em7#5",
        "E,G,B": "Em",
        "E,G,B,D#": "Em/ma7",
        "E,G,B,D": "Em7",
        "E,G,B,C#": "Em6",
        "E,G,B,C,D#": "EmMaj7b6",
        "E,G,Bb": "Edim",
        "E,G,Bb,D#": "EoM7",
        "E,G,Bb,D": "Em7b5",
        "E,G,Bb,Db": "Edim7",
        "E,G,Bb,C#,D#": "Eo7M7",
        "E,A,D,G": "E4",
        "E,G,A,B": "Emadd4",
        "E,G,B,D,A": "Em7add11",
        "E,G#,B#,F##": "E+add#9",
        "E,G#,B#,D,F##": "E7#5#9",
        "E,G#,B,D,F##": "E7#9",
        "E,G#,B,D,F##,C#": "E13#9",
        "E,G#,B,D,F##,C": "E7#9b13",
        "E,G#,B,D#,F##,A#": "Emaj7#9#11",
        "E,G#,B,D,F##,A#": "E7#9#11",
        "E,G#,B,D,F##,A#,C#": "E13#9#11",
        "E,G#,B,D,F##,A#,C": "E7#9#11b13",
        "E,F#,B": "Esus2",
        "E,A,B#,D#,F#": "EM9#5sus4",
        "E,F#,A,B": "Esus24",
        "E,A,B,D#,F#": "EM9sus4",
        "E,B,D,F#,A": "E11",
        "E,A,B,D,F#": "Eb9sus",
        "E,A,B,D,F#,C#": "E13sus4",
        "E,G#,D,F#": "E9no5",
        "E,G#,D,F#,C#": "E13no5",
        "E,G#,B#,F#": "EM#5add9",
        "E,G#,B#,D#,F#": "Emaj9#5",
        "E,G#,B#,D,F#": "E9#5",
        "E,G#,D,F#,C": "E9b13",
        "E,G#,B,F#": "EMadd9",
        "E,G#,B,D#,F#": "Emaj9",
        "E,G#,B,D,F#": "E9",
        "E,G#,B,C#,F#": "E6add9",
        "E,G#,B,D#,F#,C#": "Emaj13",
        "E,G#,B,C#,D#,F#": "EM7add13",
        "E,G#,B,D,F#,C#": "E13",
        "E,G#,Bb,D#,F#": "EM9b5",
        "E,G#,Bb,D,F#": "E9b5",
        "E,G#,Bb,C#,D,F#": "E13b5",
        "E,G#,B#,D,F#,A#": "E9#5#11",
        "E,G#,B,D#,F#,A#": "Emaj9#11",
        "E,G#,B,D,F#,A#": "E9#11",
        "E,G#,B,C#,F#,A#": "E69#11",
        "E,G#,B,D#,F#,A#,C#": "EM13#11",
        "E,G#,B,D,F#,A#,C#": "E13#11",
        "E,G#,B,D,F#,A#,C": "E9#11b13",
        "E,G,C,D,F#": "Em9#5",
        "E,G,B,F#": "Emadd9",
        "E,G,B,D#,F#": "EmM9",
        "E,G,B,D,F#": "Em9",
        "E,G,B,C#,F#": "Em69",
        "E,G,B,D,F#,C#": "Em13",
        "E,G,B,C,D#,F#": "EmMaj9b6",
        "E,F#,G,Bb,D": "Em9b5",
        "E,G,B#,D,F#,A": "Em11A",
        "E,G,B,D,F#,A": "Em11",
        "E,B,D,F,A": "E11b9",
        "E,A,B,D,F,C": "E7sus4b9b13",
        "E,G#,D,F": "Ealt7",
        "E,G#,B#,D,F": "E7#5b9",
        "E,G#,B,F": "EMaddb9",
        "E,G#,B,D#,F": "EM7b9",
        "E,G#,B,D,F": "E7b9",
        "E,G#,B,D,F,C#": "E13b9",
        "E,G#,B,D,F,C": "E7b9b13",
    },

    {
        "Eb,Bb": "Eb5",
        "Eb,Ab,B,D": "EbM7#5sus4",
        "Eb,Ab,B,Db": "Eb7#5sus4",
        "Eb,Ab,Bb": "Ebsus4",
        "Eb,Ab,Bb,D": "EbM7sus4",
        "Eb,Ab,Bb,Db": "Eb7sus4",
        "Eb,G,Db": "Eb7no5",
        "Eb,G,B": "Ebaug",
        "Eb,G,Cb,D": "EbM7b6",
        "Eb,G,B,D": "Ebmaj7#5",
        "Eb,G,B,Db": "Eb7#5",
        "Eb,G,Db,Cb": "Eb7b13",
        "Eb,G,Bb": "EbM",
        "Eb,G,Bb,D": "Ebmaj7",
        "Eb,G,Bb,Db": "Eb7",
        "Eb,G,Bb,C": "Eb6",
        "Eb,G,Bb,Db,C": "Eb7add6",
        "Eb,G,Bb,Cb,Db": "Eb7b6",
        "Eb,G,Bbb": "EbMb5",
        "Eb,G,Bbb,D": "EbM7b5",
        "Eb,G,Bbb,Db": "Eb7b5",
        "Eb,G,Bb,D,A": "Ebmaj#4",
        "Eb,G,Bb,Db,A": "Eb7#11",
        "Eb,G,Bb,C,A": "EbM6#11",
        "Eb,G,Bb,Db,A,Cb": "Eb7#11b13",
        "Eb,Gb,B": "Ebm#5",
        "Eb,Gb,Cb,D": "Ebmb6M7",
        "Eb,Gb,Cb,Db": "Ebm7#5",
        "Eb,Gb,Bb": "Ebm",
        "Eb,Gb,Bb,D": "Ebm/ma7",
        "Eb,Gb,Bb,Db": "Ebm7",
        "Eb,Gb,Bb,C": "Ebm6",
        "Eb,Gb,Bb,Cb,D": "EbmMaj7b6",
        "Eb,Gb,Bbb": "Ebdim",
        "Eb,Gb,Bbb,D": "EboM7",
        "Eb,Gb,Bbb,Db": "Ebm7b5",
        "Eb,Gb,Bbb,Dbb": "Ebdim7",
        "Eb,Gb,Bbb,C,D": "Ebo7M7",
        "Eb,Ab,Db,Gb": "Eb4",
        "Eb,Gb,Ab,Bb": "Ebmadd4",
        "Eb,Gb,Bb,Db,Ab": "Ebm7add11",
        "Eb,G,B,F#": "Eb+add#9",
        "Eb,G,B,Db,F#": "Eb7#5#9",
        "Eb,G,Bb,Db,F#": "Eb7#9",
        "Eb,G,Bb,Db,F#,C": "Eb13#9",
        "Eb,G,Bb,Db,F#,Cb": "Eb7#9b13",
        "Eb,G,Bb,D,F#,A": "Ebmaj7#9#11",
        "Eb,G,Bb,Db,F#,A": "Eb7#9#11",
        "Eb,G,Bb,Db,F#,A,C": "Eb13#9#11",
        "Eb,G,Bb,Db,F#,A,Cb": "Eb7#9#11b13",
        "Eb,F,Bb": "Ebsus2",
        "Eb,Ab,B,D,F": "EbM9#5sus4",
        "Eb,F,Ab,Bb": "Ebsus24",
        "Eb,Ab,Bb,D,F": "EbM9sus4",
        "Eb,Bb,Db,F,Ab": "Eb11",
        "Eb,Ab,Bb,Db,F": "Ebb9sus",
        "Eb,Ab,Bb,Db,F,C": "Eb13sus4",
        "Eb,G,Db,F": "Eb9no5",
        "Eb,G,Db,F,C": "Eb13no5",
        "Eb,G,B,F": "EbM#5add9",
        "Eb,G,B,D,F": "Ebmaj9#5",
        "Eb,G,B,Db,F": "Eb9#5",
        "Eb,G,Db,F,Cb": "Eb9b13",
        "Eb,G,Bb,F": "EbMadd9",
        "Eb,G,Bb,D,F": "Ebmaj9",
        "Eb,G,Bb,Db,F": "Eb9",
        "Eb,G,Bb,C,F": "Eb6add9",
        "Eb,G,Bb,D,F,C": "Ebmaj13",
        "Eb,G,Bb,C,D,F": "EbM7add13",
        "Eb,G,Bb,Db,F,C": "Eb13",
        "Eb,G,Bbb,D,F": "EbM9b5",
        "Eb,G,Bbb,Db,F": "Eb9b5",
        "Eb,G,Bbb,C,Db,F": "Eb13b5",
        "Eb,G,B,Db,F,A": "Eb9#5#11",
        "Eb,G,Bb,D,F,A": "Ebmaj9#11",
        "Eb,G,Bb,Db,F,A": "Eb9#11",
        "Eb,G,Bb,C,F,A": "Eb69#11",
        "Eb,G,Bb,D,F,A,C": "EbM13#11",
        "Eb,G,Bb,Db,F,A,C": "Eb13#11",
        "Eb,G,Bb,Db,F,A,Cb": "Eb9#11b13",
        "Eb,Gb,Cb,Db,F": "Ebm9#5",
        "Eb,Gb,Bb,F": "Ebmadd9",
        "Eb,Gb,Bb,D,F": "EbmM9",
        "Eb,Gb,Bb,Db,F": "Ebm9",
        "Eb,Gb,Bb,C,F": "Ebm69",
        "Eb,Gb,Bb,Db,F,C": "Ebm13",
        "Eb,Gb,Bb,Cb,D,F": "EbmMaj9b6",
        "Eb,F,Gb,Bbb,Db": "Ebm9b5",
        "Eb,Gb,B,Db,F,Ab": "Ebm11A",
        "Eb,Gb,Bb,Db,F,Ab": "Ebm11",
        "Eb,Bb,Db,Fb,Ab": "Eb11b9",
        "Eb,Ab,Bb,Db,Fb,Cb": "Eb7sus4b9b13",
        "Eb,G,Db,Fb": "Ebalt7",
        "Eb,G,B,Db,Fb": "Eb7#5b9",
        "Eb,G,Bb,Fb": "EbMaddb9",
        "Eb,G,Bb,D,Fb": "EbM7b9",
        "Eb,G,Bb,Db,Fb": "Eb7b9",
        "Eb,G,Bb,Db,Fb,C": "Eb13b9",
        "Eb,G,Bb,Db,Fb,Cb": "Eb7b9b13",
    }

]

export default chordDefinitionsE
