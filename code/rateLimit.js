/**
 * 限流算法实战：从计数器到令牌桶
 */

// 1. 固定窗口计数器 (Fixed Window Counter)
class FixedWindowRateLimiter {
    constructor(limit, windowMs) {
        this.limit = limit;
        this.windowMs = windowMs;
        this.count = 0;
        this.startTime = Date.now();
    }

    allowRequest() {
        const now = Date.now();
        if (now - this.startTime > this.windowMs) {
            // 窗口过期，重置
            this.count = 0;
            this.startTime = now;
        }

        if (this.count < this.limit) {
            this.count++;
            return true;
        }
        return false;
    }
}

// 2. 滑动窗口日志 (Sliding Window Log)
class SlidingWindowLogRateLimiter {
    constructor(limit, windowMs) {
        this.limit = limit;
        this.windowMs = windowMs;
        this.requests = [];
    }

    allowRequest() {
        const now = Date.now();
        // 移除窗口外的请求
        this.requests = this.requests.filter(time => now - time <= this.windowMs);

        if (this.requests.length < this.limit) {
            this.requests.push(now);
            return true;
        }
        return false;
    }
}

// 3. 漏桶算法 (Leaky Bucket)
class LeakyBucketRateLimiter {
    constructor(capacity, leakRate) {
        this.capacity = capacity; // 桶容量
        this.leakRate = leakRate; // 漏水速率 (ms/request)
        this.water = 0;           // 当前水量
        this.lastLeakTime = Date.now();
    }

    allowRequest() {
        const now = Date.now();
        // 计算漏出的水量
        const leaked = Math.floor((now - this.lastLeakTime) / this.leakRate);
        if (leaked > 0) {
            this.water = Math.max(0, this.water - leaked);
            this.lastLeakTime = now;
        }

        if (this.water < this.capacity) {
            this.water++;
            return true;
        }
        return false;
    }
}

// 4. 令牌桶算法 (Token Bucket)
class TokenBucketRateLimiter {
    constructor(capacity, refillRate) {
        this.capacity = capacity;   // 桶容量
        this.tokens = capacity;     // 当前令牌数
        this.refillRate = refillRate; // 补充速率 (tokens/ms)
        this.lastRefillTime = Date.now();
    }

    allowRequest() {
        const now = Date.now();
        // 补充令牌
        const newTokens = (now - this.lastRefillTime) * this.refillRate;
        if (newTokens > 0) {
            this.tokens = Math.min(this.capacity, this.tokens + newTokens);
            this.lastRefillTime = now;
        }

        if (this.tokens >= 1) {
            this.tokens--;
            return true;
        }
        return false;
    }
}

// 测试模拟
console.log("--- 限流算法测试 ---");
const limiter = new TokenBucketRateLimiter(5, 0.1); // 容量5，每10ms补充一个
let allowed = 0;
for (let i = 0; i < 10; i++) {
    if (limiter.allowRequest()) allowed++;
}
console.log(`发送10个请求，通过: ${allowed}`);
