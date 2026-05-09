export const SAMPLE_REQUEST =
  "今天下午是空的，想和老婆、5 岁孩子出去玩几个小时，别离家太远，老婆最近在减肥，帮我安排一下。";

export type ParsedRequirements = {
  timeWindow: string;
  people: string;
  scenario: string;
  childAge: string;
  distancePreference: string;
  dietPreference: string;
  activityPreference: string;
  budget: string;
  finalGoal: string;
};

export type Activity = {
  name: string;
  type: string;
  address: string;
  duration: string;
  price: number;
  indoor: boolean;
  familyFriendly: boolean;
  reason: string;
};

export type Restaurant = {
  name: string;
  cuisine: string;
  address: string;
  pricePerPerson: number;
  healthTags: string[];
  childFriendly: boolean;
  reason: string;
};

export type ToolTrace = {
  tool: string;
  input: string;
  output: string;
};

export type TimelineItem = {
  time: string;
  title: string;
  detail: string;
};

export type Booking = {
  bookingId: string;
  status: string;
  target: string;
  note: string;
};

export type AvailabilityResult = {
  available: boolean;
  message: string;
};

export type LifePilotPlan = {
  parsed: ParsedRequirements;
  agentSteps: string[];
  toolTrace: ToolTrace[];
  activity: Activity;
  restaurant: Restaurant;
  originalRestaurant?: Restaurant;
  exceptionNote?: string;
  travelTimes: {
    homeToActivity: string;
    activityToRestaurant: string;
    restaurantToHome: string;
  };
  timeline: TimelineItem[];
  estimatedBudget: string;
  booking: Booking;
  shareMessage: string;
};

export function parseUserRequest(request: string): ParsedRequirements {
  const hasChild = /孩子|小孩|儿童|岁/.test(request);
  const hasWife = /老婆|太太|妻子|伴侣/.test(request);
  const dieting = /减肥|低脂|清淡|健康/.test(request);

  return {
    timeWindow: request.includes("下午") ? "今天下午，约 4-6 小时" : "近期半天，约 4-6 小时",
    people: hasWife && hasChild ? "3 人：用户、伴侣、1 名儿童" : "多人同行",
    scenario: hasChild ? "Family scenario / 亲子家庭出行" : "Friend scenario / 朋友轻社交",
    childAge: hasChild ? "5 岁" : "未提及",
    distancePreference: /别离家太远|附近|不远/.test(request) ? "离家不远，优先 30 分钟内可达" : "距离未明确，默认 30 分钟内",
    dietPreference: dieting ? "减脂、清淡、低油，避免重口味" : "未提及，默认大众口味",
    activityPreference: hasChild ? "轻松、亲子友好、不要太累" : "吃饭、展览或 citywalk，轻松不累",
    budget: "未明确，按中等预算规划",
    finalGoal: "生成一份可直接执行、适合同行人的本地生活行程"
  };
}

export function searchActivities(requirements: ParsedRequirements): Activity[] {
  return [
    {
      name: "城市亲子艺术体验馆",
      type: "Indoor activity / 亲子艺术体验",
      address: "生活广场 3F",
      duration: "90 分钟",
      price: 168,
      indoor: true,
      familyFriendly: true,
      reason: `匹配 ${requirements.scenario}，室内轻松，适合 5 岁孩子参与。`
    },
    {
      name: "河畔轻量 citywalk",
      type: "Outdoor activity / citywalk",
      address: "河畔公园入口",
      duration: "75 分钟",
      price: 0,
      indoor: false,
      familyFriendly: true,
      reason: "免费且轻松，但受天气影响。"
    }
  ];
}

export function searchRestaurants(requirements: ParsedRequirements): Restaurant[] {
  return [
    {
      name: "轻食亲子餐厅 Green Bowl",
      cuisine: "轻食 / 健康简餐",
      address: "生活广场 2F",
      pricePerPerson: 72,
      healthTags: ["低脂", "高蛋白", "儿童餐", "少油"],
      childFriendly: true,
      reason: `匹配 ${requirements.dietPreference}，同楼层移动成本低。`
    },
    {
      name: "家常小馆",
      cuisine: "本地家常菜",
      address: "生活广场北门",
      pricePerPerson: 58,
      healthTags: ["可选清淡", "人均较低"],
      childFriendly: true,
      reason: "预算更低，但健康标签不如首选餐厅明确。"
    }
  ];
}

export function checkAvailability(
  target: Activity | Restaurant,
  peopleCount: number,
  options: { forceRestaurantFull?: boolean } = {}
): AvailabilityResult {
  if ("pricePerPerson" in target && target.name.includes("Green Bowl")) {
    if (options.forceRestaurantFull) {
      return {
        available: false,
        message: `${target.name} 17:10 已满座，无法为 ${peopleCount} 人留位。`
      };
    }

    return {
      available: true,
      message: `${target.name} 17:10 可为 ${peopleCount} 人留位。`
    };
  }

  return {
    available: true,
    message: `${target.name} 当前有余位，可直接预约。`
  };
}

export function estimateTravelTime() {
  return {
    homeToActivity: "约 22 分钟",
    activityToRestaurant: "步行约 4 分钟",
    restaurantToHome: "约 25 分钟"
  };
}

export function createBooking(activity: Activity, restaurant: Restaurant, options: { fallback?: boolean } = {}): Booking {
  return {
    bookingId: options.fallback ? "MOCK-LP-FALLBACK-0524" : "MOCK-LP-0524",
    status: options.fallback ? "替代餐厅预约成功" : "模拟预订成功",
    target: `${activity.name} + ${restaurant.name}`,
    note: "Mock booking only：未产生真实支付、真实订单或短信通知。"
  };
}

export function generateShareMessage(plan: {
  activity: Activity;
  restaurant: Restaurant;
  estimatedBudget: string;
  booking: Booking;
}) {
  return `今天下午安排好了：先去「${plan.activity.name}」玩 90 分钟，再去「${plan.restaurant.name}」吃轻食简餐。整体不远、不太累，适合孩子，也照顾减脂需求。预计预算 ${plan.estimatedBudget}，${plan.booking.status}。`;
}

export function buildLifePilotPlan(request: string, options: { restaurantFull?: boolean } = {}): LifePilotPlan {
  const parsed = parseUserRequest(request);
  const activities = searchActivities(parsed);
  const activity = activities[0];
  const restaurants = searchRestaurants(parsed);
  const originalRestaurant = restaurants[0];
  const activityAvailability = checkAvailability(activity, 3);
  const firstRestaurantAvailability = checkAvailability(originalRestaurant, 3, {
    forceRestaurantFull: options.restaurantFull
  });
  const fallbackRestaurants = options.restaurantFull ? searchRestaurants(parsed).slice(1) : [];
  const restaurant = firstRestaurantAvailability.available ? originalRestaurant : (fallbackRestaurants[0] ?? originalRestaurant);
  const fallbackAvailability =
    options.restaurantFull && restaurant ? checkAvailability(restaurant, 3) : undefined;
  const travelTimes = estimateTravelTime();
  const booking = createBooking(activity, restaurant, {
    fallback: options.restaurantFull && restaurant.name !== originalRestaurant.name
  });
  const estimatedBudget =
    options.restaurantFull && restaurant.name !== originalRestaurant.name ? "约 340-390 元 / 3 人" : "约 380-430 元 / 3 人";
  const shareMessage = generateShareMessage({
    activity,
    restaurant,
    estimatedBudget,
    booking
  });

  return {
    parsed,
    agentSteps: [
      "理解用户的自然语言请求，识别家庭出行、今天下午、5 岁儿童、距离和减脂饮食偏好。",
      "优先选择室内、亲子友好、移动成本低的活动，避免过累或太远。",
      "根据减脂和儿童友好要求筛选餐厅，优先低脂、清淡、同区域可达。",
      options.restaurantFull
        ? "检查 Mock availability 后发现首选餐厅满座，触发 Agent replanning。"
        : "检查 Mock availability，确认活动和餐厅在目标时间段可用。",
      options.restaurantFull
        ? `重新选择同区域替代餐厅「${restaurant.name}」，并确认可为 3 人留位。`
        : "保留首选餐厅，继续生成完整 itinerary。",
      "估算路程时间和预算，生成可执行 timeline，并模拟 booking。"
    ],
    toolTrace: [
      {
        tool: "parseUserRequest()",
        input: request,
        output: "已解析时间、人数、亲子场景、儿童年龄、距离偏好、饮食偏好和最终目标。"
      },
      {
        tool: "searchActivities()",
        input: "Family scenario, 5 岁儿童, 30 分钟内, 下午 4-6 小时",
        output: `返回 ${activities.length} 个活动，首选「${activity.name}」。`
      },
      {
        tool: "searchRestaurants()",
        input: "3 人, 减脂低油, 亲子友好, 活动地点附近",
        output: `返回 ${restaurants.length} 个餐厅，首选「${originalRestaurant.name}」。`
      },
      {
        tool: "checkAvailability()",
        input: `${activity.name}, ${originalRestaurant.name}, 3 人`,
        output: `${activityAvailability.message} ${firstRestaurantAvailability.message}`
      },
      ...(options.restaurantFull
        ? [
            {
              tool: "searchRestaurants()",
              input: `fallback: ${originalRestaurant.name} unavailable, 继续筛选同区域低脂亲子友好餐厅`,
              output: `选择替代餐厅「${restaurant.name}」。${fallbackAvailability?.message ?? ""}`
            }
          ]
        : []),
      ...(options.restaurantFull
        ? [
            {
              tool: "checkAvailability()",
              input: `${restaurant.name}, 3 人, 17:10`,
              output: fallbackAvailability?.message ?? `${restaurant.name} 当前有余位，可直接预约。`
            }
          ]
        : []),
      {
        tool: "replanItinerary()",
        input: options.restaurantFull ? "首选餐厅满座，替换餐厅并更新预算、booking 和分享文案" : "无异常，沿用原计划",
        output: options.restaurantFull
          ? `已从「${originalRestaurant.name}」切换到「${restaurant.name}」。`
          : "无需重规划。"
      },
      {
        tool: "estimateTravelTime()",
        input: "家 -> 活动 -> 餐厅 -> 家",
        output: `去程 ${travelTimes.homeToActivity}，活动到餐厅 ${travelTimes.activityToRestaurant}，返程 ${travelTimes.restaurantToHome}。`
      },
      {
        tool: "createBooking()",
        input: `${activity.name} + ${restaurant.name}`,
        output: `${booking.status}，bookingId: ${booking.bookingId}`
      },
      {
        tool: "generateShareMessage()",
        input: "最终 itinerary + booking status",
        output: "已生成可分享计划消息。"
      }
    ],
    activity,
    restaurant,
    originalRestaurant: options.restaurantFull ? originalRestaurant : undefined,
    exceptionNote: options.restaurantFull
      ? `Original restaurant unavailable：${originalRestaurant.name} 满座，Agent 已选择替代餐厅 ${restaurant.name}。`
      : undefined,
    travelTimes,
    timeline: [
      {
        time: "14:00",
        title: "从家出发",
        detail: `打车或自驾前往活动地点，预计 ${travelTimes.homeToActivity}。`
      },
      {
        time: "14:30",
        title: activity.name,
        detail: `${activity.duration} 的亲子艺术体验，室内轻松，适合孩子。`
      },
      {
        time: "16:15",
        title: "休息和转场",
        detail: options.restaurantFull
          ? `首选餐厅「${originalRestaurant.name}」满座，Agent 改选「${restaurant.name}」，转场预计 ${travelTimes.activityToRestaurant}。`
          : `同一生活广场内步行，预计 ${travelTimes.activityToRestaurant}。`
      },
      {
        time: "17:10",
        title: restaurant.name,
        detail: `${restaurant.cuisine}，人均约 ${restaurant.pricePerPerson} 元，低脂清淡。`
      },
      {
        time: "18:30",
        title: "回家",
        detail: `预计 ${travelTimes.restaurantToHome}，整体行程不赶。`
      }
    ],
    estimatedBudget,
    booking,
    shareMessage
  };
}
