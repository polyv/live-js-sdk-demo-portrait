import { ONE_PAGE_MSG_COUNT, getListAllCount, handleHistory, needTypes } from './chat-utils';
import { msgSource } from '../../assets/chat/constants';
import chatApi from '../../assets/api/chat';

export default {
  computed: {
    start() {
      return getListAllCount([...this.msgList, ...this.msgQueue]) + this.waitOtherCount;
    },
    end() {
      return this.start + ONE_PAGE_MSG_COUNT - 1;
    }
  },

  methods: {
    // 获取下一页的数据
    async getNextData() {
      let returnData = {
        contents: [],
        prevHiddenCount: 0
      };

      const reqData = {
        roomId: this.roomId || this.channelId,
        start: this.start,
        end: this.end,
        timestamp: Date.now(),
        fullMessage: 1
      };

      const { contents } = await this.reqHistory(reqData);
      const { filterContents, prevHiddenCount } = handleHistory(contents);
      returnData = {
        contents: filterContents,
        prevHiddenCount
      };

      return returnData;
    },

    // 请求拿数据
    async reqHistory(reqData, prevContents = []) {
      reqData = { ...reqData };

      let historyContents = await chatApi.getChatHistory(reqData);

      historyContents = this.setMsgSourse(historyContents);

      let mergeContents = [...prevContents, ...historyContents];

      const filterContents = this.filterHistory(historyContents);

      /**
       * 1. 过滤数少于一页数
       * 2. 获取数大于一页数
       */
      if (filterContents.length < ONE_PAGE_MSG_COUNT && historyContents.length >= ONE_PAGE_MSG_COUNT) {
        const nextStart = this.start + mergeContents.length;
        const nextEnd = nextStart + ONE_PAGE_MSG_COUNT - 1;
        reqData = {
          ...reqData,
          start: nextStart,
          end: nextEnd,
        };
        const nextData = await this.reqHistory(reqData, mergeContents);
        mergeContents = nextData.contents;
      }

      return {
        contents: mergeContents,
      };
    },

    setMsgSourse(list) {
      const newList = [...list];
      for (let i = 0; i < newList.length; i++) {
        const item = newList[i];
        if (!item.msgSource) {
          newList[i].msgSource = msgSource.speak;
        }
      }
      return newList;
    },

    // 过滤历史消息，只要图片和文本消息
    filterHistory(historyList) {
      return historyList.filter(item => needTypes.indexOf(item.msgSource) !== -1);
    },
  }
};
