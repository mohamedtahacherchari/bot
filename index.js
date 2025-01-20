const TelegramBot = require('node-telegram-bot-api');

// Remplacez par votre token Telegram
const TOKEN = '7973921579:AAEIOKkfTF8qagBI3TDVRV8LmBI9-YD9_Xc';

// Créez une instance du bot
console.log("Initialisation du bot...");
const bot = new TelegramBot(TOKEN, { polling: true });

// Stockage des scores en mémoire
const scores = {};

// Commande /start
bot.onText(/\/start/, (msg) => {
  console.log("Commande /start reçue :", msg);
  const chatId = msg.chat.id;
  const userName = msg.from.first_name;

  scores[chatId] = 0;

  bot.sendMessage(
    chatId,
    `Bienvenue ${userName} ! 🎮\nCe bot vous permet de jouer à un jeu de mathématiques simple.\nTapez /help pour voir les commandes disponibles.`
  );
});

// Commande /help
bot.onText(/\/help/, (msg) => {
  console.log("Commande /help reçue :", msg);
  const chatId = msg.chat.id;

  bot.sendMessage(
    chatId,
    `/start - Démarrer le jeu\n/play - Jouer au jeu\n/score - Voir votre score actuel\n/help - Liste des commandes`
  );
});

// Commande /play
bot.onText(/\/play/, (msg) => {
  console.log("Commande /play reçue :", msg);
  const chatId = msg.chat.id;

  const questionData = generateMathQuestion();
  bot.sendMessage(chatId, `Question : ${questionData.question}`);

  scores[chatId] = scores[chatId] || { score: 0 };
  scores[chatId].currentAnswer = questionData.answer;
});

bot.on('message', (msg) => {
  console.log("Message reçu :", msg.text);
  const chatId = msg.chat.id;
  const userAnswer = parseInt(msg.text);

  if (scores[chatId] && scores[chatId].currentAnswer !== undefined) {
    const correctAnswer = scores[chatId].currentAnswer;

    if (userAnswer === correctAnswer) {
      scores[chatId].score += 10;
      bot.sendMessage(chatId, `Bonne réponse ! ✅ Vous gagnez 10 points. 🎉`);
    } else {
      bot.sendMessage(
        chatId,
        `Mauvaise réponse ! ❌ La bonne réponse était ${correctAnswer}.`
      );
    }

    delete scores[chatId].currentAnswer;
  } else if (!msg.text.startsWith('/')) {
    bot.sendMessage(chatId, `Tapez /play pour commencer une nouvelle question.`);
  }
});

bot.onText(/\/score/, (msg) => {
  console.log("Commande /score reçue :", msg);
  const chatId = msg.chat.id;
  const userScore = scores[chatId]?.score || 0;

  bot.sendMessage(chatId, `Votre score actuel est : ${userScore} points.`);
});

function generateMathQuestion() {
  console.log("Génération d'une question de maths...");
  const a = Math.floor(Math.random() * 10) + 1;
  const b = Math.floor(Math.random() * 10) + 1;
  return {
    question: `Quel est le résultat de ${a} x ${b} ?`,
    answer: a * b,
  };
}
