var game = new Phaser.Game(200, 150, Phaser.AUTO, 'gameDiv');

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
		
		
		
		this.disconeg = game.add.sprite(89, 0, 'disconeg');
		this.discoball = game.add.sprite(89, 0, 'discoball');
		this.disconeg.scale.setTo(1.2);
		this.discoball.scale.setTo(1.2);
		game.physics.arcade.enable(this.discoball);
		//bullet fire rate
		this.fireRate = 200;
		this.nextFire = 0;
		
		//bullets
		this.bullets = game.add.group();
		this.bullets.enableBody = true;
		this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
		this.bullets.createMultiple(1, 'bullet');
		this.bullets.setAll('checkWorldBounds', true);
		this.bullets.setAll('outOfBoundsKill', true);
		
		this.rt = 1000;		
		
		//rays of light from the disco ball things
		this.lines = game.add.group();
		this.lines.enableBody = true;
		this.lines.physicsBodyType = Phaser.Physics.ARCADE;
		this.lines.createMultiple(50, 'line');
		this.lines.elementOrder = [];
				
		this.timer = game.time.events.loop(this.rt, this.disco, this);   
   },

   update: function() {
    	game.physics.arcade.overlap(this.discoball, this.bullets, this.showNeg, null, this);  
    	game.physics.arcade.overlap(this.heart, this.lines, this.hitPlayer, null, this);
    	
    	game.world.bringToTop(this.heart);
    	game.world.bringToTop(this.disconeg);
    	game.world.bringToTop(this.discoball);
    	
      if (game.input.activePointer.isDown){
			this.fire();
		}
		
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
		
		
   },
   
	fire: function(){
		if (game.time.now > this.nextFire && this.bullets.countDead() > 0){
			this.nextFire = game.time.now + this.fireRate;

			this.bullet = this.bullets.getFirstDead();
			this.bullet.scale.setTo(0.6, 0.6);

			this.bullet.reset(this.heart.x + 5, this.heart.y);
			
			firstElement = [];
			this.lines.elementOrder.push(this.lines);
			firstElement = this.lines.elementOrder[0];
			firstElement = this.lines.elementOrder.pop(0);
			firstElement.kill();
			
			this.bullet.body.velocity.y = -300;
		}
		

	},
	
	disco: function(){
		r = Math.random();	
		this.rt = r * 200;
		if(r < 0.5){
			this.ray = this.lines.getFirstDead();
			this.ray.scale.setTo(2, 1);
			this.ray.tint = 16777215;
			this.ray.reset(101, 20);
			this.ray.angle = -90;
			this.ray.body.angularVelocity = 100;
		}else{
			this.ray = this.lines.getFirstDead();
			this.ray.scale.setTo(2, 1);
			this.ray.reset(101, 20);
			this.ray.tint = 17341377;
			this.ray.angle = -90;
			this.ray.body.angularVelocity = 100;
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
   
   hitPlayer: function(){
   	console.log("ok.");
   	if(this.lines.getAt(0).tint == 16777215){
   		this.lines.getAt(0).kill();
   		alert("NOOB PLAYER LOLOLOLOLOLOLOL");
   	}else{
			alert("lucky");   	
   	}
   },
    
   
   showReg: function(){
   	this.discoball.alpha = 1;
   },
};

game.state.add('main', mainState);  
game.state.start('main'); 