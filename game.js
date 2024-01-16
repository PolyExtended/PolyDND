// game.js

let player = {
  health: 100,
  inventory: [],
  quests: []
};

function exploreRoom(direction) {
  let roomDescription = "";

  // Randomly generate a room event
  const event = getRandomEvent();

  switch (event.type) {
    case 'monster':
      roomDescription = `Oh no! You encountered a ${event.name}!`;

      // Player fights the monster
      const damageTaken = Math.floor(Math.random() * 20) + 2;
      player.health = Math.max(0, player.health - damageTaken);
      roomDescription += `<br>You took ${damageTaken} damage. Your health: ${player.health}`;
      break;

    case 'treasure':
      roomDescription = `You found a treasure chest!`;

      // Player gains loot
      const loot = getRandomLoot();
      player.inventory.push(loot);
      roomDescription += `<br>You obtained ${loot}. Your inventory: ${player.inventory.join(', ')}`;
      break;

    case 'health':
      roomDescription = `You found a healing spring!`;

      // Player recovers health
      const healingAmount = Math.floor(Math.random() * 20) + 1;
      player.health = Math.min(100, player.health + healingAmount);
      roomDescription += `<br>You healed for ${healingAmount}. Your health: ${player.health}`;
      break;

    case 'quest':
      roomDescription = `You stumbled upon a quest!`;

      // Player receives a quest
      const quest = getRandomQuest();
      player.quests.push(quest);
      roomDescription += `<br>New Quest: ${quest.description}`;
      break;

    case 'empty':
    default:
      roomDescription = "You find yourself in an empty room.";
      break;
  }

  // Update room description
  document.getElementById('room-description').innerHTML = roomDescription;

  // Update player status
  updatePlayerStatus();
  updateButtons(); // Add this line to update buttons based on quests
}

function getRandomEvent() {
  const events = [
    { type: 'empty' },
    { type: 'monster', name: 'Goblin' },
    { type: 'monster', name: 'Skeleton' },
    { type: 'treasure' },
    { type: 'health' },
    { type: 'quest' },
    { type: 'empty' }
    // Add more events as needed
  ];

  return events[Math.floor(Math.random() * events.length)];
}

function getRandomLoot() {
  const lootItems = ['Gold Coin', 'Health Potion', 'Magic Scroll', 'Silver Key'];
  return lootItems[Math.floor(Math.random() * lootItems.length)];
}

function getRandomQuest() {
  const questDescriptions = ['Find the Lost PolySword', 'Rescue the Poly Villagers', 'Defeat the PolyDragon', 'Retrieve the Poly Artifact'];
  const questRewards = ['Experience Points', 'Rare Item', 'Gold Coins'];

  const randomDescription = questDescriptions[Math.floor(Math.random() * questDescriptions.length)];
  const randomReward = questRewards[Math.floor(Math.random() * questRewards.length)];

  return {
    description: randomDescription,
    reward: randomReward
  };
}

function updatePlayerStatus() {
  // Update health progress bar
  const healthProgress = document.getElementById('health-progress');
  healthProgress.style.width = `${player.health}%`;
  healthProgress.innerText = `Health: ${player.health}%`;

  // Update player status
  document.getElementById('player-health').innerText = `Health: ${player.health}`;
  document.getElementById('player-inventory').innerText = `Inventory: ${player.inventory.join(', ')}`;
  document.getElementById('player-quests').innerText = `Quests: ${player.quests.map(quest => quest.description).join(', ')}`;
}

function updateButtons() {
  // Enable or disable buttons based on quests
  const questButtons = document.querySelectorAll('.quest-button');

  questButtons.forEach(button => {
    const questId = button.getAttribute('data-quest-id');
    const quest = player.quests.find(q => q.description === questId);

    if (quest) {
      button.disabled = false;
      button.addEventListener('click', () => completeQuest(quest));
    } else {
      button.disabled = true;
      button.removeEventListener('click', () => completeQuest(quest));
    }
  });
}

function completeQuest(quest) {
  // Implement quest completion logic here
  // For now, let's just remove the quest from the player's list
  const questIndex = player.quests.findIndex(q => q.description === quest.description);
  if (questIndex !== -1) {
    player.quests.splice(questIndex, 1);
    updatePlayerStatus();
    updateButtons();
  }
}

// Load saved game progress on page load
document.addEventListener('DOMContentLoaded', function () {
  const savedProgress = localStorage.getItem('gameProgress');
  if (savedProgress) {
    const { direction, player: savedPlayer } = JSON.parse(savedProgress);
    player = savedPlayer;
    exploreRoom(direction);
  }
});
