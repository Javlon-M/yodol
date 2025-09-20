import { injectable } from "inversify";
import { BUTTONS } from "../../constants/button.constant";
import { Markup } from "telegraf";


@injectable()
export class MenuButtonService {
    public lang: keyof typeof BUTTONS = 'en';

    getMainMenuKeyboard() {
      return Markup.keyboard([
        [BUTTONS[this.lang].ADD, BUTTONS[this.lang].PLAY, BUTTONS[this.lang].MORE],
      ]).resize();
    }

    getMoreMenuKeyboard() {
      return Markup.keyboard([
        [BUTTONS[this.lang].ACCOUNT, BUTTONS[this.lang].STATS, BUTTONS[this.lang].BROWSE],
        [BUTTONS[this.lang].BACK_TO_MAIN],
      ]).resize();
    }
    
    getAddMenuKeyboard() {
      return Markup.keyboard([
        [BUTTONS[this.lang].NEW_DECK, BUTTONS[this.lang].NEW_CARD],
        [BUTTONS[this.lang].BACK_TO_MAIN]
      ]).resize();
    }
  
    getCancelKeyboard() {
      return Markup.keyboard([[BUTTONS[this.lang].CANCEL]]).resize();
    }
  
    getDeckManagementKeyboard() {
      return Markup.keyboard([
        [BUTTONS[this.lang].RENAME_DECK, BUTTONS[this.lang].DELETE_DECK],
        [BUTTONS[this.lang].VIEW_CARDS, BUTTONS[this.lang].BACK_TO_BROWSE],
      ]).resize();
    }
  
    getCardManagementKeyboard() {
      return Markup.keyboard([
        [BUTTONS[this.lang].EDIT_FRONT, BUTTONS[this.lang].EDIT_BACK],
        [BUTTONS[this.lang].DELETE_CARD],
        [BUTTONS[this.lang].BACK_TO_CARDS]
      ]).resize();
    }
  
    getStudyKeyboard() {
      return Markup.keyboard([
        [BUTTONS[this.lang].SHOW_ANSWER],
        [BUTTONS[this.lang].EDIT_CARD, BUTTONS[this.lang].END_STUDY]
      ]).resize();
    }
  
    getAnswerEvaluationKeyboard() {
      return Markup.keyboard([
        [BUTTONS[this.lang].CORRECT, BUTTONS[this.lang].INCORRECT],
        [BUTTONS[this.lang].EDIT_CARD, BUTTONS[this.lang].END_STUDY]
      ]).resize();
    }
  
    getDeleteConfirmationKeyboard() {
      return Markup.keyboard([
        [BUTTONS[this.lang].CONFIRM_DELETE, BUTTONS[this.lang].CANCEL]
      ]).resize();
    }
  
    getAfterActionKeyboard() {
      return Markup.keyboard([
        [BUTTONS[this.lang].ADD_ANOTHER],
        [BUTTONS[this.lang].BACK_TO_MAIN]
      ]).resize();
    }
}
