(()=>{"use strict";const e="YXl1dS1qc3Ezaw==",t=e=>{const t=btoa(JSON.stringify(e));let s=0;for(let e=0;e<t.length;e++)s=(s<<5)-s+t.charCodeAt(e);return s},s=t=>{t.sort(((e,t)=>t.updatedAt-e.updatedAt)),localStorage.setItem(e,btoa(JSON.stringify(t)))};class n{static saveGame(e,i){const a=n.loadGames(),o=a.findIndex((t=>t.id===e)),r=new Date,d={id:e,data:i,updatedAt:r};if(d.hash=t(d),-1!==o)a[o].updatedAt=r,a[o].data=i,a[o].hash=d.hash;else{for(;a.length>=5;)a.pop();a.push(d)}s(a)}static loadGames(){const s=localStorage.getItem(e);if(!s)return[];let n=JSON.parse(atob(s)).map((e=>({...e,updatedAt:new Date(e.updatedAt)})));return n=n.filter((({hash:e,...s})=>{const n=t(s)===e;return n})),n}static deleteSavedGame(e){const t=n.loadGames(),i=t.findIndex((t=>t.id===e));-1!==i&&(t.splice(i,1),s(t))}}const i=e=>{const t={},s=new Proxy(t,{get:(t,s)=>(s in t||(t[s]="function"==typeof e?e():e),t[s])});return t.toJSON=function(){return{...this}},s},a=(e,t)=>{const s=Math.random()*(t-e)+e;return parseFloat(s.toFixed(6))},o=e=>{const t={d:Math.floor(e/86400),h:Math.floor(e%86400/3600),m:Math.floor(e%3600/60),s:e%60};return Object.entries(t).filter((([e,t])=>t>0)).map((([e,t])=>`${t}${e}`)).join(" ")},r=e=>{if(e<1e3)return e;const t=Math.abs(e),s=Math.sign(e),n=Math.floor(Math.log10(t)/3);return s*(t/Math.pow(10,3*n)).toFixed(3)+["","k","M","B","T","Q","Qu","S","Se","O","N","D","Ud","Dd","Td","Qd","Qid","Sd","Spd","Od","Nd","V","Uv","Dv","Tv","Tt","Qit","Sit","Sp","O","No","C","Uc","Dc","Tc","Qic","Sic","Sc","Oc","Noc","Ic","U","Du","Tu","Qua","Qi","Si","Se","Oc","No","Vi","Uvi","Dvi","Ti","Tt","Qit","S","Sp","O","No","C","Uc","Dc","Tc","Qic","Sic","Ct","Oc","Noc","Ic","U","Du","Tu","Qua","Qi","Si","S","O","No","V","Uv","Dv","Tv","Tt","Qit","Si","Sp","Oc","Noc","Ic","U","Du","Tu","Qua","Qi","Si"][n]};class d{constructor(e,t,s){if(this.id=e,!t)throw new Error("Materials cannot be empty.");this.materials=t,this.level=0,this.modifiers=i(0),this.timeToBuild=s,this.buildStartTime=null,this.elapsedTime=0}updateModifier(e,t){this.modifiers[e]=t}build(e){if(!this.checkResourcesForNextLevel(e))return;const t=this.getResourcesNeededForNextLevel();for(const[s,n]of t)e.resources[s]-=n;return this.buildStartTime=new Date,this}getTimeRequiredToBuild(){return this.level<this.materials.length?this.timeToBuild**(this.level+1):0}getResourcesNeededForNextLevel(){return this.level<this.materials.length?Object.entries(this.materials[this.level]):[]}checkResourcesForNextLevel(e){const t=this.materials[this.level];for(const[s,n]of Object.entries(t))if(e.resources[s]<n)return!1;return!0}upgrade(e){return this.level<this.materials.length&&this.build(e)}update(e,t){if(this.buildStartTime){((new Date).getTime()-this.buildStartTime.getTime())/1e3>=this.getTimeRequiredToBuild()&&(this.buildStartTime=null,this.level+=1)}}create(e,t){}}class c extends d{constructor(e,t,s,n,i){super(e,t,s),this.generationRate=i,this.generatedItems=Object.entries(n)}generateRate(){return this.generationRate/(this.modifiers.rate||1)}willGenerate(e=0){const t={};for(const[s,n]of this.generatedItems)t[s]=Math.floor(n*(this.modifiers[s]+1))*(this.level+e);return Object.entries(t)}update(e,t){if(super.update(e,t),this.elapsedTime+=t/1e3,0===this.level)return;const s=this.generateRate();let n=Math.floor(this.elapsedTime/s);n<=0||(this.elapsedTime=this.elapsedTime%s,this.willGenerate().forEach((([t,s])=>{e.resources[t]+=(n>1?.5*s*(1+this.modifiers.idleRate):s)*n})))}}class h{constructor(e,t,s){this.resources=e,this.transportationTime=t,this.risk=s}}class l{constructor(e,t={}){const{climates:s=[],primaryBuyers:n=[]}=t;this.id=e,this.climates=s,this.primaryBuyers=n}addToBase(e,t){e.resources[this.id]+=t}}class u{constructor(e,t,s,n){this.id=e,this.type=t,this.effectiveness=s,this.requiredMaterials=n}hasRequiredMaterials(e){return Object.keys(this.requiredMaterials).every((t=>e[t]>=this.requiredMaterials[t]))}hasBeenResearched(e){return e.includes(this.id)}canBeCrafted(e,t){return this.hasRequiredMaterials(t)&&this.hasBeenResearched(e)}addToBase(e,t){this.base[this.type][this.id]+=t}}class m extends u{constructor(e,t,s){super(e,"attack",t,s)}}class g extends u{constructor(e,t,s){super(e,"defense",t,s)}}class p extends u{constructor(e,t,s){super(e,"defense",t,s)}}class b{constructor(e,t,s,n,i){this.id=e,this.resourcesConsumed=Object.entries(s),this.generatedResources=Object.entries(n),this.generateRate=t,this.generatedOnDeath=i}consume(e){if(this.consumedResources.length>0)for(const[t,s]of this.consumedResources)if(e.resources[t]<s)return!1;return!0}generate(e,t,s){let n=this.generationRate;for(const e of Object.values(s))n*=e;const a=e/n,o=i(0);for(;a>0&&this.consume(t);){a--;for(const[e,t]of this.generatedResources)o[e]+=t}return o}}const C=1,f={Temperate:3,Tropical:1,Arid:2,Cold:4,Mountain:5},w={[f.Temperate]:"🌱",[f.Tropical]:"🌴",[f.Arid]:"🏜️",[f.Cold]:"❄️",[f.Mountain]:"🏔️"},S={[C]:{coins:5e3,resourceModifier:2,protectionDuration:10,baseCostPerClimate:{[f.Temperate]:2500,[f.Tropical]:2500,[f.Arid]:15e3,[f.Cold]:2e4,[f.Mountain]:25e3}},[2]:{coins:2500,resourceModifier:1,protectionDuration:5,baseCostPerClimate:{[f.Temperate]:2500,[f.Tropical]:2500,[f.Arid]:15e3,[f.Cold]:2e4,[f.Mountain]:25e3}},[3]:{coins:1e3,resourceModifier:.5,protectionDuration:0,baseCostPerClimate:{[f.Temperate]:1e3,[f.Tropical]:1e3,[f.Arid]:1e3,[f.Cold]:1e3,[f.Mountain]:1e3}}},v={wood:1,stone:2,iron:3,copper:4,hide:5,leather:6,silk:7,rice:8,gold:9,wheat:10,milk:11},B={[v.wood]:new l("🌲",{climates:[f.Temperate,f.Cold]}),[v.stone]:new l("🧱"),[v.iron]:new l("iron"),[v.copper]:new l("copper"),[v.gold]:new l("gold"),[v.leather]:new l("🧤"),[v.silk]:new l("silk"),[v.wool]:new l("wool"),[v.hide]:new l("hide"),[v.rice]:new l("🍚"),[v.wheat]:new l("🌾"),[v.milk]:new l("🥛")},T=(new b("cow",180,{[v.milk]:1},{[v.meat]:3,[v.hide]:5}),new b("sheep",600,{[v.wool]:3},{[v.meat]:2,[v.hide]:3}),new b("pig",0,{},{[v.meat]:1}),{});[[v.wood,"Lumbermill"],[v.stone,"Stonemason"]].forEach((([e,t])=>{T[t]=[t,[{},{[v.wood]:30},{[v.wood]:60,[v.stone]:30},{[v.wood]:1e3,[v.stone]:1e3},{[v.wood]:2500,[v.stone]:2500},{[v.wood]:5e3,[v.stone]:5e3},{[v.wood]:1e4,[v.stone]:1e4},{[v.wood]:5e4,[v.stone]:5e4}],2,{[e]:10},5]}));[[v.rice,"Rice Farm"],[v.wheat,"Wheat Farm"]].forEach((([e,t])=>{T[t]=[t,[{[v.wood]:30,[v.stone]:10},{[v.wood]:120,[v.stone]:90}],10,{[e]:50},30]}));new class extends d{constructor(e,t,s,n={}){if(super(e,t),this.generatedItems=Object.entries(s),this.consumedResources=Object.entries(n),0===this.consumedResources.length)throw new Error("Consumed resources cannot be empty.")}computeMaxResource(e){let t=0,s=-1;const n=JSON.parse(JSON.stringify(e.resources));for(;t!==s;){t=s;for(const[e,t]in this.consumedResources){if(bbaseResources[e]<t)break;n[e]-=t}s+=1}return t}create(e,t){const s=Math.min(t,this.computeMaxResource(e));for(const[t,n]in this.consumedResources)e.resources[t]-=n*s;for(const[t,n]in this.generatedItems){const i=1+this.modifiers[t];e.resources[t]+=Math.floor(n*s*i)*this.level}}}("tannery",{[v.wood]:150,[v.stone]:100},{[B.leather]:1},{[v.hide]:3});const M={woodSword:new m("woodSword",2,[[v.wood,100]]),stoneSword:new m("stoneSword",2.5,[[v.stone,100]]),goldSword:new m("goldSword",2,[[v.gold,100]]),ironSword:new m("ironSword",3,[[v.iron,100]]),leatherArmor:new g("leatherArmor",.28,[[v.leather,75]]),goldArmor:new g("goldArmor",.44,[[v.gold,75]]),ironArmor:new g("ironArmor",.6,[[v.silk,75]]),woodShield:new p("woodShield",.02,[[v.wood,25]]),stoneShield:new p("stoneShield",.06,[[v.stone,25]]),goldShield:new p("goldShield",.11,[[v.gold,25]]),ironShield:new p("ironShield",.2,[[v.iron,25]])},x={CONTAINER:"container",TOP:"topbar",NAVBAR:"navbar",LEFTBAR:"leftbar",CREATE_BASE:"create-base-container",GAME_MAIN:"game-main",GUILD_SCR:"guild-scr",BASE_SCR:"base-scr"};class R{static fromJson(e){const{buildings:t,researches:s,resources:n,attack:i,defense:a,...o}=e,r=new R;Object.assign(r,o);for(let[e,t]of Object.entries(n))r.resources[e]=t;for(let[e,t]of Object.entries(i))r.attack[e]=t;for(let[e,t]of Object.entries(a))r.defense[e]=t;r.buildings={};for(const[e,s]of Object.entries(t)){const{modifiers:t,...n}=s;["materials","generationRate","generatedItems","timeToBuild"].forEach((e=>{delete n[e]}));const i=new c(...T[e]);for(let[e,s]of Object.entries(t))i.modifiers[e]=s;Object.assign(i,n),i.buildStartTime&&(i.buildStartTime=new Date(i.buildStartTime)),r.buildings[e]=i}return r.researches={},o.lastSync&&(r.lastSync=new Date(o.lastSync)),r}constructor(e,t,s,n=0){this.id=`${Math.floor(Date.now()/1e3)}`,this.name=t,this.region=s,this.protectionDuration=24*n*60*60,this.climate=e,this.location={y:a(-90,90),x:a(-180,180)},this.buildings={},this.resources=i(0),this.researches={},this.attack=i(0),this.sumAtk=0,this.defense=i(0),this.sumDef=0,this.lastSync=new Date}craftEquipment(e){const t=M[e];if(t.canBeCrafted(this.researches,this.resources)){for(let e=0;e<t.requiredMaterials.length;e++)this.resources[t.requiredMaterials[e]]-=t.requiredAmounts[e];"weapon"===e?(this.attack[t.id]+=1,this.sumAtk+=t.effectiveness):"defense"===e&&(this.defense[t.id]+=1,this.sumDef+=t.effectiveness)}}canBeInvaded(){return this.protectionDuration>=0}computeBattle(e){return this.sumDef>0}upgradeBuilding(e){const t=e.id;this.buildings[t]||(this.buildings[t]=e),this.buildings[t].build(this)}update(e){for(const[t,s]of Object.entries(this.buildings))s.update(this,e);this.protectionDuration=Math.max(this.protectionDuration,this.protectionDuration-e,0)}generateResources(e){for(const t of this.buildings)t.generate(base,e)}transportResources(e,t,s){const n=this.calculateResourceLossRisk();new h(t,s,n)}calculateResourceLossRisk(){}}const E="game-base",N="game-tabs",A="game-container",D="game-name",y="game-location",L="game-resources",O="game-research",k="game-market",G={META:"Info",BUILDING:"Building",MARKET:"Market"},I=(e,t,s=null)=>{if(0===t.length)return;const n=null!==s;for(const[i,a]of t){const t=B[i];if(t){const o=document.createElement("span");o.textContent=t.id,e.appendChild(o);const d=document.createElement("span");d.textContent=r(a),n&&(!s[i]||s[i]<a)&&d.classList.add("red"),e.appendChild(d)}}};class j{constructor(e,t){this.engine=e,this.base=t,this.buttons={}}updateBase(e){return this.container&&(this.container.innerHTML=""),this.base=e,this.create()}createTabs(){this.tabs=this.engine.addComponent(N,"div",this.container.id),this.tabs.classList.add("row"),Object.entries(G).forEach((([e,t])=>{const s=this.engine.addComponent(e,"button",this.tabs.id);s.classList.add("btn"),s.classList.add("navbar-button");const n=document.createElement("span");n.textContent=t,s.appendChild(n),this.currentTab===t&&s.classList.add("active"),s.onclick=()=>{this.buttons[this.currentTab].classList.remove("active"),this.updateTab(t),this.buttons[this.currentTab].classList.add("active")},this.buttons[t]=s}))}updateTab(e){switch(this.gameContainer.innerHTML="",this.currentTab=e,e){case G.META:this.showMeta();break;case G.BUILDING:this.showBuilding();break;case G.RESEARCH:this.showResearch();break;case G.MARKET:this.showMarket()}}showMeta(){this.name=this.engine.addComponent(D,"div",this.gameContainer.id),this.name.textContent=`Base: ${this.base.name}`,this.location=this.engine.addComponent(y,"div",this.gameContainer.id),this.location.textContent=`Location: [latitude: ${this.base.location.y}, longitude: ${this.base.location.x}]`,this.inventory=this.engine.addComponent(L,"div",this.gameContainer.id)}getBuildingGenerateInfo(e,t){e.innerHTML="";const s=document.createElement("span");s.textContent=`🧺 ⏳ ${o(t.generateRate())}`,e.appendChild(s),t.level>0&&I(e,t.willGenerate())}getBuildingNextRequirement(e,t,s){if(e.innerHTML="",t.level===t.materials.length)return;const n=document.createElement("span");n.textContent=`🛠 ⏳ ${o(t.getTimeRequiredToBuild())}`,e.appendChild(n);const i=t.getResourcesNeededForNextLevel();i.length>0&&I(e,i,s);const a=document.createElement("span");a.textContent=" ➡ 🧺 ",e.appendChild(a),I(e,t.willGenerate(1))}showBuilding(){this.buildings=i((()=>({}))),Object.entries(T).forEach((([e,t])=>{const s=this.engine.addComponent(`add-bld-${e}`,"button",this.gameContainer.id);s.classList.add("btn","btn-upgrade","btn-progress");const n=document.createElement("span");this.buildings[e].label=n,s.appendChild(n);const i=document.createElement("span");i.classList.add("progress-bar"),s.appendChild(i),this.buildings[e].progressBar=i;const a=document.createElement("span");this.buildings[e].resourceGenerated=a,s.appendChild(a);const o=document.createElement("span");this.buildings[e].nextLevelRequirements=o,s.appendChild(o),s.onclick=()=>{this.base.upgradeBuilding(new c(...t))},this.buildings[e].button=s}))}showResearch(){this.engine.addComponent(O,"div",this.gameContainer.id).textContent="Coming soon..."}showMarket(){this.engine.addComponent(k,"div",this.gameContainer.id).textContent="Coming soon..."}createGameContainer(){this.gameContainer=this.engine.addComponent(A,"div",this.container.id)}updateMeta(){const e=Object.entries(this.base.resources);if(e.length>0){this.inventory.innerHTML="";const t=document.createElement("span");t.textContent="Resources: ",this.inventory.appendChild(t),I(this.inventory,e)}}updateBuilding(){Object.entries(this.buildings).forEach((([e,t])=>{const s=T[e];if(!s)return;const n=this.base.buildings[e]||new c(...s);if(t.label.textContent=`${e} (${n.level} / ${n.materials.length})`,this.getBuildingGenerateInfo(t.resourceGenerated,n),this.getBuildingNextRequirement(t.nextLevelRequirements,n,this.base.resources),n&&n.buildStartTime){const e=n.getTimeRequiredToBuild(),s=((new Date).getTime()-n.buildStartTime.getTime())/1e3;t.progressBar.style.width=s/e*100+"%",t.button.disabled=!0}else t.progressBar.style.width=0,t.button.disabled=n.level===n.materials.length}))}render(){switch(this.currentTab){case G.META:this.updateMeta();break;case G.BUILDING:this.updateBuilding()}}create(){return this.container=this.engine.addComponent(E,"div"),this.currentTab=G.META,this.createTabs(),this.createGameContainer(),this.updateTab(this.currentTab),this.container}}class ${constructor(){this.shouldShow=this.shouldShow.bind(this)}shouldShow(){return!0}}class q extends ${constructor(e,t,s,n){super(),this.text=e,this.onClick=t,s&&(this.shouldShow=s),this.expand=n}generate(){if(!this.shouldShow())return;const e=document.createElement("button");return e.textContent=this.text,e.classList.add("btn","btn-menu"),this.expand&&e.classList.add("expand"),e.onclick=this.onClick,e}}class F extends ${constructor(e){super(),this.components=e}generate(){const e=document.createElement("div");e.classList.add("cb-row");for(const t of this.components){const s=t.generate();s&&e.appendChild(s)}return e}}class U extends ${constructor(e){super(),this.text=e}generate(){const e=document.createElement("h1");return e.textContent=this.text,e}}class J extends ${constructor(e,t,s={}){super(),this.id=e,this.options=t;const{placeholder:n,onChange:i}=s;this.placeholder=n,this.onChange=i}generate(){const e=document.createElement("select");e.id=this.id;const t=document.createElement("option");return t.disabled=!0,t.selected=!0,t.textContent=this.placeholder,e.appendChild(t),e.onchange=this.onChange,this.options.forEach((t=>{const s=document.createElement("option");s.value=t.value,s.textContent=t.text,e.appendChild(s)})),e}}const Q="cb-climate",H="cb-name",_="cb-cost",P="cb-submit";class V{constructor(e){this.engine=e,this.container=null}addComponent(e,t,s,n){const i=this.engine.addComponent(`${e}-container`,"div",n);let a,o;return i.className="cb-row","button"!==s&&(a=this.engine.addComponent(`${e}-label`,"label",i.id),a.textContent=t),"string"==typeof s?o=this.engine.addComponent(e,s,i.id):(o=s,i.appendChild(o)),"button"!==s?a.for=o.id:o.textContent=t,[o,i,a]}addNameRow(){const[e,t,s]=this.addComponent(H,"Name","input",this.container.id);this.name=e,this.name.onkeypress=()=>{const e=this.name.value.trim(),t=this.climate.value;if(""===e||"Select a climate..."===t)return void(this.submit.disabled=!0);const s=this.engine.gameState.settings.baseCostPerClimate[t];this.submit.disabled=s>this.engine.gameState.guild.coins}}addClimateRow(){const e=new J(Q,Object.entries(f).map((([e,t])=>({text:e,value:t}))),{placeholder:"Select a climate...",onChange:e=>{const t=e.target.value,s=this.engine.gameState.settings.baseCostPerClimate[t];this.cost.innerHTML=`&#x1F4B0; ${s}`,s>this.engine.gameState.guild.coins?(this.cost.style.color="red",this.submit.disabled=!0):(this.cost.style.color="white",this.submit.disabled=""===this.name.value.trim())}}),[t,s,n]=this.addComponent(Q,"Climate",e.generate(),this.container.id);this.climate=t,this.cost=this.engine.addComponent(_,"span",s.id)}addSubmitButton(){const[e,t,s]=this.addComponent(P,"Submit","button",this.container.id);this.submit=e,this.submit.className="btn btn-menu",this.submit.disabled=!0,this.submit.onclick=()=>{this.engine.createNewBase(this.name.value,this.climate.value,"")}}create(){return this.container=this.engine.addComponent(x.CREATE_BASE,"div"),this.addClimateRow(),this.addNameRow(),this.addSubmitButton(),this.container}}const Y="Y3JlYXRlLWJhc2UtMTYzNjc3MDcxMA==";class z{constructor(e){this.engine=e,this.buttons={},this.expanded=!0}updateBase(e){this.currentBase&&this.currentBase.classList.remove("active"),this.currentBase=this.buttons[e],this.currentBase.classList.add("active")}updateButtonContent(){if(this.expanded){this.collapseButton.textContent="<",this.container.classList.add("expand");for(const e of Object.values(this.engine.gameState.bases))e&&this.buttons[e.id]&&(this.buttons[e.id].textContent=e.name);this.buttons[Y].textContent="+ New Base"}else{this.collapseButton.textContent=">",this.container.classList.remove("expand");for(const e of Object.values(this.engine.gameState.bases))e&&this.buttons[e.id]&&(this.buttons[e.id].textContent=w[e.climate]);this.buttons[Y].textContent="+ ⛺"}}addCollapseButton(){this.collapseButton=this.engine.addComponent("left-bar-collapse","button",this.container.id);this.collapseButton.classList.add("btn"),this.collapseButton.onclick=()=>{this.expanded=!this.expanded,this.updateButtonContent()}}addButton(e){const t=this.engine.addComponent(`btn-${e.id}`,"button",this.container.id);t.classList.add("btn"),t.textContent=!e.climate||this.expanded?e.name:w[e.climate],t.onclick=()=>{this.updateBase(e.id),this.engine.gameDisplay.updateBase(e.id)},this.buttons[e.id]=t}create(e){this.container=e,this.addCollapseButton(),this.addButton({id:Y,name:"+ New Base"});for(const e of Object.values(this.engine.gameState.bases))e&&this.addButton(e);this.currentBase=this.buttons[this.engine.gameState.currentBase],this.currentBase.classList.add("active"),this.updateButtonContent()}}const W="game-leftbar",K="game-right-container";class X{constructor(e){this.engine=e,this.leftBar=new z(this.engine),this.baseDisplay=new j(this.engine),this.createBaseDisplay=new V(this.engine)}addBase(e){this.leftBar.addButton(e),this.leftBar.updateBase(e.id),this.baseDisplay.updateBase(e),this.updateBase(e.id)}updateBase(e){this.rightContainer.innerHTML="";this.engine.gameState.currentBase;if(e===Y){const e=this.createBaseDisplay.create();this.rightContainer.appendChild(e)}else{const t=this.engine.gameState.bases[e];this.rightContainer.appendChild(this.baseDisplay.updateBase(t))}this.engine.gameState.currentBase=e}render(){this.engine.gameState.currentBase!==Y&&this.baseDisplay.render()}remove(){this.container.innerHTML=""}create(){this.container=this.engine.components[x.GAME_MAIN],this.leftBar.create(this.engine.addComponent(W,"div",this.container.id)),this.rightContainer=this.engine.addComponent(K,"div",this.container.id),this.updateBase(this.engine.gameState.currentBase)}}const Z="guild-container",ee="guild-name",te="guild-submit";class se{constructor(e){this.engine=e}addComponent(e,t,s,n){const i=this.engine.addComponent(`${e}-container`,"div",n);let a,o;return i.className="cb-row","button"!==s&&(a=this.engine.addComponent(`${e}-label`,"label",i.id),a.textContent=t),"string"==typeof s?o=this.engine.addComponent(e,s,i.id):(o=s,i.appendChild(o)),"button"!==s?a.for=o.id:o.textContent=t,[o,i,a]}addNameRow(){const[e,t,s]=this.addComponent(ee,"Name","input",this.guildContainer.id);this.name=e,this.name.value=this.engine.gameState.guild.name,this.name.onkeyup=e=>{const t=e.target.value.trim();this.submit.disabled=""===t||this.engine.gameState.guild.name===t}}addSubmitButton(){const[e,t,s]=this.addComponent(te,"Submit","button",this.guildContainer.id);this.submit=e,this.submit.className="btn btn-menu",this.submit.disabled=!0,this.submit.onclick=()=>{this.engine.gameState.guild.updateName(this.name.value,this.engine.topbar)}}remove(){this.container.innerHTML=""}create(){this.container=this.engine.components[x.GAME_MAIN],this.guildContainer=this.engine.addComponent(Z,"div",this.container.id),this.addNameRow(),this.addSubmitButton()}}class ne{constructor(e){this.engine=e,this.buttons=[],this.activeButton=null,this.addButton(x.BASE_SCR,"Base","26FA",!0),this.addButton(x.GUILD_SCR,"Guild","1F3F0")}addButton(e,t,s,n=!1){this.buttons.push({name:e,text:t,icon:s,active:n})}create(){this.mainContainer=this.engine.components[x.MAIN];const e=this.engine.addComponent(x.NAVBAR,"div",x.CONTAINER);this.buttons.forEach((({name:t,text:s,icon:n,active:i,onClick:a})=>{const o=this.engine.addComponent(t,"button",e.id);o.onclick=()=>{this.activeButton!==o&&(this.activeButton&&(this.activeButton.active=!1,this.activeButton.classList.remove("active"),this.activeButton.style=""),this.activeButton=o,this.activeButton.active=!0,this.activeButton.classList.add("active"),a&&a(),this.engine.switchScreen(t))};const r=document.createElement("span");r.textContent=s,o.appendChild(r);const d=document.createElement("span");d.textContent=String.fromCodePoint(`0x${n}`),o.appendChild(d),o.classList.add("navbar-button"),o.classList.add("btn"),i&&(this.activeButton=o,o.classList.add("active"))}))}}class ie{static fromJson(e){const t=new ie("",{});return Object.assign(t,e),t}constructor(e,t){this.name=`${(()=>{const e=Math.floor(8*Math.random())+3;let t="";const s="abcdefghijklmnopqrstuvwxyz";for(let n=0;n<e;n++){const e=Math.floor(26*Math.random());t+=s.charAt(e)}return t})()}-${e}`,this.coins=t.coins,this.research=[]}updateName(e,t){this.name=e,t.update()}removeCoins(e,t){if(e>this.coins)throw new Error("Insufficient coins");this.coins-=e,t.update()}addCoins(e,t){this.coins+=e,t.update()}}const ae="guild-coins",oe="guild-name";class re{constructor(e){this.engine=e,this.guild=e.gameState.guild}update(){this.nameContainer.innerHTML=`Guild name: ${this.guild.name}`,this.coinsContainer.innerHTML=`&#x1F4B0; ${this.guild.coins}`}create(){this.container=this.engine.addComponent(x.TOP,"div",x.CONTAINER),this.nameContainer=this.engine.addComponent(oe,"div",this.container.id),this.coinsContainer=this.engine.addComponent(ae,"div",this.container.id),this.update()}}class de{static fromJson(e,t){const{guild:s,bases:n,difficulty:i,...a}=t.data,o=new de(e,i);Object.assign(o.gameState,a),o.id=t.id,o.gameState.bases={};for(const[e,t]of Object.entries(n))o.gameState.bases[e]=R.fromJson(t);return o.gameState.guild=ie.fromJson(s),o.gameState.createdAt=new Date(a.createdAt),o.gameState.lastSync=new Date(a.lastSync),o}constructor(e,t=C){const s=S[t];this.id=Math.floor(Date.now()/1e3),this.gameState={difficulty:t,settings:s,bases:{[Y]:void 0},guild:new ie(this.id,s),currentBase:Y,createdAt:new Date,lastSync:new Date},this.timeElapsed=0,this.components={container:e}}addComponent(e,t,s){const n=document.createElement(t);return n.id=e,this.components[e]=n,s&&this.components[s].appendChild(n),n}createNewBase(e,t,s){const n=this.gameState.settings.baseCostPerClimate[t];this.gameState.guild.removeCoins(n,this.topbar);const i=new R(t,e,s,this.gameState.settings.protectionDuration);this.gameState.bases[i.id]=i,this.gameDisplay.addBase(i)}updateGame(){const e=new Date,t=e.getTime()-this.gameState.lastSync.getTime();this.timeElapsed+=t;for(const e of Object.values(this.gameState.bases))e&&e.update&&e.update(t);this.timeElapsed>5e3&&(this.timeElapsed=0,n.saveGame(this.id,this.gameState)),this.gameState.lastSync=e}renderGameState(){this.gameDisplay.render()}switchScreen(e){switch(e){case x.GUILD_SCR:this.gameDisplay.remove(),this.guildDisplay.create();break;case x.BASE_SCR:this.guildDisplay.remove(),this.gameDisplay.create()}}start(){this.topbar=new re(this),this.navbar=new ne(this),this.guildDisplay=new se(this),this.gameDisplay=new X(this),this.topbar.create(),this.addComponent(x.GAME_MAIN,"div",x.CONTAINER),this.gameDisplay.create(),this.navbar.create(),setInterval((()=>{this.updateGame(),this.renderGameState()}),1e3/60)}}new class{constructor(e){this.screenContainer=e}showLanding(){this.clearScreen();const e=document.createElement("div");e.className="landing-screen";[new U("Welcome to the Idle Trading Colonies game"),new q("Load a game",(()=>this.showGames()),(()=>n.loadGames().length>0)),new q("Start a new game",(()=>this.loadGame()))].forEach((t=>{t.shouldShow()&&e.appendChild(t.generate())})),this.screenContainer.appendChild(e)}showGames(){this.clearScreen();const e=document.createElement("div");e.className="load-games-screen";const t=n.loadGames(),s=[new U(`Load a game (${t.length} / 5)`)];t.forEach((e=>{s.push(new F([new q("🗑️",(()=>{n.deleteSavedGame(e.id),this.showGames()})),new q(`[${e.updatedAt.toJSON()}] ${e.data.guild.name}`,(()=>this.loadGame(e)),(()=>!0),!0)]))})),s.forEach((t=>{t.shouldShow()&&e.appendChild(t.generate())})),this.screenContainer.appendChild(e)}showMenu(){this.clearScreen();const e=document.createElement("div"),t=new U("Menu"),s=new q("Mute sound",(()=>this.toggleMute())),n=new q("Return to game",(()=>this.returnToGame()));e.appendChild(t.generate()),e.appendChild(s.generate()),e.appendChild(n.generate()),this.screenContainer.appendChild(e)}loadGame(e){this.clearScreen();const t=document.createElement("div");let s;t.id=x.CONTAINER,this.screenContainer.appendChild(t),s=e?de.fromJson(t,e):new de(t),s.start()}toggleMute(){}returnToGame(){this.showGame()}clearScreen(){this.screenContainer.innerHTML=""}}(document.getElementById("screen-container")).showLanding()})();