const gridDisplay = document.getElementById('game-grid');
const moveDisplay = document.getElementById('move-count');
const resetBtn = document.getElementById('reset-btn');

// --- CẤU HÌNH HÌNH ẢNH MẶT SAU ---
const cardBackImage = "https://img.freepik.com/free-vector/geometric-pattern-design-background_53876-114400.jpg"; 

// Dữ liệu 4 cặp thẻ
const cardArray = [
    { name: 'fire', icon: '🔥' }, { name: 'fire', icon: '🔥' },
    { name: 'water', icon: '💧' }, { name: 'water', icon: '💧' },
    { name: 'star', icon: '⭐' }, { name: 'star', icon: '⭐' },
    { name: 'lightning', icon: '⚡' }, { name: 'lightning', icon: '⚡' }
];

let cardsChosen = [];
let cardsChosenId = [];
let cardsWon = [];
let moves = 0;
let isLockBoard = false;

// 1. Trộn thẻ
function shuffle(array) {
    return array.sort(() => 0.5 - Math.random());
}

// 2. Khởi tạo Game
function createBoard() {
    gridDisplay.innerHTML = '';
    const shuffledCards = shuffle([...cardArray]);
    
    shuffledCards.forEach((item, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.setAttribute('data-id', index);

        // Tạo cấu trúc mặt trước (front) và mặt sau (back)
        card.innerHTML = `
            <div class="card-front">${item.icon}</div>
            <div class="card-back">
                <img src="${cardBackImage}" alt="back-cover">
            </div>
        `;
        
        card.addEventListener('click', flipCard);
        gridDisplay.appendChild(card);
    });
    
    // Reset các thông số
    moves = 0;
    moveDisplay.textContent = moves;
    cardsWon = [];
    cardsChosen = [];
    cardsChosenId = [];
    isLockBoard = false;
}

// 3. Logic lật thẻ
function flipCard() {
    let cardId = this.getAttribute('data-id');

    if (isLockBoard) return;
    if (cardsChosenId.includes(cardId)) return;

    this.classList.add('flipped');
    
    // Lấy tên của thẻ dựa trên mảng đã trộn (cần lưu mảng trộn vào biến toàn cục)
    // Để đơn giản, ta sẽ lấy icon từ mặt front để so sánh
    const cardName = this.querySelector('.card-front').textContent;
    
    cardsChosen.push(cardName);
    cardsChosenId.push(cardId);

    if (cardsChosen.length === 2) {
        moves++;
        moveDisplay.textContent = moves;
        isLockBoard = true;
        setTimeout(checkForMatch, 700);
    }
}

// 4. Kiểm tra khớp
function checkForMatch() {
    const cards = document.querySelectorAll('.card');
    const optionOneId = cardsChosenId[0];
    const optionTwoId = cardsChosenId[1];

    if (cardsChosen[0] === cardsChosen[1]) {
        // Nếu khớp -> Giữ nguyên (không làm gì thêm hoặc thêm hiệu ứng scale)
        cardsWon.push(cardsChosen);
    } else {
        // Nếu không khớp -> Lật lại
        cards[optionOneId].classList.remove('flipped');
        cards[optionTwoId].classList.remove('flipped');
    }

    cardsChosen = [];
    cardsChosenId = [];
    isLockBoard = false;

    // Thông báo thắng
    if (cardsWon.length === cardArray.length / 2) {
        setTimeout(() => {
            alert(`Tuyệt vời! Bạn đã hoàn thành trong ${moves} lượt đi.`);
        }, 500);
    }
}

// Nút chơi lại
resetBtn.addEventListener('click', createBoard);

// Chạy game
createBoard();