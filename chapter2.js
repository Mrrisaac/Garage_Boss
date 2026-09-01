// Garage Boss Chapter 2: The United Nations Is Coming
// Loaded after game.js and extends the original engine without removing Chapter 1.

const CH2_CASES={
  closures:'The Street Closure Shuffle',
  diplomat:'The Diplomat SUV',
  barricade:'The Barricade Problem',
  rates:'Event Rate Rush',
  validation:'The Ambassador Validation',
  gridlock:'The Gridlocked Entrance',
  press:'The Press Van Cable',
  overflow:'Operation Overflow'
};
const CH2_ACH={
  unready:'UN-Ready',
  diplomat:'Diplomatic Immunity-ish',
  barricade:'Do Not Move The Barricade',
  eventrate:'Rate Sheet Warrior',
  validator:'Stamped and Delivered',
  traffic:'Gridlock Tamer',
  press:'Breaking News, Working Outlet',
  overflow:'No Space Left Behind',
  unlegend:'Commander of Midtown'
};
const CH2_LOC={
  hq2:{name:'Garage Division Command Center',cls:'office',open:true,travel:0,props:['desk','monitor','phone'],intro:['CHRISTINE','UN week. Midtown is already making noises I do not like.'],hot:[['monitor','Street Closure Map',14,31,25,31],['desk','UN Prep Desk',7,62,52,27],['phone','Command Phone',42,47,13,18]]},
  east44:{name:'East 44th Street Garage',cls:'emerald',open:true,travel:9,props:['garage-door','booth','car'],intro:['MANAGER','NYPD closed the block. Google Maps disagrees. Google Maps is losing.'],hot:[['garage-door','Blocked Entrance',5,30,58,60],['booth','Manager Booth',72,45,24,44],['car','Waiting SUV',27,61,39,27]]},
  crystal2:{name:'Crystal Garage - UN Zone',cls:'crystal',open:true,travel:10,props:['garage-door','booth','car'],intro:['ATTENDANT','A diplomatic SUV is at the gate and the driver says the vehicle is expected.'],hot:[['car','Diplomatic SUV',27,61,40,27],['booth','Gate List',71,45,25,44]]},
  liberty2:{name:'Liberty Garage - Event Desk',cls:'liberty',open:true,travel:12,props:['lift','car'],intro:['SUPERVISOR','The event rate signs are still in last year’s folder. The first rush is twenty minutes away.'],hot:[['lift','Event Rate Board',8,30,60,60],['car','Early Event Customer',29,61,40,27]]},
  regent2:{name:'Regent Garage - Checkpoint',cls:'regent',open:true,travel:11,props:['rateboard','gate','car'],intro:['ATTENDANT','Secret Service moved the barricade. A customer would like us to move it back.'],hot:[['gate','Security Barricade',72,28,25,62],['rateboard','Checkpoint Notice',7,15,36,43],['car','Impatient Customer',27,61,40,27]]},
  unplaza:{name:'UN Plaza Overflow Lot',cls:'brittany',open:true,travel:13,props:['sofa','booth','car'],intro:['RORY','Overflow is filling faster than planned, a press van needs power, and somebody lost a validation.'],hot:[['booth','Overflow Desk',72,45,24,44],['car','Press Van',28,61,40,27],['sofa','Validation Table',13,66,52,26]]},
  command:{name:'UN Week Command Review',cls:'executive',open:false,travel:8,props:['conference'],intro:['MR. H','Tell me Midtown is under control.'],hot:[['conference','Command Table',8,64,75,27]]}
};

Object.assign(ACH,CH2_ACH);
const ch1Finale=finale,ch1Update=update,ch1Talk=talkTo,ch1Look=lookAt,ch1Take=takeThing,ch1Use=useItem,ch1Load=loadGame,ch1GameOver=gameOver;

function replaceObject(target,src){Object.keys(target).forEach(k=>delete target[k]);Object.assign(target,src)}
function configureChapter2Objects(){replaceObject(CASES,CH2_CASES);replaceObject(LOC,CH2_LOC)}
function configureChapter1Objects(){location.reload()}

function startChapter2(){
  const carriedScore=S.score;
  const carriedAch=[...S.ach];
  configureChapter2Objects();
  S={score:carriedScore,stress:22,min:390,loc:'hq2',verb:'WALK',selected:null,inv:['Coffee','Clipboard','UN Prep Memo'],flags:{closures:0,diplomat:0,barricade:0,rates:0,validation:0,gridlock:0,press:0,overflow:0,closureMap:0,routeNotice:0,diplomatList:0,ratePacket:0,stamp:0,cable:0,overflowPlan:0,barricadePhoto:0},ach:carriedAch,log:['CHAPTER 2 STARTED: UN WEEK'],started:true,sound:S.sound,music:S.music,ending:false,chapter:2,chapter1Score:carriedScore};
  $('score').parentElement.innerHTML='<b id="score">'+S.score+'</b> / 1600';
  document.querySelector('.brand-sub').textContent='CHAPTER 2: THE UNITED NATIONS IS COMING';
  hideModal();renderScene();update();achievement('unready');autosave();
  modal('CHAPTER 2: 6:30 AM',`<p>United Nations week has arrived.</p><p>Street closures are changing by the minute, diplomatic vehicles are appearing without warning, event traffic is building, and Midtown has decided that lanes are merely suggestions.</p><p><b>CHRISTINE:</b> “Before you ask, yes. All of it.”</p><p><b>OBJECTIVE:</b> Keep the garage network operating through the UN traffic surge.</p>`,[['Enter Command Center',()=>{hideModal();renderScene();update()}]]);
}

finale=function(){
  if(S.chapter===2)return ch2Finale();
  if(!allDone())return say('MR. H','Come back when everything is actually ready.');
  if(S.ending)return;
  S.ending=true;let bonus=0;if(S.min<1080)bonus+=50;if(S.stress<45)bonus+=40;S.score=Math.min(800,S.score+bonus);if(S.score>=760)achievement('perfect');
  const rank=S.score>=760?'LEGENDARY GARAGE BOSS':S.score>=650?'VICE PRESIDENT OF CHAOS':S.score>=520?'MANHATTAN PARKING PRO':S.score>=380?'SOLID OPERATOR':'SURVIVOR OF MONDAY';
  modal(rank,`<div class="ending-rank">${rank}</div><p>Chapter 1 is complete. The garages are standing, the customers are mostly calm, and the sofa has been exiled.</p><div class="statline"><span>Chapter 1 score</span><b>${S.score} / 800</b></div><div class="statline"><span>Stress</span><b>${S.stress}%</b></div><p><b>MR. H:</b> “Good. Now about the United Nations...”</p><h3>CHAPTER 2: THE UNITED NATIONS IS COMING</h3>`,[['START CHAPTER 2',()=>startChapter2()],['Continue Exploring',()=>{S.ending=false;hideModal()}],['Start New Game',()=>newGame()]]);
};

function ch2CompleteCount(){return Object.keys(CH2_CASES).filter(k=>S.flags[k]).length}
function ch2AllDone(){return ch2CompleteCount()===Object.keys(CH2_CASES).length}
function ch2CaseDone(k,score,msg){if(S.flags[k])return;S.flags[k]=1;points(score,msg);if(ch2AllDone()){LOC.command.open=true;$('objective').textContent='Report to the UN Week Command Review.';toast('Command Review unlocked!');achievement('unlegend')}autosave()}

update=function(){
  if(S.chapter!==2)return ch1Update();
  $('time').textContent=fmtTime();$('score').textContent=S.score;$('stress').textContent=S.stress;$('stressBar').style.width=S.stress+'%';
  $('objective').textContent=ch2AllDone()?'Report to the UN Week Command Review.':`Stabilize UN week operations (${ch2CompleteCount()}/${Object.keys(CH2_CASES).length})`;
  $('inventory').innerHTML='';S.inv.forEach(i=>{const b=document.createElement('button');b.textContent=i;b.classList.toggle('selected',S.selected===i);b.onclick=()=>{if(S.verb==='USE'){S.selected=S.selected===i?null:i;toast(S.selected?`Selected: ${i}`:'Selection cleared');update()}else useItem(i)};$('inventory').appendChild(b)});$('invCount').textContent=S.inv.length;
  $('miniMap').innerHTML='';Object.entries(LOC).forEach(([k,l])=>{const b=document.createElement('button');b.className='map-node'+(k===S.loc?' current':'')+(!l.open?' locked':'');b.textContent=(l.open?'':'🔒 ')+l.name;b.onclick=()=>l.open&&travel(k);$('miniMap').appendChild(b)});
  $('caseBoard').innerHTML='';Object.entries(CH2_CASES).forEach(([k,n])=>{const d=document.createElement('div');d.className='case '+(S.flags[k]?'done':'open');d.textContent=(S.flags[k]?'✓ ':'○ ')+n;$('caseBoard').appendChild(d)});
  $('achievements').innerHTML='';Object.entries(ACH).forEach(([k,n])=>{const d=document.createElement('div');d.className='ach '+(S.ach.includes(k)?'unlocked':'');d.textContent=(S.ach.includes(k)?'🏆 ':'◇ ')+n;$('achievements').appendChild(d)});$('achCount').textContent=S.ach.length;$('soundBtn').textContent=S.sound?'🔊':'🔇';$('musicBtn').textContent=S.music?'♫✓':'♫';
};

talkTo=function(id){
  if(S.chapter!==2)return ch1Talk(id);
  if(S.loc==='hq2'&&id==='monitor')return closuresCase();
  if(S.loc==='hq2'&&id==='phone')return gridlockCase();
  if(S.loc==='crystal2'&&id==='car')return diplomatCase();
  if(S.loc==='crystal2'&&id==='booth')return diplomatCase();
  if(S.loc==='liberty2'&&id==='lift')return ratesCase();
  if(S.loc==='regent2'&&id==='gate')return barricadeCase();
  if(S.loc==='regent2'&&id==='car')return barricadeCase();
  if(S.loc==='unplaza'&&id==='sofa')return validationCase();
  if(S.loc==='unplaza'&&id==='car')return pressCase();
  if(S.loc==='unplaza'&&id==='booth')return overflowCase();
  if(S.loc==='east44'&&id==='garage-door')return closuresCase();
  if(S.loc==='command')return ch2Finale();
  say('RICHIE','Nobody has anything useful to add. Midtown has exhausted language.');
};

lookAt=function(id){
  if(S.chapter!==2)return ch1Look(id);
  const k=`${S.loc}:${id}`;const m={
    'hq2:monitor':'A live street-closure map. Every red line represents somebody calling you in five minutes.',
    'hq2:phone':'The command phone has three lines. All three are blinking.',
    'east44:garage-door':'The entrance is physically open and operationally useless. Barricades redirect traffic away from the block.',
    'crystal2:car':'Black SUV, diplomatic plates, tinted windows, driver with zero interest in your paperwork.',
    'liberty2:lift':'Someone clipped last year’s event rate sign to the board. An archeological discovery.',
    'regent2:gate':'A federal security barricade. It has more authority than everyone in this garage combined.',
    'unplaza:car':'A satellite press van with a dead power lead and a reporter practicing concern nearby.',
    'unplaza:sofa':'Not a sofa this time. A folding validation table. Progress.',
    'unplaza:booth':'Overflow counts, handwritten arrows, two radios, and a supervisor asking where twelve more cars are supposed to go.'};
  say('RICHIE',m[k]||'You examine the situation. It has somehow become more Midtown.');
};

takeThing=function(id){
  if(S.chapter!==2)return ch1Take(id);
  if(S.loc==='hq2'&&id==='desk'&&!S.inv.includes('UN Route Packet')){addItem('UN Route Packet');return say('RICHIE','You take the UN route packet. It is already outdated, but less outdated than memory.')}
  say('RICHIE','Taking that would create a new emergency, which seems counterproductive.');
};

useItem=function(item,target=null){
  if(S.chapter!==2)return ch1Use(item,target);
  if(item==='Coffee'){stress(-10,'UN-week coffee');removeItem(item);return say('RICHIE','The coffee tastes like urgency and questionable life choices.')}
  if(S.loc==='east44'&&item==='Approved Detour Notice'&&(target==='garage-door'||!target)){removeItem(item);achievement('unready');ch2CaseDone('closures',70,'Published approved garage detour');return say('MANAGER','Customers are finally reaching us from Second Avenue.')}
  if(S.loc==='crystal2'&&item==='Diplomatic Arrival List'&&(target==='car'||target==='booth'||!target)){removeItem(item);achievement('diplomat');ch2CaseDone('diplomat',70,'Verified diplomatic vehicle without blocking entry');return say('DRIVER','Thank you.',[['RICHIE: That may be the shortest customer interaction of my career.',()=>say('RICHIE','I am framing this moment.')]])}
  if(S.loc==='regent2'&&item==='Barricade Photo'&&(target==='gate'||!target)){removeItem(item);achievement('barricade');ch2CaseDone('barricade',75,'Documented and respected security barricade');return say('RICHIE','Nobody moves federal barricades. We route around reality.')}
  if(S.loc==='liberty2'&&item==='Current Event Rate Packet'&&(target==='lift'||!target)){removeItem(item);achievement('eventrate');ch2CaseDone('rates',75,'Posted current UN event rates');return say('SUPERVISOR','Current signs are up before the rush. A small miracle.')}
  if(S.loc==='unplaza'&&item==='Validation Stamp'&&(target==='sofa'||!target)){removeItem(item);achievement('validator');ch2CaseDone('validation',60,'Reissued ambassador validation');return say('RORY','Validation found, stamped, and logged. Nobody start another international incident.')}
  if(S.loc==='hq2'&&item==='Traffic Camera Snapshot'&&(target==='phone'||!target)){removeItem(item);achievement('traffic');ch2CaseDone('gridlock',75,'Redirected queue before entrance lockup');return say('MANAGER ON PHONE','Queue is moving. I repeat: moving.')}
  if(S.loc==='unplaza'&&item==='Heavy Duty Extension'&&(target==='car'||!target)){removeItem(item);achievement('press');ch2CaseDone('press',65,'Restored safe power to press van');return say('REPORTER','We’re live.',[['RICHIE: Please do not mention parking.',()=>say('REPORTER','No promises.')]])}
  if(S.loc==='unplaza'&&item==='Overflow Allocation Plan'&&(target==='booth'||!target)){removeItem(item);achievement('overflow');ch2CaseDone('overflow',80,'Balanced overflow capacity across garages');return say('RORY','We have room. Barely, but room counts.')}
  say('RICHIE',`${item} does not fix this particular international parking problem.`);
};

function closuresCase(){if(S.flags.closures)return say('MANAGER','Detour is working. Cars are reaching the entrance again.');say('MANAGER','The block is closed from the west. Customers keep following navigation straight into the barricade.',[['Compare the closure map with garage access streets.',()=>{S.flags.closureMap=1;addItem('Approved Detour Notice');points(10,'Built legal detour route');say('RICHIE','Route them in from the east. Send the same instruction to every manager and monthly customer.') }],['Tell customers to follow Google Maps.',()=>{points(-20,'Outsourced operations to an app');stress(12,'Customers met barricade');say('MANAGER','Google just sent another car to the police checkpoint.')}]] )}
function diplomatCase(){if(S.flags.diplomat)return say('ATTENDANT','Diplomatic SUV cleared and parked.');say('ATTENDANT','Driver says the delegation is on our list, but I cannot find the name.',[['Check delegation vehicle list by plate, not passenger name.',()=>{addItem('Diplomatic Arrival List');points(10,'Matched vehicle by diplomatic plate');say('RICHIE','Use the plate list. The passenger name may not be what the reservation used.')}],['Make the SUV wait outside.',()=>{points(-15,'Created diplomatic curbside meeting');stress(14,'Security asked questions');say('RICHIE','That escalated faster than expected.')}]] )}
function barricadeCase(){if(S.flags.barricade)return say('ATTENDANT','Nobody moved the barricade. Civilization survives.');say('CUSTOMER','If you move that barricade six feet, I can get in.',[['Photograph the security layout and route customers around it.',()=>{addItem('Barricade Photo');points(10,'Documented federal security layout');say('RICHIE','We do not move security equipment. We change our traffic plan.')}],['Move it just a little.',()=>{points(-40,'Touched federal security barricade');stress(25,'People with earpieces noticed');say('NARRATOR','Several serious-looking people turn toward Richie simultaneously.')}]] )}
function ratesCase(){if(S.flags.rates)return say('SUPERVISOR','UN event rates are posted and the rush is paying correctly.');say('SUPERVISOR','We found an event sign. Unfortunately it says last year.',[['Pull the current event rate packet and replace every sign.',()=>{addItem('Current Event Rate Packet');points(10,'Verified event pricing before posting');say('RICHIE','Current rate, current date, current signs. Retire the museum piece.')}],['Cross out last year’s price with a marker.',()=>{points(-20,'Created artisanal rate signage');say('RICHIE','No handwritten pricing. We are not selling tomatoes.')}]] )}
function validationCase(){if(S.flags.validation)return say('RORY','Validation issue is closed.');say('RORY','An embassy aide says the validation disappeared between the lobby and the garage.',[['Verify the event roster and reissue it with a logged stamp.',()=>{addItem('Validation Stamp');points(8,'Verified before reissuing validation');say('RICHIE','One replacement. Log it so we do not accidentally validate the United Nations twice.')}],['Tell them the paper is gone, so the discount is gone.',()=>{points(-15,'Turned paper loss into diplomacy');stress(8,'Embassy aide requested supervisor');say('RORY','Maybe we try the roster first.')}]] )}
function gridlockCase(){if(S.flags.gridlock)return say('MANAGER ON PHONE','Entrance queue is moving normally again.');sfx('ring');say('MANAGER ON PHONE','Traffic is backed across our entrance. If three more cars arrive, nobody gets in or out.',[['Pull the traffic camera and divert arrivals before the block.',()=>{addItem('Traffic Camera Snapshot');points(10,'Diagnosed queue before lockup');say('RICHIE','Hold new arrivals one avenue east and meter them in. Keep the exit clear at all costs.')}],['Tell attendants to squeeze cars tighter.',()=>{points(-20,'Applied geometry to traffic jam');stress(15,'Exit became blocked');say('MANAGER ON PHONE','We have successfully made the same problem denser.')}]] )}
function pressCase(){if(S.flags.press)return say('REPORTER','Power is stable. We are live.');say('REPORTER','Our van has a damaged extension lead. We only need power for twenty minutes.',[['Use the garage-rated heavy-duty extension from the supply kit.',()=>{addItem('Heavy Duty Extension');points(8,'Selected safe temporary power');say('RICHIE','No taped cords, no mystery adapters, no fires on television.')}],['Tape the damaged cable.',()=>{points(-30,'Attempted live-broadcast electrical experiment');stress(18,'Cable sparked');say('REPORTER','That would have been excellent footage.')}]] )}
function overflowCase(){if(S.flags.overflow)return say('RORY','Overflow allocation is holding.');say('RORY','UN Plaza is nearly full and six more reserved vehicles are inbound.',[['Redistribute reservations to garages with verified capacity.',()=>{addItem('Overflow Allocation Plan');points(12,'Built capacity plan before overflow');say('RICHIE','Send premium vehicles where we have height and space. Keep the closest garage available for reserved arrivals.')}],['Put everything anywhere it fits.',()=>{points(-20,'Invented parking Tetris policy');stress(13,'Three departures became trapped');say('RORY','We have converted capacity into a puzzle.')}]] )}

function ch2Finale(){
  if(S.chapter!==2)return ch1Finale();
  if(!ch2AllDone())return say('MR. H','Midtown is not under control yet. Finish the board.');
  if(S.ending)return;S.ending=true;let bonus=0;if(S.min<900)bonus+=70;if(S.stress<45)bonus+=50;S.score=Math.min(1600,S.score+bonus);achievement('unlegend');
  const rank=S.score>=1450?'COMMANDER OF MIDTOWN':S.score>=1250?'UN WEEK SURVIVOR':S.score>=1050?'TRAFFIC DIPLOMAT':'PARKING PEACEKEEPER';
  modal(rank,`<div class="ending-rank">${rank}</div><p>The diplomatic vehicles are parked, the security barricades are untouched, the detours are working, event rates are posted, overflow is balanced, and nobody caused an international incident in a parking garage.</p><div class="statline"><span>Total score</span><b>${S.score} / 1600</b></div><div class="statline"><span>Stress</span><b>${S.stress}%</b></div><div class="statline"><span>Time</span><b>${fmtTime()}</b></div><p><b>MR. H:</b> “Excellent. Enjoy the quiet.”</p><p>The fire alarm chirps once.</p><h3>CHAPTER 3: THE INSPECTION FROM HELL</h3>`,[['Continue Exploring',()=>{S.ending=false;hideModal()}],['Replay From Chapter 1',()=>newGame()]]);
}

gameOver=function(t,b){if(S.chapter!==2)return ch1GameOver(t,b);modal(t,`<p>${b}</p><div class="statline"><span>Total score</span><b>${S.score}/1600</b></div>`,[['Load Save',()=>loadGame()],['Restart Chapter 2',()=>startChapter2()]])};

loadGame=function(){try{const raw=localStorage.getItem('garageBossSave');if(!raw)return toast('No save found');const data=JSON.parse(raw);if(data.chapter===2){configureChapter2Objects();S={...data,chapter:2};$('score').parentElement.innerHTML='<b id="score">'+S.score+'</b> / 1600';document.querySelector('.brand-sub').textContent='CHAPTER 2: THE UNITED NATIONS IS COMING';LOC.command.open=ch2AllDone();renderScene();update();hideModal();toast('Chapter 2 save loaded');return}return ch1Load()}catch(e){toast('Save could not be loaded')}};

// Tiny visual flourishes for Chapter 2, injected without replacing the main stylesheet.
const ch2Style=document.createElement('style');ch2Style.textContent=`body.chapter2 .topbar{box-shadow:0 0 22px #d9a44133}body.chapter2 .scene-label:after{content:' • UN WEEK';color:#d9a441}.stage.office .monitor:after{content:'UN';position:absolute;color:#f6c85f;font-size:22px;left:35%;top:30%}.case.done{animation:casePop .25s ease}@keyframes casePop{50%{transform:scale(1.04)}}`;
document.head.appendChild(ch2Style);
const ch2OldStart=startChapter2;startChapter2=function(){document.body.classList.add('chapter2');ch2OldStart()};
