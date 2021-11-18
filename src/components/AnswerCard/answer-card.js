import { AnswerCard } from '@polyv/interactions-receive-sdk';

let AnswerCardSdk = null;
const getAnswerCardSdk = () => {
  if (!AnswerCardSdk) {
    AnswerCardSdk = new AnswerCard();
  }
  return AnswerCardSdk;
};
export { getAnswerCardSdk };
