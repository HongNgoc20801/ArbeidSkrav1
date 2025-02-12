class Character {
    constructor(name, hp, attackDamage, profileImage) {
        this.name = name;
        this.hp = hp;
        this.attackDamage = attackDamage;
        this.profileImage = profileImage;
    }

    saveToLocalStorage() {
        localStorage.setItem('character', JSON.stringify(this));
    }

    static loadFromLocalStorage() {
        const data = localStorage.getItem('character');
        return data ? JSON.parse(data) : null;
    }
}

class Enemy {
    constructor(name, hp, attackDamage, profileImage) {
        this.name = name;
        this.hp = hp;
        this.attackDamage = attackDamage;
        this.profileImage = profileImage;
    }

    saveToLocalStorage() {
        localStorage.setItem('enemy', JSON.stringify(this));
    }

    static loadFromLocalStorage() {
        const data = localStorage.getItem('enemy');
        return data ? JSON.parse(data) : null;
    }

    static generateRandomEnemy() {
        const names = ['Goblin', 'Ork', 'Dragon'];
        const images = ['assets/monster.jpg', 'assets/swamp-monster.jpg', 'assets/dragon.jpg'];

        const randomIndex = Math.floor(Math.random() * names.length);
        const hp = Math.floor(Math.random() * (150 - 50 + 1)) + 50;
        const attackDamage = Math.floor(Math.random() * (40 - 10 + 1)) + 10;

        return new Enemy(names[randomIndex], hp, attackDamage, images[randomIndex]);
    }
}

function handleCharacterCreation() {
    const name = document.getElementById('character-name').value.trim();
    const hp = parseInt(document.getElementById('character-hp').value);
    const attackDamage = parseInt(document.getElementById('attack-damage').value);
    const selectedImage = document.querySelector('.profile-img.selected')?.src;
    
    if (!name || isNaN(hp) || isNaN(attackDamage) || !selectedImage) {
        alert('Vennligst fyll ut alle feltene riktig og velg et profilbilde.');
        return;
    }
    
    const character = new Character(name, hp, attackDamage, selectedImage);
    character.saveToLocalStorage();
    alert('Karakteren er lagret!');
}

function handleEnemyGeneration() {
    const enemy = Enemy.generateRandomEnemy();
    enemy.saveToLocalStorage();
    
    document.getElementById('enemy-img').src = enemy.profileImage;
    document.getElementById('enemy-name').innerText = `Fiende: ${enemy.name}`;
    document.getElementById('enemy-hp').innerText = `HP: ${enemy.hp}`;
    document.getElementById('enemy-attack').innerText = `Angrepsstyrke: ${enemy.attackDamage}`;
}

function startBattle() {
    const characterData = Character.loadFromLocalStorage();
    const enemyData = Enemy.loadFromLocalStorage();

    if (!characterData || !enemyData) {
        alert('Både en karakter og en fiende må være opprettet før kamp!');
        return null; // Trả về null nếu không có dữ liệu
    }

    const character = new Character(characterData.name, characterData.hp, characterData.attackDamage, characterData.profileImage);
    const enemy = new Enemy(enemyData.name, enemyData.hp, enemyData.attackDamage, enemyData.profileImage);

    character.hp -= enemy.attackDamage;
    enemy.hp -= character.attackDamage;

    let resultText = "";
    if (character.hp > enemy.hp) {
        resultText = "Du vant!";
    } else if (enemy.hp > character.hp) {
        resultText = "Du tapte!";
    } else {
        resultText = "Uavgjort!";
    }

    document.getElementById('battle-result').innerText = resultText;
    displayBattleCharacters(character, enemy);

    return resultText; // ✅ Trả về kết quả để test không bị undefined
}


function displayBattleCharacters(character, enemy) {
    const battleArea = document.getElementById('battle-area');
    if (!battleArea) return; // Thêm kiểm tra để tránh lỗi

    battleArea.innerHTML = `
        <div id="character-display" class="profile-card">
            <h2>Helten</h2>
            <img src="${character.profileImage}" alt="Profilbilde" />
            <p>Navn: ${character.name}</p>
            <p>HP: ${character.hp}</p>
            <p>Angrepsstyrke: ${character.attackDamage}</p>
        </div>
        <div id="enemy-fight-display" class="profile-card">
            <h2>Fiende</h2>
            <img src="${enemy.profileImage}" alt="Fiendens profilbilde" />
            <p>Navn: ${enemy.name}</p>
            <p>HP: ${enemy.hp}</p>
            <p>Angrepsstyrke: ${enemy.attackDamage}</p>
        </div>
        <p id="battle-result">${document.getElementById('battle-result')?.innerText || ''}</p>
    `;
}


document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.profile-img').forEach(img => {
        img.addEventListener('click', function () {
            document.querySelectorAll('.profile-img').forEach(img => img.classList.remove('selected'));
            this.classList.add('selected');
        });
    });

    document.getElementById('create-character').addEventListener('click', handleCharacterCreation);
    document.getElementById('generate-enemy').addEventListener('click', handleEnemyGeneration);
    document.getElementById('start-fight').addEventListener('click', startBattle);
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Character, Enemy, handleCharacterCreation, handleEnemyGeneration, startBattle };
}
