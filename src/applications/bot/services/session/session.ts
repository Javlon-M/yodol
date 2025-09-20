import type { Card } from "app/domain";

export interface SessionData {
    userId?: string;
    step?: SessionStep;
    deckId?: string;
    cardId?: string;
    front?: string;
    back?: string;
    currentCardIndex?: number;
    studyCards?: Card[];
    editingDeck?: string;
    editingCard?: string;
}

export enum SessionStep {
    // Main states
    BROWSING_DECKS = "browsing_decks",
    STUDYING = "studying",

    // Deck operations
    AWAITING_DECK_NAME = "awaiting_deck_name",
    RENAMING_DECK = "renaming_deck",
    CONFIRMING_DECK_DELETE = "confirming_deck_delete",

    // Card operations
    SELECTING_DECK_FOR_CARD = "selecting_deck_for_card",
    AWAITING_CARD_FRONT = "awaiting_card_front",
    AWAITING_CARD_BACK = "awaiting_card_back",
    VIEWING_CARDS = "viewing_cards",
    EDITING_CARD_FRONT = "editing_card_front",
    EDITING_CARD_BACK = "editing_card_back",
}
