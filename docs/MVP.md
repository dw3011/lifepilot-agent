# LifePilot — MVP Definition

## 1. 项目一句话介绍

LifePilot 是一个 AI-powered local life assistant，帮助用户规划 4–6 小时的本地生活出行。用户只需要输入一句自然语言请求，Agent 会理解用户意图，识别时间、同行人、偏好、距离和饮食限制等关键信息，通过 Tool Calling 调用一组 Mock API，最终生成一份可执行的本地生活计划。

这个 MVP 的核心价值不是“搜索结果列表”，而是让用户从“我要自己查活动、餐厅、路线、余位、预算、预订”变成“我说出需求，Agent 帮我安排好”。

## 2. 目标用户场景

在 Meituan Hackathon 的本地生活场景中，用户周末下午突然有空，希望和家人或朋友出门玩 4–6 小时。用户不想手动搜索活动、餐厅、营业时间、余位、路线、预算和预订选项，也不想在多个 App 或页面之间来回比较。

典型场景包括：

- 家庭场景：用户想和伴侣、小孩一起轻松出门，活动需要适合儿童，餐厅要兼顾健康、口味和距离。
- 朋友场景：用户想和 3 个朋友下午出门，既想吃饭，也希望有展览、citywalk 或轻量活动，不想安排得太累。

LifePilot 的目标是用 Agent Planning Strategy 把这些分散决策合并成一个可执行方案。

## 3. Demo 输入样例

家庭场景：

> “今天下午是空的，想和老婆、5 岁孩子出去玩几个小时，别离家太远，老婆最近在减肥，帮我安排一下。”

朋友场景：

> “今天下午想和 3 个朋友出去玩，一共 4 个人，2 男 2 女，希望有吃饭、展览或 citywalk，不想太累。”

## 4. Agent 需要识别的信息

Agent 需要从自然语言中识别并结构化以下信息：

- Time window：例如今天下午、周末下午、4–6 小时。
- People and group type：例如 3 人家庭、4 人朋友局。
- Family or friend scenario：判断是家庭亲子场景，还是朋友轻社交场景。
- Child age：例如 5 岁孩子，用于筛选亲子友好活动。
- Distance preference：例如别离家太远、附近、30 分钟内可达。
- Diet preference：例如减肥、清淡、低脂、忌口。
- Activity preference：例如展览、citywalk、亲子活动、轻松不累。
- Budget if available：如果用户提到预算，需要作为约束条件。
- Final goal：生成一份可执行、低决策成本、适合当前人群的本地生活计划。

## 5. MVP 功能范围

MVP 只包含完成 Demo 所需的最小功能闭环：

- Natural language input：用户输入一句自然语言需求。
- Requirement parsing：Agent 解析时间、人数、关系、偏好、限制条件。
- Mock activity search：从 Mock API 中搜索合适活动。
- Mock restaurant search：从 Mock API 中搜索合适餐厅。
- Availability check：检查活动和餐厅的模拟余位。
- Travel time estimation：估算地点之间的交通时间。
- Itinerary generation：生成时间线和具体行程。
- Simulated booking / ordering action：模拟预订活动或餐厅。
- Shareable plan message：生成可分享给家人或朋友的计划文案。

MVP 不包含以下能力：

- Real payment：不接入真实支付。
- Real Meituan API：不调用真实美团 API。
- Real map navigation：不提供真实地图导航。
- Real SMS sending：不发送真实短信。
- User login system：不做用户登录系统。
- Database：不引入数据库，使用 Mock API 或本地静态数据。

## 6. Agent Tool Chain

MVP 中的 Agent 使用一组 mock tools 来模拟真实本地生活服务能力。

### parseUserRequest()

- Input：用户的自然语言请求。
- Output：结构化需求对象，包括时间窗口、人数、同行关系、儿童年龄、距离偏好、饮食偏好、活动偏好、预算和最终目标。

### searchActivities()

- Input：结构化需求对象中的时间、地点范围、活动偏好、人群类型、儿童年龄等条件。
- Output：候选活动列表，包括活动名称、类型、地址、适合人群、预计时长、价格、是否室内、是否亲子友好。

### searchRestaurants()

- Input：人数、饮食偏好、地点范围、预算、用餐时间、活动地点附近区域。
- Output：候选餐厅列表，包括餐厅名称、菜系、人均价格、地址、健康标签、是否适合儿童、距离活动地点的估算时间。

### checkAvailability()

- Input：候选活动或餐厅、人数、目标时间段。
- Output：可用性结果，包括是否有余位、可选时间、失败原因和备选建议。

### estimateTravelTime()

- Input：出发地、活动地点、餐厅地点，以及交通方式假设。
- Output：地点之间的预计交通时间和简单路线说明。

### createBooking()

- Input：选定的活动或餐厅、人数、时间、用户场景。
- Output：模拟预订结果，包括 bookingId、状态、时间、地点和注意事项。

### generateShareMessage()

- Input：最终行程、时间线、预订状态、预算、交通时间。
- Output：一段适合分享给家人或朋友的计划消息。

## 7. Final Output Format

Agent 的最终输出应该是一份可直接执行的本地生活计划，包含：

- Recommended itinerary：推荐行程概览。
- Timeline：按时间排列的计划，例如 14:00 出发、14:30 活动、17:00 晚餐。
- Activity details：活动名称、地址、亮点、适合原因、预计时长。
- Restaurant details：餐厅名称、菜系、人均价格、饮食适配原因、距离活动地点时间。
- Estimated travel time：从出发地到活动、活动到餐厅、餐厅回家的预计时间。
- Estimated budget：总预算或人均预算估算。
- Booking status：模拟预订状态，例如活动已预约、餐厅已留位。
- Share message：可复制到聊天工具中发送给同行人的简短文案。

## 8. Exception Handling

MVP 需要展示 Agent 遇到约束冲突时的处理能力：

- 如果餐厅已满，Agent 自动切换到另一家符合饮食和距离要求的餐厅。
- 如果天气不好，Agent 将 outdoor activity 切换为 indoor activity，例如展览、亲子馆、室内市集。
- 如果计划超过预算，Agent 选择更便宜的活动或餐厅，并重新计算 Estimated budget。
- 如果活动不适合儿童，Agent 替换为 family-friendly option。
- 如果用户有 diet restrictions，Agent 避开不合适的餐厅，例如高油、高糖、重口味或与忌口冲突的选项。

## 9. Success Criteria for Demo

Demo 成功的标准：

- 用户可以输入一句自然语言请求。
- 系统可以解析关键需求，并以结构化方式展示。
- 系统可以展示 Agent planning steps，让评委看到规划过程。
- 系统可以展示 mock tool calling trace，包括调用了哪些 tools、输入是什么、返回了什么。
- 系统可以输出一份可执行的本地生活计划，而不是普通搜索结果列表。
- 系统可以模拟至少一个 booking 或 ordering action，并展示模拟状态。
