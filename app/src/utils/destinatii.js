// transformare: doar numele orașelor
export const getOrase = (list) => list.map((d) => d.oras)

// selectare: destinațiile nevizitate
export const getNevizitate = (list) => list.filter((d) => !d.vizitat)

// agregare: suma zilelor
export const totalZile = (list) =>
  list.reduce((total, d) => total + d.zile, 0)

// un rând de text pentru o singură destinație
export const formatDestinatie = ({ oras, tara, zile, vizitat }) =>
  `${vizitat ? '[x]' : '[ ]'} ${oras}, ${tara} (${zile} zile)`

// grupare: câte destinații are fiecare țară
export const numarPeTara = (list) =>
  list.reduce((acc, { tara }) =>
    ({ ...acc, [tara]: (acc[tara] ?? 0) + 1 }), {})

// sortare descrescătoare după zile, pe o copie a listei
export const sortDupaZile = (list) =>
  [...list].sort((a, b) => b.zile - a.zile)
