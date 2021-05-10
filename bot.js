//MELON USER ID : 837199039044124678 

//https://discord.com/api/oauth2/authorize?client_id=722860544817889331&permissions=67584&scope=bot 

// Run dotenv 
require('dotenv').config(); 

const Discord = require('discord.js'); 
const fs = require('fs'); 
const client = new Discord.Client(); 
var dshuID = "344250799414706188"; 
var roleID = "783897788030386207" //League ID: 783897788030386207   //testing role id: 838536842986258460
var melonID = ""; 
var melonLink = ""; 
var customArray = []; 
var flexArray = []; 
var idArray = []; 
var idFlexArray = []; 
var melonChannel = `837489334793273374`; //F&C ID: 837489334793273374   //testing ID: 838551921995415602 
var dshuTime = 0
var melonMessage = (`<@&${roleID}> \n:watermelon:: Customs \n:melon:: Flex` + `\nCurrent watermelons: ` + customArray.length + "\n" + customArray.join("\n") + "\n\nCurrent melons: " + flexArray.length + "\n" + flexArray.join("\n"))
var customAtSent = false; 
var flexAtSent = false; 


var cron = require('node-cron');

//6 *s -> seconds, minutes, hours, day of month, month, day of week  //24 hours time  //* = run every, i.e. * 0 0 * * *  = run every second for the 0th minute of the 0th hour of every day every year
cron.schedule('0 0 21 * * *', () => { 
	createWatermelonMessage(melonChannel); 
});

/*
cron.schedule('0 0 * * * *', () => { 
	dshuTime = (Math.round(Math.random()*59)); 
});


cron.schedule('0 * * * * *', () => { 
	let currentDate = new Date(); 
	if (dshuTime === currentDate.getMinutes()) { 
		client.channels.cache.get(melonChannel).send(`<@${dshuID}> is a shitter`).then(sent => { setTimeout(() => sent.delete(), 1000) }); 
	}
});
*/

client.on('ready', () => { 
    console.log(`Logged in as ${client.user.tag}!`); 
}); 

const filepath = "./melons.txt"; //store information to local text file (not paying for a server L0L) 



client.on('message', msg => { 
	
	if (msg.content.toLowerCase() === '🍉 help') { 

		msg.channel.send("```Melon Bot Commands: \n🍉 help: List of commands \n🍉 custom channel: Sets the channel it was sent in to the channel Melon Bot sends Custom Signups in \n🍉 new custom: Creates a new Custom Signup in the custom channel \n🍉 custom: Sends a link to the current custom signup```"); 
	}

	if (msg.content.toLowerCase() === '🍉 custom channel') { 

		melonChannel = msg.channel.id
		msg.channel.send("This is now the melon channel!"); 
		console.log(`melon channel set to ${melonChannel}!`); 
	}


	///* OLD - summoned watermelon message upon seeing a message.lower as "melon"
	if (msg.content.toLowerCase() === '🍉 new custom') { 

		createWatermelonMessage(melonChannel); //msg.channel
	
	}


	if (msg.content.toLowerCase() === '🍉 custom') { 
		
		if (melonID === "") { 
			msg.channel.send("There's no custom yet, silly!"); 
		} 
		else { 
			//embed link to message 
			const melonEmbed = new Discord.MessageEmbed() 
			.setColor('#0099ff') 
			.setDescription('[melon message](' + melonLink + ')') 
			msg.channel.send(melonEmbed); 
		}
	
	}




	//*/
	
}); 


//honestly thought this would be more difficult so I made it it's own function. It isn't difficult at all. 
function createWatermelonMessage(channelID) { 
	//channel.send(
	var customArray = []; 
	var flexArray = []; 
	var idArray = []; 
	var idFlexArray = []; 
	
	refreshMelonMessage(); 
	
	client.channels.cache.get(channelID).send(melonMessage) 
	.then(sent => { //sent is the most recently sent message  //Vishaal: it's prolly not most recent msg sent but the message sent by .send
		console.log('Hi');
		sent.react(`🍉`); 
		sent.react(`🍈`); 
		melonID = sent.id; 
		melonLink = sent.url; 
		customAtSent = false; 
		flexAtSent = false; 
		console.log(`sent melon message (ID: ${melonID})`); 
	}); 
		
} 

function refreshMelonMessage() {
	melonMessage = (`<@&${roleID}> \n:watermelon:: Customs \n:melon:: Flex` + `\nCurrent watermelons: ` + customArray.length + "\n" + customArray.join("\n") + "\n\nCurrent melons: " + flexArray.length + "\n" + flexArray.join("\n"))
}


//react to melons
client.on('messageReactionAdd', (reaction, user) => {
        let message = reaction.message, emoji = reaction.emoji;
		
		//only care about the reaction if it is a melon reaction on the melon message
		//also ignore reactions from the bot itself
		if (message.id === `${melonID}` && emoji.name === `🍉` && user.id !== client.user.id) {

			console.log(`Watermelon message reacted to`);
			
			//add username to list of melons:
			//get guild member from user, this lets server display name be used rather than the name from <Nickname####> tag format
			message.guild.members.fetch(user.id).then(member => {
				
				console.log(`by ` + member.displayName)

				/* #OLD#
				//check if first edit (to add the "Current Melons:" text)
				if (message.editedTimestamp === null) {
					message.edit(`${message.content}\nCurrent melons:\n${member.displayName}`);
				}
				//else just add name on to message
				else {
					message.edit(`${message.content}\n${member.displayName}`);
					const users = message.reaction.users.map(u => u.toString());
					console.log(users);
				}
				*/

				//adds the one who meloned to the custom array and edits message 
				customArray.push(member.displayName); 
				idArray.push(user.id);
				console.log(customArray); 

				refreshMelonMessage(); 
				message.edit(melonMessage); 

				if (customArray.length === 1) { reaction.users.remove(client.id) }

				if (customArray.length === 10 && customAtSent === false) {
					customAtSent = true; 
					print = ""; 
					for (i = 0; i < customArray.length; i++) { 
						print += `<@${idArray[i]}>, `; 
					}
					var print_me = print.slice(0, print.length - 2); 
					print_me += "\nThere are 10 members signed up for Customs!" 
					message.channel.send(print_me); 
			}

			});
									
		}


		if (message.id === `${melonID}` && emoji.name === `🍈` && user.id !== client.user.id) {

			console.log(`Melon message reacted to`);
			
			//add username to list of melons:
			//get guild member from user, this lets server display name be used rather than the name from <Nickname####> tag format
			message.guild.members.fetch(user.id).then(member => {
				
				console.log(`by ` + member.displayName);

				//adds the one who meloned to the custom array and edits message 
				flexArray.push(member.displayName); 
				idFlexArray.push(user.id);
				console.log(flexArray);

				refreshMelonMessage(); 
				message.edit(melonMessage); 
//`<@&${roleID}> :watermelon:` + `\nCurrent melons: ` + customArray.length + "\n" + customArray.join("\n")
				if (flexArray.length === 1) { reaction.users.remove(client.id) }

				if (flexArray.length === 5 && flexAtSent === false) { 
					flexAtSent = true; 
					print = ""; 
					for (i = 0; i < flexArray.length; i++) { 
						print += `<@${idFlexArray[i]}>, `; 
					}
					var print_me = print.slice(0, print.length - 2); 
					print_me += "\nThere are 5 members signed up for Flex!" 
					message.channel.send(print_me); 
			}

			});
									
		}

});


//react to unmelons
client.on('messageReactionRemove', (reaction, user) => {
        let message = reaction.message, emoji = reaction.emoji;
		
		//only care about the reaction if it is a melon reaction on the melon message
		if (message.id === `${melonID}` && emoji.name === `🍉` && user.id !== client.user.id) {
			
			console.log(`Watermelon message unreacted from`);
			
			//remove username from list of melons:
			//get guild member from user, this lets server display name be used rather than the name from <Nickname####> tag format
			message.guild.members.fetch(user.id).then(member => {
				
				console.log(`by ` + member.displayName); 

				var removeMe = member.displayName;

				/* #OLD#
				//remove name from list
				var newMsg = message.content.replace(member.displayName, '');
				message.edit(`${newMsg}`);
				*/

				//removes the one who unmeloned from the custom array and edits message 
				var temp; 
				for (i = 0; i < customArray.length; i++) { 
					if (customArray[i] === removeMe) {
						temp = customArray.slice(0, i).concat(customArray.slice(i+1, customArray.length)); 
						customArray = temp; 
						temp = idArray.slice(0, i).concat(idArray.slice(i+1, idArray.length)); 
						idArray = temp; 
					}
				}
				console.log(customArray); 

				refreshMelonMessage(); 
				message.edit(melonMessage); 

				if (customArray.length === 0) { message.react(`🍉`) } 

			});
 
		}

		//🍈 
		if (message.id === `${melonID}` && emoji.name === `🍈` && user.id !== client.user.id) {
			
			console.log(`Melon message unreacted from`);
			
			//remove username from list of melons:
			//get guild member from user, this lets server display name be used rather than the name from <Nickname####> tag format
			message.guild.members.fetch(user.id).then(member => {
				
				console.log(`by ` + member.displayName); 

				var removeMe = member.displayName;

				/* #OLD#
				//remove name from list
				var newMsg = message.content.replace(member.displayName, '');
				message.edit(`${newMsg}`);
				*/

				//removes the one who unmeloned from the custom array and edits message 
				var temp; 
				for (i = 0; i < flexArray.length; i++) { 
					if (flexArray[i] === removeMe) {
						temp = flexArray.slice(0, i).concat(flexArray.slice(i+1, flexArray.length)); 
						flexArray = temp; 
						temp = idFlexArray.slice(0, i).concat(idFlexArray.slice(i+1, idFlexArray.length)); 
						idFlexArray = temp; 
					}
				}
				console.log(flexArray); 

				refreshMelonMessage(); 
				message.edit(melonMessage); 

				if (flexArray.length === 0) { message.react(`🍈`) } 

			});
 
		}

});

client.login(process.env.DISCORD_TOKEN);