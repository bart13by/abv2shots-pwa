let drinks = [];
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
function clearDrinks()
{
  drinks = [];
  document.getElementById("calculate").value = 'Calculate';
  reDraw();
}
let justRan = false;
function calculateShots(button)
{
  if (justRan){
    return;
  }


  const inVolumeInput = document.getElementById("vol");
  const abvInput = document.getElementById("abv");
  const inUnits = document.getElementById("inUnits").value;
  const abv = abvInput.value;
  const inVolume = inVolumeInput.value;

  ;
  
  
  if (!inVolume || !abv) 
  	{ 
      console.log(`Empty: ${inVolume} :: ${abv}`)
  		return; 
	}
  const firstDrink = button.value === 'Calculate';
  
  
  justRan = true;
  const data = getShotsData(inVolume, abv, inUnits);
  data.inUnits = inUnits;
  data.abv = abv;
  drinks.push(data);
  reDraw();
  // prevent accidental repost, and reset the inputs
  setTimeout(() => {
    if (firstDrink) button.value = 'Add drink';
    inVolumeInput.value = '';
    abvInput.value = '';
    inVolumeInput.focus();
    justRan = false;
  }, 250);

}
function reDraw()
{
  
  let outputHTML = '';
  let totalsHTML = '';
  const totals = {
    numMlShots : 0, 
    numOzShots : 0
  }
  for (drink of drinks){  
    totals.numMlShots += parseFloat(drink.numMlShots);
    totals.numOzShots += parseFloat(drink.numOzShots);
    const volumeString = drink.inUnits === 'ml' ? 
        `${drink.mlVolume} ml (${drink.ozVolume} oz)`:
        `${drink.ozVolume} oz (${drink.mlVolume} ml) `;
    const alchoholVolumeString = inUnits === 'ml'?
        `${drink.mlAlcohol} ml (${drink.ozAlcohol} oz)`:
        `${drink.ozAlcohol} oz ( ${drink.mlAlcohol} ml)`;
  outputHTML += 
              `
              <div class="total_volume">${volumeString} of ${drink.abv} equals: </div>
              <div class="shots">
                <span class="shots_label">US shots (1.5 oz)</span><span class="shots_value"> ${drink.numOzShots} </span><br />
                <span class="shots_label">UK/EU shots (50 ml)</span><span class="shots_value"> ${drink.numMlShots} </span>
              </div>
              <div class="alc_volume">Volume of Alcohol: ${alchoholVolumeString}</div>
              <hr />
              `;    
  }
  
  if (drinks.length > 0){
     totalsHTML = `
              <div class="totals">
              <div class="totals_info">Total shots consumed</div>
                <span class="shots_label">US shots (1.5 oz)</span>
                <span class="shots_value"> ${totals.numOzShots.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                 </span><br />
                <span class="shots_label">UK/EU shots (50 ml)</span>
                <span class="shots_value"> ${totals.numMlShots.toLocaleString('en-US', { maximumFractionDigits: 2 })} 
                </span>
              </div>
    `; 
  } 
  document.getElementById("totals").innerHTML = totalsHTML;
  document.getElementById("output").innerHTML = outputHTML; 
}
  

