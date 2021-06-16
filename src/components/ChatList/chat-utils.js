import { msgSource } from '../../assets/chat/constants';

// 一页显示多少条消息
export const ONE_PAGE_MSG_COUNT = 10;
// 清理显示时最多显示数目
export const SURPLUS_COUNT = 100;
// 聊天室只显示的类型
export const needTypes = [msgSource.chatImg, msgSource.speak];

// 获取列表内的总值
export const getListAllCount = (list) => {
  let count = 0;
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    count++;
    if (typeof item.hiddenCount === 'number') {
      count += item.hiddenCount;
    }
  }
  return count;
};

/**
 * 截取一个列表，保留最新的max长度
 * 被移除的消息转为新列表最旧一个的hiddenCount
 * 注意：list的顺序是[旧->新]
 */
export const filterMaxList = (list, max = SURPLUS_COUNT) => {
  let count = 0;
  let lastIndex = -1;
  const newList = [];
  for (let i = list.length - 1; i >= 0; i--) {
    const item = list[i];
    if (needTypes.indexOf(item.msgSource) !== -1) {
      count++;
    }
    if (count === max) {
      lastIndex = i;
      break;
    }
    newList.unshift(item);
  }
  if (lastIndex !== -1 && newList.length) {
    const cutList = list.slice(0, lastIndex);
    const allCount = getListAllCount(cutList);
    newList[0].hiddenCount += allCount;
  }
  return newList;
};

// 处理历史消息列表，将列表中不需要的消息转换成hiddenCount
export const handleHistory = (list) => {
  let otherCount = 0;
  const newList = [];
  for (let i = list.length - 1; i >= 0; i--) {
    const item = list[i];
    if (needTypes.indexOf(item.msgSource) !== -1) {
      newList.unshift({
        ...item,
        hiddenCount: otherCount
      });
      otherCount = 0;
    } else {
      otherCount++;
    }
  }

  return {
    filterContents: newList,
    prevHiddenCount: otherCount
  };
};
