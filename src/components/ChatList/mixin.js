import { liveSdk, PolyvLiveSdk } from '../../assets/live-sdk/live-sdk';
import { config } from '../../assets/utils/config';
import { escapeHTML } from '@utils/string';
import { msgSource } from '../../assets/chat/constants';
import { SELF_SPEAK, bus } from '../../assets/utils/event-bus';
import { SURPLUS_COUNT, filterMaxList } from './chat-utils';

export default {
  data() {
    return {
      msgQueue: [], // 暂存接收的消息
      msgList: [], // 显示的消息列表
      queueHandlerTimer: null, // 处理暂存消息定时器,
      interceptTimer: null,
      newTipsVisible: false,
      isNoMore: false,
      isLoading: false,
      waitOtherCount: 0,
    };
  },

  computed: {
    channelId() {
      return this.channel?.channelId;
    },

    msgUserData() {
      const { userName = '', avatar = config.defaultAvatar, userId = '' } = config.user || {};

      return {
        nick: userName,
        pic: avatar,
        userId,
      };
    },
  },

  props: {
    channel: Object,
  },

  created() {
    liveSdk.on(PolyvLiveSdk.EVENTS.CHAT_IMG, this.handleImgMsg);
    liveSdk.on(PolyvLiveSdk.EVENTS.SPEAK, this.handleSpeak);
    liveSdk.on(PolyvLiveSdk.EVENTS.CUSTOMER_MESSAGE, this.handleOtherMsg);
    liveSdk.on(PolyvLiveSdk.EVENTS.REWARD, this.handleOtherMsg);
    liveSdk.on(PolyvLiveSdk.EVENTS.REMOVE_CONTENT, this.handleRemoveMsg);
    liveSdk.on(PolyvLiveSdk.EVENTS.REMOVE_HISTORY, this.handleRemoveHistory);

    bus.$on(SELF_SPEAK, this.handleSelfSpeak);
  },

  beforeDestroy() {
    liveSdk.off(PolyvLiveSdk.EVENTS.CHAT_IMG, this.handleImgMsg);
    liveSdk.off(PolyvLiveSdk.EVENTS.SPEAK, this.handleSpeak);
    liveSdk.off(PolyvLiveSdk.EVENTS.CUSTOMER_MESSAGE, this.handleOtherMsg);
    liveSdk.off(PolyvLiveSdk.EVENTS.REWARD, this.handleOtherMsg);
    liveSdk.off(PolyvLiveSdk.EVENTS.REMOVE_CONTENT, this.handleRemoveMsg);
    liveSdk.off(PolyvLiveSdk.EVENTS.REMOVE_HISTORY, this.handleRemoveHistory);

    bus.$off(SELF_SPEAK, this.handleSelfSpeak);
    clearInterval(this.queueHandlerTimer);
    clearInterval(this.interceptTimer);
  },

  mounted() {
    if (this.channelId) {
      this.loadHistory(true);
    }

    this.queueHandlerTimer = setInterval(this.msgQueueHandler, 200); // 200 毫秒处理一次队列数据
    this.interceptTimer = setInterval(this.interceptHandler, 5 * 1000);
  },

  methods: {
    async loadHistory(isFirst = false) {
      if (this.isLoading) { return; }
      this.isLoading = true;
      let contents = [];

      const nextData = await this.getNextData();
      this.isLoading = false;
      contents = nextData.contents;

      // 没插入前没有聊天消息则加进等待数目
      if (this.msgList.length === 0) {
        this.waitOtherCount += nextData.prevHiddenCount;
      } else {
        this.msgList[0].hiddenCount += nextData.prevHiddenCount;
      }

      this.msgList = [...contents.reverse(), ...this.msgList];

      if (contents.length === 0) {
        this.isNoMore = true;
        return;
      }

      if (isFirst) {
        this.scrollToBottom();
      } else if (this.isScrollTop) {
        this.scrollToPrevDom();
      }
    },

    // 处理socket图片消息
    handleImgMsg(event, msg) {
      msg.msgSource = msgSource.chatImg;
      msg.hiddenCount = this.waitOtherCount;
      this.waitOtherCount = 0;
      this.msgQueue.push(msg);
    },

    // 处理socket发言消息
    handleSpeak(event, msg) {
      if (
        /error|censor/.test(msg.status) ||
        msg?.user?.userId === config?.user?.userId
      ) return;

      msg.msgSource = msgSource.speak;
      msg.hiddenCount = this.waitOtherCount;
      this.waitOtherCount = 0;
      this.msgQueue.push(msg);
    },

    handleOtherMsg(event) {
      this.waitOtherCount++;
    },

    // 发送speak消息
    handleSelfSpeak(content) {
      if (!content) return;
      content = content.substring(0, 200);
      content = escapeHTML(content);

      this.insertMsgList(content);
      liveSdk.send(content);
    },

    insertMsgList(content) {
      const now = Date.now();
      const localId = now;

      const localMsgData = {
        id: localId,
        user: this.msgUserData,
        time: Date.now(),
        content,
        msgSource: msgSource.speak,
        hiddenCount: this.waitOtherCount,
      };
      this.waitOtherCount = 0;

      this.msgList.push(localMsgData);
      this.scrollToBottom();
    },

    handleRemoveMsg(evt, data) {
      const id = data && data.id;
      let hiddenCount = 0;
      const queueIndex = this.msgQueue.findIndex(item => item.id === id);
      const listIndex = this.msgList.findIndex(item => item.id === id);

      if (queueIndex !== -1) {
        // 处理等待队列中的
        const queueItem = this.msgQueue[queueIndex];
        hiddenCount = queueItem.hiddenCount;
        if (queueIndex === this.msgQueue.length - 1) {
          // 如果是队列头则释放到等待数目
          this.waitOtherCount += hiddenCount;
        } else {
          // 非队列头
          this.msgQueue[queueIndex + 1].hiddenCount += hiddenCount;
        }
        this.msgQueue.splice(queueIndex);
      }

      if (listIndex !== -1) {
        // 处理渲染列表中的
        const listItem = this.msgList[listIndex];
        hiddenCount = listItem.hiddenCount;
        if (listIndex === this.msgList.length - 1) {
          if (this.msgQueue.length) {
            this.msgQueue[0].hiddenCount += hiddenCount;
          } else {
            this.waitOtherCount += hiddenCount;
          }
        } else {
          // 非列表头
          this.msgList[listIndex + 1].hiddenCount += hiddenCount;
        }
        this.msgList = this.msgList.filter((item, index) => index !== listIndex);
      }
    },

    handleRemoveHistory(evt) {
      this.msgQueue = [];
      this.msgList = [];
      this.isNoMore = false;
      this.waitOtherCount = 0;
    },

    msgQueueHandler() {
      if (this.msgQueue && this.msgQueue.length) {
        if (!this.isScrollBottom) {
          this.newTipsVisible = true;
          return;
        }

        this.msgList.push(...this.msgQueue);
        this.msgQueue = [];

        this.scrollToBottom();
      }
    },

    lookNewMsg() {
      this.msgList.push(...this.msgQueue);
      this.msgQueue = [];
      this.newTipsVisible = false;
      this.interceptMsg();
    },

    interceptMsg() {
      if (this.msgList.length > SURPLUS_COUNT) {
        const newList = filterMaxList(this.msgList);
        newList[0].hiddenCount = 0;
        this.msgList = newList;
        this.scrollToBottom();
      }
    },

    interceptHandler() {
      if (this.isScrollBottom) {
        this.interceptMsg();
      }
      if (this.msgQueue.length > SURPLUS_COUNT) {
        const newQueueList = filterMaxList(this.msgQueue);
        this.msgQueue = newQueueList;
      }
    }
  }
};
