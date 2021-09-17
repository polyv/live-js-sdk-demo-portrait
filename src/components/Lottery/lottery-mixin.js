import { Lottery } from '@polyv/interactions-receive-sdk';

let LotterySdk = null;
const getLotterySdk = () => {
  if (!LotterySdk) {
    LotterySdk = new Lottery();
  }
  return LotterySdk;
};
export { getLotterySdk };
