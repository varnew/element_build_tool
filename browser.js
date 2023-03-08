const puppeteer = require("puppeteer");

let browser = null;
async function buildBrowser(headless = false) {
  if (browser) return browser;
  browser = await puppeteer.launch({
    headless,
  });
  // 监听浏览器窗口关闭事件
  browser.on("targetdestroyed", (target) => {
    if (target === page.target()) {
      browser.close();
      browser = null;
      page = null;
      console.log("监测到浏览器关闭，执行清除browser、page");
    }
  });
  return browser;
}
let page = null;
async function buildPage(browser, searchText) {
  if (page) return page;
  searchText = unde
  const url = encodeURI(`https://you.com/search`);
  page = await browser.newPage({ javascriptEnabled: true });
  await page.setDefaultNavigationTimeout(1000 * 60 * 60 * 24);
  await page.goto(url);
  return page;
}

async function getResult(page, searchText, history = []) {
  let chat = history;
  let url = `https://you.com/api/streamingSearch?q=${encodeURI(
    searchText
  )}&page=1&count=1000&safeSearch=Moderate&onShoppingPage=false&responseFilter=WebPages,Translations,TimeZone,Computation,RelatedSearches&domain=youchat&queryTraceId=f70b483f-1431-4790-9e25-ce645dc7c860&chat=${encodeURI(
    chat
  )}&chatId=f70b483f-1431-4790-9e25-ce645dc7c860'`;
  console.log("等待页面完全加载");
  const res = await page.evaluate(
    (options) => {
      const { url } = options;
      return new Promise((resolve, reject) => {
        try {
          let result = "";
          const evtSource = new EventSource(url);
          evtSource.addEventListener("youChatToken", function (e) {
            const text = JSON.parse(e.data).youChatToken;
            console.log(decodeURI(text));
            result += text;
          });
          evtSource.addEventListener("done", () => {
            evtSource.close();
            resolve(result);
          });
        } catch (error) {
          reject(error);
        }
      });
    },
    { url }
  );
  return res;
}

/**
 * @desc: 请求回答
 * @params:
 * text { String } 当前的提问
 * history { Array } 历史问答
 *  { question: "", answer: "" }
 */

async function featch(text, history = []) {
  const browser = await buildBrowser(false);
  const page = await buildPage(browser, text);
  const res = await getResult(page, text, history);
  console.log(`${text}：`, res);
  return res;
}
// featch("用中文回答");
// featch("你会跳舞吗");
// featch("你会做什么");
// featch("活着的意义是什么");
// featch("你知道javascript吗");
// featch("你好");

module.exports = featch;
