function getShotsData(inVolume = 0, abv_arg = 0, inUnits='oz'){
  if (inVolume <= 0 || abv_arg <= 0) { 
      console.error("Volume and ABV must have positive values.");
      return; 
  }
  if (!['ml','oz'].includes(inUnits)){
    console.error(`Units must be ml or oz; you sent ${inUnits}.`);
    return;
  }
  const abv = abv_arg / 100;
  const ozToMl = 29.57;
  const mlShotVolume = 20;
  const ozShotVolume = .6;
  const mlVolume = inUnits === "ml" ? inVolume : inVolume * ozToMl;
  const ozVolume = inUnits === "oz" ? inVolume : inVolume / ozToMl;
  const mlAlcohol = abv * mlVolume;
  const ozAlcohol = abv * ozVolume;
  const ozShots = ozAlcohol / ozShotVolume;
  const mlShots = mlAlcohol / mlShotVolume;
  // ChatGPT gave me this refactor :-)
  return Object.fromEntries( Object.entries({
      'mlVolume': mlVolume,
      'ozVolume': ozVolume,
      'mlAlcohol': mlAlcohol,
      'ozAlcohol': ozAlcohol,
      'numOzShots': ozShots,
      'numMlShots': mlShots
      })
    .map(([key, value]) => 
      [key, value.toLocaleString('en-US', { maximumFractionDigits: 2 })]
      ));
}

function calculateShots()
{
  let inUnits = document.getElementById("inUnits").value;
  let inVolume = document.getElementById("vol").value;
  let abv = document.getElementById("abv").value;
  if (inVolume == 0 || abv == 0) 
  	{ 
  		return; 
	}
  const data = getShotsData(inVolume, abv, inUnits);
  const volumeString = inUnits === 'ml' ? 
    `${data.mlVolume} ml (${data.ozVolume} oz)`:
    `${data.ozVolume} oz (${data.mlVolume} ml) `;
  const alchoholVolumeString = inUnits === 'ml'?
    `${data.mlAlcohol} ml (${data.ozAlcohol} oz)`:
    `${data.ozAlcohol} oz ( ${data.mlAlcohol} ml)`;
  const outputDiv = document.getElementById("output");
  outputDiv.innerHTML = 
              `
              <div class="shots">
                <span class="shots_label">US shots (1.5 oz)</span><span class="shots_value"> ${data.numOzShots} </span><br />
                <span class="shots_label">UK/EU shots (50 ml)</span><span class="shots_value"> ${data.numMlShots} </span>
              </div>
              <div class="total_volume">Total Volume: ${volumeString}</div>
              <div class="alc_volume">Volume of Alcohol: ${alchoholVolumeString}</div>
`;

}