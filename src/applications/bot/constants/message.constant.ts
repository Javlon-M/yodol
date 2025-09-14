export const MESSAGES = {
    en: {
        // Welcome
        WELCOME: `👋 Welcome to Yodol Bot!  
        Here you can manage your decks, study cards, and track your progress.  

        📚 Use the menu to get started.  
        ❓ If you need help, just type /help.`,
        // Errors
        NO_DECKS: '❌ You don\'t have any decks yet!\nPlease create a deck first.',
        NO_DECK_SELECTED: '❌ No deck selected!',
        NO_CARD_SELECTED: '❌ No card selected!',
        USER_NOT_FOUND: '❌ User not found!',
        DECK_NOT_FOUND: '❌ Deck not found!',
        CARD_NOT_FOUND: '❌ Card not found!',
        MISSING_INFO: '❌ Missing required information!',
        ERROR_GENERIC: '❌ An error occurred. Please try again.',
        UNKNOWN_COMMAND: '❓ I didn\'t understand that command.\nPlease use the menu buttons below:',
        ERROR_CREATING_DECK: '❌ Error creating deck. Please try again',
        ERROR_CREATING_CARD: '❌ Error creating card. Please try again',
        ERROR_UPDATING_CARD: '❌ Error updating card. Please try again.',
        ACTIVE_GAME_NOT_FOUND: '❌ Faol o\'yin topilmadi!',
        
        // Success Messages
        DECK_CREATED: '✅ Deck "{name}" created successfully!',
        CARD_CREATED: '✅ Card created successfully!',
        DECK_RENAMED: '✅ Deck renamed to "{name}" successfully!',
        DECK_DELETED: '✅ Deck and all its cards have been deleted successfully!',
        CARD_UPDATED: '✅ Card updated successfully!',
        CARD_DELETED: '✅ Card deleted successfully!',
        CARD_BACK_UPDATED: `✅ Card back updated successfully!`,
        
        // Study Messages
        NO_DUE_CARDS: '✅ No cards due for review in this deck!\nCome back later.',
        STUDY_COMPLETE: '🎉 Study session complete!\nGreat job!',
        CORRECT_ANSWER: '✅ Correct! Card scheduled for later review.',
        INCORRECT_ANSWER: '❌ Don\'t worry! Card will be shown again soon.',
        STUDY_ERROR: '❌ Study session error!',
        NO_ACTIVE_STUDY: '❌ No active study session!',
        DID_YOU_REMEMBER_CORRECTLY: '❓ Did you remember it correctly?',
        NO_CARD_EVALUATE: '❌ No card to evaluate!',

        // Prompts
        ENTER_DECK_NAME: '📦 Enter the name for your new deck:',
        SELECT_DECK: '🃏 Select a deck to add the card to:',
        ENTER_CARD_FRONT: '🃏 Enter the front side (question) of the card:',
        ENTER_CARD_BACK: '🃏 Now enter the back side (answer) of the card:',
        ENTER_NEW_DECK_NAME: '✏️ Enter the new name for this deck:',
        ENTER_NEW_FRONT: '✏️ Enter the new front side (question) for this card:',
        ENTER_NEW_BACK: '✏️ Enter the new back side (answer) for this card:',
        CONFIRM_DELETE_DECK: '⚠️ Are you sure you want to delete this deck?\nThis will permanently delete all cards in it!',
        NO_CARDS: '📭 This deck has no cards yet!\nAdd some cards to get started.',
        CARDS_IN_DECK: '📋 Cards in this deck:\n\n',
        
        // Menu Titles
        BROWSE_DECKS: '🔍 Browse Decks:\nSelect a deck to manage:',
        ADD_MENU: '➕ What would you like to add?',
        WHAT_TO_DO_NEXT: 'What would you like to do next?',
        WHAT_TO_DO: 'What would you like to do?',

        //common
        GLOBAL_ERROR: "⚠️ Oops, something went wrong. Please try again later.",
    },
}
