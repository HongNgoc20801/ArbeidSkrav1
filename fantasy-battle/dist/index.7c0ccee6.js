document.addEventListener("DOMContentLoaded", ()=>{
    // DOM elements
    const characterNameInput = document.getElementById("character-name");
    const characterHpInput = document.getElementById("character-hp");
    const attackDamageInput = document.getElementById("attack-damage");
    const profileImages = document.querySelectorAll(".profile-img");
    const createCharacterButton = document.getElementById("create-character");
    const generateEnemyButton = document.getElementById("generate-enemy");
    const battleArea = document.getElementById("battle-area");
    const enemyDisplay = document.getElementById("enemy-display");
    let selectedProfileImage = "assets/death-knight.jpeg"; // Default image
    // ✅ Chọn hình ảnh cho nhân vật
    profileImages.forEach((img)=>{
        img.addEventListener("click", ()=>{
            selectedProfileImage = img.src;
            profileImages.forEach((img)=>img.classList.remove("selected"));
            img.classList.add("selected");
        });
    });
    // ✅ Tạo nhân vật với giới hạn HP và Damage hợp lệ
    function createCharacter() {
        const name = characterNameInput.value.trim() || "Ukjent Helt";
        let hp = parseInt(characterHpInput.value) || 100;
        let attack = parseInt(attackDamageInput.value) || 10;
        hp = Math.max(50, Math.min(hp, 150));
        attack = Math.max(5, Math.min(attack, 50));
        const character = {
            name,
            hp,
            attack,
            profileImage: selectedProfileImage
        };
        localStorage.setItem("character", JSON.stringify(character));
        localStorage.removeItem("enemy");
        localStorage.removeItem("battleResult");
        alert("Karakter opprettet!");
        updateUI();
    }
    // ✅ Tạo enemy ngẫu nhiên và hiển thị ngay lập tức
    function generateEnemy() {
        const enemyNames = [
            "Goblin",
            "Ork",
            "Drage"
        ];
        const enemyImages = [
            "assets/monster.jpg",
            "assets/swamp-monster.jpg",
            "assets/dragon.jpg"
        ];
        const randomIndex = Math.floor(Math.random() * enemyNames.length);
        const enemy = {
            name: enemyNames[randomIndex],
            hp: Math.floor(Math.random() * 101) + 50,
            attack: Math.floor(Math.random() * 31) + 10,
            profileImage: enemyImages[randomIndex]
        };
        localStorage.setItem("enemy", JSON.stringify(enemy));
        // ✅ Gọi hiển thị ngay lập tức
        displayEnemy(enemy);
        updateUI();
    }
    // ✅ Hiển thị enemy profile ngay khi tạo
    function displayEnemy(enemy) {
        enemyDisplay.innerHTML = `
            <h2>Fiende</h2>
            <img src="${enemy.profileImage}" alt="Fiendens profilbilde" class="profile-img" />
            <p>Navn: ${enemy.name}</p>
            <p>Start HP: ${enemy.hp}</p>
            <p>Angrepsstyrke: ${enemy.attack}</p>
        `;
    }
    // ✅ Hiển thị UI của trận đấu (Cả trước và sau trận đấu)
    function updateUI() {
        const character = JSON.parse(localStorage.getItem("character"));
        const enemy = JSON.parse(localStorage.getItem("enemy"));
        const battleResult = JSON.parse(localStorage.getItem("battleResult"));
        battleArea.innerHTML = ""; // Reset nội dung cũ
        if (character) battleArea.innerHTML += `
                <div class="battle-container">
                    <div id="character-display" class="profile-card">
                        <h2>Helten</h2>
                        <img src="${character.profileImage}" alt="Profilbilde" />
                        <p>Navn: ${character.name}</p>
                        <p>Start HP: ${character.hp}</p>
                        <p>Angrepsstyrke: ${character.attack}</p>
                    </div>
            `;
        if (enemy) {
            battleArea.innerHTML += `
                <div id="enemy-display" class="profile-card">
                    <h2>Fiende</h2>
                    <img src="${enemy.profileImage}" alt="Fiendens profilbilde" />
                    <p>Navn: ${enemy.name}</p>
                    <p>Start HP: ${enemy.hp}</p>
                    <p>Angrepsstyrke: ${enemy.attack}</p>
                </div>
            `;
            // ✅ Hiển thị profile enemy ngay lập tức sau khi load lại trang
            displayEnemy(enemy);
        }
        battleArea.innerHTML += `</div>`; // Kết thúc battle-container
        // ✅ Nếu cả hai đã tồn tại, hiển thị nút "Start kamp"
        if (character && enemy) {
            battleArea.innerHTML += `<button id="start-fight">Start kamp</button>`;
            document.getElementById("start-fight").addEventListener("click", startBattle);
        }
        // ✅ Nếu có kết quả trận đấu, hiển thị ngay lập tức
        if (battleResult) displayBattleResult(battleResult.initialCharacterHp, battleResult.characterHp, battleResult.initialEnemyHp, battleResult.enemyHp, battleResult.result);
    }
    // ✅ Bắt đầu giao tranh và tính toán HP sau trận đấu
    function startBattle() {
        const character = JSON.parse(localStorage.getItem("character"));
        const enemy = JSON.parse(localStorage.getItem("enemy"));
        if (!character || !enemy) {
            alert("Manglende karakter eller fiende!");
            return;
        }
        const initialCharacterHp = character.hp;
        const initialEnemyHp = enemy.hp;
        const characterFinalHp = Math.max(character.hp - enemy.attack, 0);
        const enemyFinalHp = Math.max(enemy.hp - character.attack, 0);
        let result = "Uavgjort!";
        if (characterFinalHp > enemyFinalHp) result = "\uD83C\uDF89 Du vant!";
        else if (characterFinalHp < enemyFinalHp) result = "\uD83D\uDC80 Du tapte!";
        localStorage.setItem("battleResult", JSON.stringify({
            result,
            initialCharacterHp,
            characterHp: characterFinalHp,
            initialEnemyHp,
            enemyHp: enemyFinalHp
        }));
        updateUI();
    }
    // ✅ Hiển thị kết quả trận đấu (HP trước và sau)
    function displayBattleResult(initialCharacterHp, characterHp, initialEnemyHp, enemyHp, result) {
        battleArea.innerHTML += `
            <div class="battle-result">
                <h2>\u{2694}\u{FE0F} Resultat av kampen \u{2694}\u{FE0F}</h2>
                <div class="battle-stats">
                    <div class="profile-card">
                        <h3>Helten</h3>
                        <p>Start HP: ${initialCharacterHp}</p>
                        <p>Etter kamp HP: ${characterHp}</p>
                    </div>
                    <div class="profile-card">
                        <h3>Fienden</h3>
                        <p>Start HP: ${initialEnemyHp}</p>
                        <p>Etter kamp HP: ${enemyHp}</p>
                    </div>
                </div>
                <h2>${result}</h2>
            </div>
        `;
    }
    // ✅ Load dữ liệu khi trang tải lại
    updateUI();
    // ✅ Event Listeners
    createCharacterButton.addEventListener("click", createCharacter);
    generateEnemyButton.addEventListener("click", generateEnemy);
    if (typeof module !== "undefined") module.exports = {
        createCharacter,
        generateEnemy,
        startBattle
    };
});

//# sourceMappingURL=index.7c0ccee6.js.map
