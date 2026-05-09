# LifePilot — Design Notes

## 1. Planning Strategy

LifePilot 的 Planning Strategy 是把用户的一句话请求拆成可执行的本地生活决策链：

1. 解析需求：识别时间窗口、同行人、亲子或朋友场景、儿童年龄、距离偏好、饮食偏好、活动偏好和预算。
2. 选择活动：优先匹配时间、距离、人群类型和活动强度。
3. 选择餐厅：结合人数、饮食偏好、儿童友好程度、预算和活动地点附近区域。
4. 检查可用性：用 Mock availability 判断活动和餐厅是否可预约。
5. 估算移动成本：给出出发、转场和返程的 travel time。
6. 生成计划：输出 timeline、预算、booking status 和 share message。

这个 MVP 强调的是 Agent 如何把多个约束整合成一个可执行 itinerary，而不是只展示推荐列表。

## 2. Tool Calling Chain

当前 Demo 使用以下 mock tools：

- `parseUserRequest()`：把自然语言转为结构化需求。
- `searchActivities()`：根据场景和偏好返回候选活动。
- `searchRestaurants()`：根据饮食、人数、位置和预算返回候选餐厅。
- `checkAvailability()`：检查模拟余位。
- `estimateTravelTime()`：估算地点之间的移动时间。
- `createBooking()`：生成模拟预约结果。
- `generateShareMessage()`：生成可分享给同行人的计划文案。

Web UI 会展示 Tool Calling Trace，让评委可以看到 Agent 调用了哪些 tools、输入是什么、输出是什么。

## 3. Exception Handling

MVP 中实现了一个清晰的异常处理场景：餐厅满座。

当打开 `触发异常场景：餐厅满座` 后：

1. `checkAvailability()` 返回首选餐厅不可用。
2. Agent 触发 replanning。
3. Agent 再次筛选餐厅或选择候选列表中的替代餐厅。
4. `createBooking()` 对替代餐厅返回 `替代餐厅预约成功`。
5. Final itinerary 更新为替代餐厅方案。

这个流程展示了 LifePilot 不是静态推荐页，而是可以根据 tool result 调整计划的 Agent。

## 4. Why Mock APIs Are Used

本项目是 Hackathon MVP，目标是在有限时间内验证 Agent planning experience。因此使用 Mock API 有三个原因：

- 降低集成成本：不依赖真实 Meituan API、支付、地图、短信或数据库。
- 提高 Demo 稳定性：评审现场不会因为外部服务、账号权限或网络问题失败。
- 聚焦核心概念：展示需求解析、Tool Calling、规划、异常处理和最终计划生成。

Mock API 的数据结构可以在未来替换为真实服务返回，但当前 Demo 不产生真实订单或支付行为。

## 5. MVP Limitations and Future Improvements

当前限制：

- 只覆盖一个主家庭出行 Demo 和一个餐厅满座异常。
- 活动、餐厅、预算和路线都是 mock data。
- 没有用户登录、历史偏好、真实地图导航、真实支付或真实预订。
- Agent planning summary 是前端可解释流程，不是完整生产级 Agent orchestration。

未来可以改进：

- 接入真实商家、活动、团购、排队和预约数据。
- 支持多轮对话，让用户调整预算、距离、活动类型和时间。
- 增加天气、儿童友好、饮食忌口、无障碍等更多 constraints。
- 支持多个候选 itinerary 对比。
- 将 Tool Calling Chain 接入真实 LLM function calling 或 Agent framework。
