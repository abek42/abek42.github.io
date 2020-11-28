let evtID=0;
		let gameState={bushes:[]};
		
		/*
		Behaviour:
			When a-z and 0-9 are pressed, 
				Identify one bush which is currently not popping
				Pop-up one letter from the selected bush
				Set repeater to pop-up more letters of same type from that one bush every 300ms
			When other keys are pressed	
				Identify one bush which is currently not popping
				Pop-sideways one character from the selected bush
				Set repeater to pop-sideways more letters of same type from that one bush every 300ms
			When any key is released
				Identify the repeater id and clear it
				Pop one last charactner from the selected bush
			Popped behaviour
				Create new node,
				Attach texture
				Move in a specified direction
				Lost transparency at a specific rate
				When all animations complete, remove from node-list
		*/
		function registerListeners(){
			console.log("Registering Listeners");
			document.addEventListener('keydown',function(evt){
				//console.log("keydown",evt,evt.keyCode,evt.key);
				let action=getAction(evt.keyCode,evt.key);
				
				let bushIdx = getBush(true,evt.keyCode,evt.key);
				if(bushIdx<0){//new key
					bushIdx = getBush(false);
					if(bushIdx<0){//too many active
						return;
					}
				}
				updateBush(bushIdx,action);
				
			});
			
			document.addEventListener('keyup',function(evt){
				//clearRepeater(evt.keyCode);
				let bush=gameState.bushes[getBush(true,evt.keyCode,evt.key)];
				if(bush){//we should always be able to find the correct bush
					//spawn(bush);
					bush.active=false;
					bush.action=null;
				}
				else{//not sure why this will even happen
					let state="KeyUp: "+evt.keyCode+" ";
					gameState.bushes.forEach((bush,idx)=>{
						state+="[" + idx+": "+bush.active+", action:";
						state+= bush.action?(bush.action.key+"="+bush.action.kc):"null";
						state+="], ";
						
					});
					console.log("Lost bush",evt.key,state);
				}
				
			},false);
			
			document.addEventListener('mousedown',function(){
				//create a random char
				let rndChar = (Math.floor(Math.random()*20)<6)?
									(Math.floor(Math.random()*26)+65):
									(Math.floor(Math.random()*10)+48);	
				let bushIdx = getBush(false);
				if(bushIdx<0){//too many active
						return;
					}
				updateBush(bushIdx,getAction(rndChar,String.fromCharCode(rndChar)));
				//we don't run repeats for mousedown/taps
				gameState.bushes[bushIdx].active=false;
				gameState.bushes[bushIdx].action=null;
				
			});
			
			document.onkeydown = function (e) {
				e = e || window.event;//Get event

				if (!(e.ctrlKey||e.altKey)) return;

				//break every fucking key...
				e.preventDefault();
				e.stopPropagation();
				
			};
			const keyDown = document.createEvent("KeyboardEvent");
			const keyUp = document.createEvent("KeyboardEvent");
			const initMethod = typeof keyboardEvent.initKeyboardEvent !== 'undefined' ? "initKeyboardEvent" : "initKeyEvent";

			keyDown[initMethod](
			  "keydown", // event type: keydown, keyup, keypress
			  true,      // bubbles
			  true,      // cancelable
			  window,    // view: should be window
			  false,     // ctrlKey
			  false,     // altKey
			  false,     // shiftKey
			  false,     // metaKey
			  40,        // keyCode: unsigned long - the virtual key code, else 0
			  0          // charCode: unsigned long - the Unicode character associated with the depressed key, else 0
			);
			
			keyUp[initMethod](
			  "keyup",  true, true, window, false, false, false, false, 40,
			  0);
			

			setInterval(function(){
				document.dispatchEvent(keyDown);
				setTimeout(function(){ 
					document.dispatchEvent(keyUp);
				},200);
			},1200)
			
		}
		
		function spawn(hnd){
			
			let texRef = hnd.action.show+(hnd.action.isLetter?"0":"");
			let colRef = ["f0f","f00","080","f80"][Math.floor(Math.random()*4)];
			let dirAnim = ["xMzM","xMzP","xPzM","xPzP"][Math.floor(Math.random()*4)];
			
			if(hnd.action.isLetter){
				dirAnim="floatUp";
				//temp debug
				//texRef = String.fromCharCode((hnd.action.kc-65)%10 + 65).toLowerCase()+"0";
			}
			else{
				colRef="fff";
			}
			let material=("src:#@REF;repeat:1;transparent:true;opacity:1;color:#@COL").replace("@REF",texRef).replace("@COL",colRef);
			let hndTemplate=document.getElementById("template");
			let clone =hndTemplate.cloneNode(true);
			clone.setAttribute("material",material);
			clone.setAttribute("mixin","poof "+dirAnim);
			clone.setAttribute("id",nonCryptHash(colRef+texRef+Math.floor(Math.random()*1000),"id_"));
			
			hnd.bushHnd.appendChild(clone);
			clone.addEventListener('animationcomplete',function(){
				//console.log("Poof");
				hnd.bushHnd.remove(this);
			},false);
		}
		
		function updateBush(bushIdx,action){
			let bush = gameState.bushes[bushIdx];
			if(bush.active){
				bush.instances++;	
			}else{
				bush.instances=0;
				bush.active=true;
				bush.action=action;
			};
				
		//if here, we have a bushHnd
			if(bush.instances<5)
				spawn(bush);
		}
		
		function nonCryptHash(text,pre=""){
			var hash = 0;
			if (text.length == 0) {
				return pre+hash;
			}
			for (var i = 0; i < text.length; i++) {
				var charI = text.charCodeAt(i);
				hash = ((hash<<5)-hash)+charI;
				hash = hash & hash; // Convert to 32bit integer
			}
			return pre+hash;
		}
		
		function getAction(kc,key){
			//console.log("TBD>getAction",kc,key);
			let action={isLetter:false,show:"TBD","key":key,"kc":kc};
			if(48<=kc && kc<=57){
				action.isLetter=true;
				action.show="n"+key;
			}
			if(65<=kc && kc<=90){
				action.isLetter=true;
				action.show=(key+"").toLowerCase();
			}
			if(!action.isLetter){
				action.show=["highcow","kharu","meow","woof"][Math.floor(Math.random()*4)];
			}
			
			return action;
		}
		
		function getBush(forKey,kc,key){
			if(gameState.bushes.length==0){
				let b=document.getElementsByClassName("bush");
				for(let i=0;i<b.length;i++){
					gameState.bushes.push({bushHnd:b[i],active:false});
				}
				//return (getBush(forKey,kc,key));
			}
			
			let bushIdx = -1;
			if(!forKey){
				let tmp = [];
				gameState.bushes.forEach((item,idx)=>{//collect all the inactive bushes
					if(!item.active) tmp.push(idx);
				})
				//select one of the indices at random
				bushIdx = tmp.length>0?tmp[Math.floor(Math.random()*tmp.length)]:bushIdx;
			}
			else{
				bushIdx=gameState.bushes.findIndex(b=>b.action&&(b.action.kc==kc));
			}
			return bushIdx;
		
		}