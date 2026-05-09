# LifePilot — Demo Script

## 2-3 分钟中文 Demo 讲稿

大家好，这是 LifePilot，一个 AI-powered local life assistant。它解决的问题是：用户周末下午想和家人或朋友出去玩，但不想自己查活动、餐厅、余位、路线和预算。LifePilot 让用户只输入一句自然语言请求，Agent 自动解析需求，调用 Mock API，生成可执行的本地生活 itinerary。

## 1. 开场点击

打开本地 Web UI 后，先让评委看顶部标题和 Chat Input 区域。页面默认已经填入主 Demo 输入。

点击顺序：

1. 确认输入框里是 sample request。
2. 点击 `Run Agent Demo`。
3. 从上到下展示 Parsed Constraints、Agent Planning、Tool Calling Trace、Final Itinerary 和 Share Message。

## 2. Sample Input

使用这个输入：

```text
今天下午是空的，想和老婆、5 岁孩子出去玩几个小时，别离家太远，老婆最近在减肥，帮我安排一下。
```

讲解重点：

- Agent 识别出这是 Family scenario。
- 用户有 5 岁孩子，所以活动要亲子友好。
- 用户说别离家太远，所以 distance preference 是 30 分钟内。
- 老婆最近在减肥，所以餐厅偏向低脂、清淡、少油。

## 3. 展示 Tool Calling Trace

滚动到 `Tool Calling Trace` 区域，说明这不是静态推荐页面，而是一个 Agent planning flow。

可以这样讲：

LifePilot 先调用 `parseUserRequest()` 解析自然语言，再调用 `searchActivities()` 和 `searchRestaurants()` 找候选活动和餐厅。然后 `checkAvailability()` 检查模拟余位，`estimateTravelTime()` 估算移动时间，最后 `createBooking()` 和 `generateShareMessage()` 生成模拟预约和分享文案。

这里的 tools 都是 Mock API，但它们展示了未来接入真实本地生活服务时的接口边界。

## 4. 展示 Final Itinerary

滚动到 `推荐行程 Timeline`，说明最终结果不是搜索列表，而是一份可执行计划：

- 14:00 从家出发
- 14:30 去亲子艺术体验馆
- 16:15 休息和转场
- 17:10 去健康轻食餐厅
- 18:30 回家

同时展示右侧 summary：Selected Activity、Selected Restaurant、Estimated budget、Travel time 和 Booking status。

## 5. 触发异常场景：餐厅满座

回到 Chat Input 区域，打开：

```text
触发异常场景：餐厅满座
```

然后说明：

现在我们模拟首选餐厅已经满座。Agent 不会直接失败，而是根据 Tool Calling result 自动 replanning。

再次查看 Tool Calling Trace：

- `checkAvailability()` 返回首选餐厅满座。
- Agent 再次筛选餐厅或选择替代餐厅。
- `replanItinerary()` 显示已经从原餐厅切换到替代餐厅。
- `createBooking()` 返回 `替代餐厅预约成功`。

再看 Final Itinerary 和右侧 summary，原餐厅不可用的信息已经出现，替代餐厅已经被选中，Booking status 也更新了。

## 6. 为什么这是 Agent，不只是推荐页

最后总结：

LifePilot 不是简单的推荐列表，因为它有三个 Agent 特征：

- 它先理解自然语言，提取结构化 constraints。
- 它按 Planning Strategy 调用多个 tools，并把 tool result 组合成 itinerary。
- 它能处理异常，例如餐厅满座时自动 replanning，而不是让用户重新搜索。

当前 MVP 使用 Mock API，是为了让 Hackathon Demo 稳定、可控，并聚焦在 Agent experience。未来可以把这些 mock tools 替换成真实 Meituan、本地生活、地图和预约服务。
