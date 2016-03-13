var game = new Phaser.Game(200, 170, Phaser.AUTO, 'gameDiv');


var mainState = {

   preload: function() { 
		//blackground color
		//LOL i'm funny
		game.stage.backgroundColor = '#000000';
		
		//loading images
		game.load.image('heart', 'heart.png');
		game.load.image('bullet', 'bullet.png');
		game.load.image('box', 'box.png');
		game.load.image('disconeg', 'negativedisco.png');
		game.load.image('discoball', 'discoball.png');
		game.load.image('line', 'line.png');
		game.load.image('bline', 'blackline.png');
		game.load.image('health', 'health.png');
		game.load.image('healthBar', 'healthBar.png');
       
		this.game.scale.pageAlignHorizontally = true;
		this.game.scale.pageAlignVeritcally = true;
		this.game.scale.refresh();
	},

    create: function() { 
      //physics system
		game.physics.startSystem(Phaser.Physics.ARCADE);

		this.bg = this.game.add.sprite(0, 0, 'box')
		this.heart = this.game.add.sprite(95, 100, 'heart');
		this.bound = this.game.add.sprite(5, 5, 'bline');
		game.physics.arcade.enable(this.bound);
		game.physics.arcade.enable(this.heart);
		
		this.control;
   	//true is mouse, false is z.
        
		this.healthBar = this.game.add.sprite(90, 160, 'healthBar');
		this.health = this.game.add.sprite(90, 160, 'health');
        
		this.score = 0;
		
		this.disconeg = game.add.sprite(89, 0, 'disconeg');
		this.discoball = game.add.sprite(89, 0, 'discoball');
		this.disconeg.scale.setTo(1.2);
		this.discoball.scale.setTo(1.2);
		game.physics.arcade.enable(this.discoball);
		
		//bullet fire rate
		this.fireRate = 200;
		this.nextFire = 0;
		this.hp = 8;
       
		//bullets
		this.bullets = game.add.group();
		this.bullets.enableBody = true;
		this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
		this.bullets.createMultiple(1, 'bullet');
		this.bullets.setAll('checkWorldBounds', true);
		this.bullets.setAll('outOfBoundsKill', true);
		this.speed;
		
		//rays of light from the disco ball things
		this.lines = game.add.group();
		this.lines.enableBody = true;
		this.lines.physicsBodyType = Phaser.Physics.ARCADE;
		this.lines.createMultiple(50, 'line');
		this.lines.elementOrder = []; 
		this.between;
		
		this.pauseKey = game.input.keyboard.addKey(Phaser.Keyboard.P);
		this.pauseKey.onDown.add(this.pauseFunc, this);
		this.zKey = game.input.keyboard.addKey(Phaser.Keyboard.Z);
      this.healthBar.scale.setTo(1.6, 1);
				
		this.timer = game.time.events.loop(this.between, this.disco, this);   
    },

    update: function() {
    	game.physics.arcade.overlap(this.discoball, this.bullets, this.showNeg, null, this);  
    	game.physics.arcade.overlap(this.heart, this.lines, this.hitPlayer, null, this);
    	
    	game.world.bringToTop(this.heart);
    	game.world.bringToTop(this.disconeg);
    	game.world.bringToTop(this.discoball);
    	//the score because I can't find a better way to do it don't judge
   	document.getElementById("score").innerHTML = this.score/100 + "s";
        
      this.health.scale.setTo(this.hp, 1);
   	if(this.speed >= 175 && this.speed < 181){
			if(this.score >= 5000){
				this.speed = 180;	
			}   	
   	}
   	
   	if(this.control == true){
      	if (game.input.activePointer.isDown){
				this.fire();
			}
		}else if(this.control == false){
			this.zKey.onDown.add(this.fire, this);
		}
		
		this.rt = Math.random() * 100;
		//extreme measures!!!
		if(this.lines.getAt(0).angle >= 90){
			this.lines.getAt(0).kill();	
		}
		if(this.lines.getAt(1).angle >= 90){
			this.lines.getAt(1).kill();	
		}
		if(this.lines.getAt(2).angle >= 90){
			this.lines.getAt(2).kill();	
		}
		if(this.lines.getAt(3).angle >= 90){
			this.lines.getAt(3).kill();	
		}
		
        if(this.hp <= 0){
           game.state.start("start");
           this.score = 0;
        }
    },
   
   
   
    pauseFunc:function(){
   	    game.paused = !game.paused;
    },
   
    fire: function(){
		if (game.time.now > this.nextFire && this.bullets.countDead() > 0){
			this.nextFire = game.time.now + this.fireRate;

			this.bullet = this.bullets.getFirstDead();
			this.bullet.scale.setTo(0.6, 0.6);

			
			this.bullet.reset(this.heart.x + 5, this.heart.y);
			this.bullet.body.velocity.y = -375;
		}
		

	},
	
	disco: function(){
		r = Math.random();	
		if(r < 0.55){
			this.ray = this.lines.getFirstDead();
			this.lines.elementOrder.push(this.ray); 
			this.ray.scale.setTo(2, 1);
			this.ray.tint = 16777215;
			this.ray.reset(101, 20);
			this.ray.angle = -90;
			this.ray.body.angularVelocity = this.speed;
		}else{
			this.ray = this.lines.getFirstDead();
			this.lines.elementOrder.push(this.ray); 
			this.ray.scale.setTo(2, 1);
			this.ray.reset(101, 20);
			this.ray.tint = 17341377;
			this.ray.angle = -90;
			this.ray.body.angularVelocity = this.speed;
		}
	},
	
	showNeg: function(){
   	this.discoball.alpha = 0;
   	this.bullet.kill();
   	for (var i = 0, len = this.lines.children.length; i < len; i++) { 
   		if(this.lines.getAt(i).tint == 16777215){
   			this.lines.getAt(i).tint = 17341377;
   		}else if(this.lines.getAt(i).tint == 17341377){
   			this.lines.getAt(i).tint = 16777215;
   		} 
   	}
   	
		game.time.events.add(100, this.showReg, this);
   },
   
   hitPlayer: function(player, who){
   	if(this.lines.children.length > 0){
			if(who.tint == 16777215 && who.angle > -2 && who.angle < 2){
				this.hp -= 1;
			}else{
				this.score += 1;			
			}
			
   	}   
   },
    
   
   showReg: function(){
   	this.discoball.alpha = 1;
   },
};


var startState = {
    preload: function() { 
      game.stage.backgroundColor = '#000000';
        
      game.load.image('box', 'box.png');
      game.load.image('easy', 'easy.png');
      game.load.image('sel', 'seldif.png');
      game.load.image('hard', 'hard.png');
      game.load.audio('ohyes', ['ohyes.mp3', 'ohyes.ogg', 'ohyes.wav']);
      
		this.game.scale.pageAlignHorizontally = true;
		this.game.scale.pageAlignVeritcally = true;
		this.game.scale.refresh();
	},

    create: function() { 
		this.bg = this.game.add.sprite(0, 0, 'box');
		this.sel = this.game.add.sprite(5, 5, 'sel');
    	this.easyMode = game.add.button(game.world.centerX - 75, 40, 'easy', this.easyAction, this, 2, 1, 0);
    	this.hardMode = game.add.button(game.world.centerX - 75, 90, 'hard', this.hardAction, this, 2, 1, 0)
    },

    update: function() {
    	
    },
        
    easyAction: function(){
    	mainState.speed = 125;
    	mainState.between = 900;
    	document.getElementById('ohyes').play();
		game.time.events.add(1200, this.startGame, this);
    },
    
    hardAction:function(){
    	mainState.speed = 175;
    	mainState.between = 800;
    	document.getElementById('ohyes').play();
		game.time.events.add(1200, this.startGame, this);
    },
    
    startGame: function(){
    	game.state.start('main');
    },
};

game.state.add('main', mainState);  
game.state.add('start', startState);  
game.state.start('start'); 