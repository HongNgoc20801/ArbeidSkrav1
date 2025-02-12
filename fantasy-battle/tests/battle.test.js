const { Character, Enemy, handleCharacterCreation, handleEnemyGeneration, startBattle } = require('../app');

describe('Character class', () => {
    test('should create a character with correct properties', () => {
        const character = new Character('Hero', 100, 30, 'hero.jpg');
        expect(character.name).toBe('Hero');
        expect(character.hp).toBe(100);
        expect(character.attackDamage).toBe(30);
        expect(character.profileImage).toBe('hero.jpg');
    });

    test('should save character to localStorage', () => {
        const character = new Character('Hero', 100, 30, 'hero.jpg');
        character.saveToLocalStorage();
        expect(JSON.parse(localStorage.getItem('character'))).toEqual(character);
    });
});

describe('Enemy class', () => {
    test('should generate a random enemy', () => {
        const enemy = Enemy.generateRandomEnemy();
        expect(['Goblin', 'Ork', 'Dragon']).toContain(enemy.name);
        expect(enemy.hp).toBeGreaterThanOrEqual(50);
        expect(enemy.hp).toBeLessThanOrEqual(150);
        expect(enemy.attackDamage).toBeGreaterThanOrEqual(10);
        expect(enemy.attackDamage).toBeLessThanOrEqual(40);
    });

    test('should save enemy to localStorage', () => {
        const enemy = new Enemy('Ork', 120, 25, 'ork.jpg');
        enemy.saveToLocalStorage();
        expect(JSON.parse(localStorage.getItem('enemy'))).toEqual(enemy);
    });
});

describe('Battle function', () => {
    beforeEach(() => {
        // Tạo một container giả trong jsdom để tránh lỗi
        document.body.innerHTML = `
            <div id="battle-result"></div>
            <div id="battle-area"></div>
        `;
    });

    test('should return correct battle result', () => {
        const character = new Character('Hero', 100, 30, 'hero.jpg');
        const enemy = new Enemy('Ork', 80, 20, 'ork.jpg');

        character.saveToLocalStorage();
        enemy.saveToLocalStorage();

        const result = startBattle();

        expect(["Du vant!", "Du tapte!", "Uavgjort!"]).toContain(result);
        expect(document.getElementById('battle-result').innerText).toBe(result);
    });
});

